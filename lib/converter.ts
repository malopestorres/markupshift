export type OutputLanguage = "typescript" | "javascript";
export type SplitMode = "single" | "top-level";

export interface ConvertedFile {
  name: string;
  componentName: string;
  code: string;
}

export interface ConvertOptions {
  language: OutputLanguage;
  splitMode: SplitMode;
  rootName?: string;
}

export const FULL_DOCUMENT_ERROR =
  "Paste only the visual markup from inside <body>. Remove <!DOCTYPE>, <html>, <head>, and <body>.";

const ATTRIBUTE_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  readonly: "readOnly",
  maxlength: "maxLength",
  minlength: "minLength",
  colspan: "colSpan",
  rowspan: "rowSpan",
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  contenteditable: "contentEditable",
  crossorigin: "crossOrigin",
  datetime: "dateTime",
  enctype: "encType",
  formaction: "formAction",
  novalidate: "noValidate",
  srcset: "srcSet",
  usemap: "useMap",
  charset: "charSet",
  "http-equiv": "httpEquiv",
  "accept-charset": "acceptCharset",
};

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const BOOLEAN_ATTRIBUTES = new Set([
  "allowFullScreen",
  "async",
  "autoFocus",
  "autoPlay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formNoValidate",
  "hidden",
  "loop",
  "multiple",
  "muted",
  "noValidate",
  "open",
  "playsInline",
  "readOnly",
  "required",
  "reversed",
  "selected",
]);

const CSS_NUMBER_PROPERTIES = new Set([
  "animationIterationCount",
  "borderImageOutset",
  "borderImageSlice",
  "borderImageWidth",
  "columnCount",
  "flex",
  "flexGrow",
  "flexShrink",
  "fontWeight",
  "gridArea",
  "gridColumn",
  "gridColumnEnd",
  "gridColumnStart",
  "gridRow",
  "gridRowEnd",
  "gridRowStart",
  "lineClamp",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "scale",
  "tabSize",
  "widows",
  "zIndex",
  "zoom",
]);

function toPascalCase(value: string): string {
  const result = value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");

  if (!result) return "Component";
  return /^\d/.test(result) ? `Component${result}` : result;
}

function inferComponentName(element: Element, index: number): string {
  const explicitName = element.getAttribute("data-component");
  if (explicitName) return toPascalCase(explicitName);

  if (element.id) return toPascalCase(element.id);

  const meaningfulClass = Array.from(element.classList).find(
    (name) => !/^(flex|grid|block|hidden|container|wrapper|row|col)$/i.test(name),
  );
  if (meaningfulClass) return toPascalCase(meaningfulClass);

  const semanticNames: Record<string, string> = {
    header: "Header",
    nav: "Navigation",
    main: "MainContent",
    footer: "Footer",
    aside: "Sidebar",
    form: "Form",
    section: `Section${index + 1}`,
    article: `Article${index + 1}`,
  };

  return semanticNames[element.tagName.toLowerCase()] ?? `Component${index + 1}`;
}

function escapeText(value: string): string {
  return value
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function cssPropertyToCamelCase(property: string): string {
  if (property.startsWith("--")) return property;
  return property
    .trim()
    .replace(/^-ms-/, "ms-")
    .replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function styleToJsx(style: string): string {
  const declarations = style
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((declaration) => {
      const colonIndex = declaration.indexOf(":");
      if (colonIndex === -1) return null;

      const property = cssPropertyToCamelCase(
        declaration.slice(0, colonIndex).trim(),
      );
      const rawValue = declaration.slice(colonIndex + 1).trim();
      const key = property.startsWith("--") ? `"${property}"` : property;
      const numericValue = Number(rawValue);
      const value =
        rawValue !== "" &&
        Number.isFinite(numericValue) &&
        CSS_NUMBER_PROPERTIES.has(property)
          ? String(numericValue)
          : JSON.stringify(rawValue);

      return `${key}: ${value}`;
    })
    .filter(Boolean);

  return `{{ ${declarations.join(", ")} }}`;
}

function eventAttributeName(name: string): string {
  const eventName = name.slice(2);
  return `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
}

function serializeAttributes(element: Element): string {
  return Array.from(element.attributes)
    .filter((attribute) => attribute.name !== "data-component")
    .map((attribute) => {
      const lowerName = attribute.name.toLowerCase();
      const mappedName =
        ATTRIBUTE_MAP[lowerName] ??
        (lowerName.startsWith("on") ? eventAttributeName(lowerName) : attribute.name);

      if (lowerName === "style") {
        return ` style=${styleToJsx(attribute.value)}`;
      }

      if (BOOLEAN_ATTRIBUTES.has(mappedName) && attribute.value === "") {
        return ` ${mappedName}`;
      }

      if (lowerName.startsWith("on")) {
        return ` ${mappedName}={() => { /* TODO: ${escapeAttribute(attribute.value)} */ }}`;
      }

      return ` ${mappedName}="${escapeAttribute(attribute.value)}"`;
    })
    .join("");
}

function serializeNode(node: Node, depth: number): string {
  const indent = "  ".repeat(depth);

  if (node.nodeType === Node.TEXT_NODE) {
    const normalized = node.textContent?.replace(/\s+/g, " ").trim();
    return normalized ? `${indent}${escapeText(normalized)}` : "";
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    return `${indent}{/* ${node.textContent?.trim() ?? ""} */}`;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const element = node as Element;
  const tagName = element.tagName.toLowerCase();
  const attributes = serializeAttributes(element);

  if (VOID_ELEMENTS.has(tagName)) {
    return `${indent}<${tagName}${attributes} />`;
  }

  const children = Array.from(element.childNodes)
    .map((child) => serializeNode(child, depth + 1))
    .filter(Boolean);

  if (children.length === 0) {
    return `${indent}<${tagName}${attributes}></${tagName}>`;
  }

  if (
    children.length === 1 &&
    element.childNodes[0]?.nodeType === Node.TEXT_NODE &&
    children[0].trim().length < 80
  ) {
    return `${indent}<${tagName}${attributes}>${children[0].trim()}</${tagName}>`;
  }

  return [
    `${indent}<${tagName}${attributes}>`,
    ...children,
    `${indent}</${tagName}>`,
  ].join("\n");
}

function createComponentCode(
  componentName: string,
  jsx: string,
  language: OutputLanguage,
): string {
  const returnType = language === "typescript" ? ": React.JSX.Element" : "";
  const reactImport =
    language === "typescript" ? 'import type React from "react";\n\n' : "";

  return `${reactImport}export default function ${componentName}()${returnType} {
  return (
${jsx}
  );
}
`;
}

function parseHtml(html: string): Document {
  if (typeof DOMParser === "undefined") {
    throw new Error("This converter requires a browser-like DOM environment.");
  }

  return new DOMParser().parseFromString(html, "text/html");
}

export function validateHtmlFragment(html: string): string | null {
  const contentToValidate = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(
      /<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
      (_match, tagName: string) => `<${tagName}></${tagName}>`,
    );

  const hasDoctype = /<\s*!doctype\b/i.test(contentToValidate);
  const hasDocumentTag = /<\s*\/?\s*(?:html|head|body)\b/i.test(
    contentToValidate,
  );

  return hasDoctype || hasDocumentTag ? FULL_DOCUMENT_ERROR : null;
}

export function convertHtml(
  html: string,
  options: ConvertOptions,
): ConvertedFile[] {
  if (!html.trim()) return [];

  const validationError = validateHtmlFragment(html);
  if (validationError) {
    throw new Error(validationError);
  }

  const document = parseHtml(html);
  const elements = Array.from(document.body.children);
  if (elements.length === 0) return [];

  const extension = options.language === "typescript" ? "tsx" : "jsx";

  if (options.splitMode === "single" || elements.length === 1) {
    const componentName = toPascalCase(options.rootName || "ConvertedComponent");
    const serializedElements = elements.map((element) =>
      serializeNode(element, 3),
    );
    const jsx =
      serializedElements.length === 1
        ? serializedElements[0]
        : ["      <>", ...serializedElements, "      </>"].join("\n");

    return [
      {
        componentName,
        name: `${componentName}.${extension}`,
        code: createComponentCode(componentName, jsx, options.language),
      },
    ];
  }

  const usedNames = new Map<string, number>();

  return elements.map((element, index) => {
    const inferredName = inferComponentName(element, index);
    const occurrence = usedNames.get(inferredName) ?? 0;
    usedNames.set(inferredName, occurrence + 1);
    const componentName =
      occurrence === 0 ? inferredName : `${inferredName}${occurrence + 1}`;

    return {
      componentName,
      name: `${componentName}.${extension}`,
      code: createComponentCode(
        componentName,
        serializeNode(element, 3),
        options.language,
      ),
    };
  });
}

import { describe, expect, it } from "vitest";
import {
  convertHtml,
  FULL_DOCUMENT_ERROR,
  validateHtmlFragment,
} from "./converter";

describe("convertHtml", () => {
  it("converts React-specific attributes and inline styles", () => {
    const [file] = convertHtml(
      '<label for="email" class="field" style="font-weight: 600; background-color: red;">Email</label>',
      { language: "typescript", splitMode: "single", rootName: "Field" },
    );

    expect(file.name).toBe("Field.tsx");
    expect(file.code).toContain('htmlFor="email"');
    expect(file.code).toContain('className="field"');
    expect(file.code).toContain(
      'style={{ fontWeight: 600, backgroundColor: "red" }}',
    );
  });

  it("creates one file per top-level element with inferred names", () => {
    const files = convertHtml(
      '<header>Header</header><main id="dashboard">Main</main><footer>Footer</footer>',
      { language: "javascript", splitMode: "top-level" },
    );

    expect(files.map((file) => file.name)).toEqual([
      "Header.jsx",
      "Dashboard.jsx",
      "Footer.jsx",
    ]);
  });

  it("wraps multiple elements in a fragment for a single component", () => {
    const [file] = convertHtml("<h1>Hello</h1><p>World</p>", {
      language: "typescript",
      splitMode: "single",
    });

    expect(file.code).toContain("<>");
    expect(file.code).toContain("</>");
  });

  it("self-closes void elements", () => {
    const [file] = convertHtml('<img src="/avatar.png"><br><input disabled>', {
      language: "javascript",
      splitMode: "single",
    });

    expect(file.code).toContain('<img src="/avatar.png" />');
    expect(file.code).toContain("<br />");
    expect(file.code).toContain("<input disabled />");
  });

  it("rejects complete HTML documents", () => {
    const completeDocument = `<!DOCTYPE html>
      <html>
        <head><title>Example</title></head>
        <body><main>Content</main></body>
      </html>`;

    expect(validateHtmlFragment(completeDocument)).toBe(FULL_DOCUMENT_ERROR);
    expect(() =>
      convertHtml(completeDocument, {
        language: "typescript",
        splitMode: "single",
      }),
    ).toThrow(FULL_DOCUMENT_ERROR);
  });

  it("accepts markup copied from inside the body", () => {
    const fragment = "<header>Header</header><main>Content</main>";

    expect(validateHtmlFragment(fragment)).toBeNull();
    expect(
      convertHtml(fragment, {
        language: "typescript",
        splitMode: "top-level",
      }),
    ).toHaveLength(2);
  });

  it("ignores document-like text inside comments and scripts", () => {
    const fragment =
      '<!-- <html>example</html> --><script>const template = "<body>";</script><main>Content</main>';

    expect(validateHtmlFragment(fragment)).toBeNull();
  });
});

import { ConverterWorkspace } from "@/components/converter-workspace";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Braces,
  Download,
  Layers3,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "MarkupShift",
    url: "https://markupshift.js.org/",
    description:
      "A browser-based tool that converts HTML fragments into clean React JSX or TypeScript TSX components.",
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Code converter",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and a modern web browser.",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    license: "https://opensource.org/license/mit",
    codeRepository: "https://github.com/malopestorres/markupshift",
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <nav className="nav shell" aria-label="Main navigation">
        <a className="brand" href="#" aria-label="MarkupShift home">
          <span className="brand-mark">
            <Braces size={17} strokeWidth={2.4} />
          </span>
          <span>MarkupShift</span>
        </a>
        <a
          className="documentation-link"
          href="#documentation"
        >
          <BookOpen size={17} />
          <span>Documentation</span>
          <ArrowRight size={14} />
        </a>
      </nav>

      <section className="hero shell">
        <div className="eyebrow">
          <span />
          Browser-native developer tool
        </div>
        <h1>
          Static markup in.
          <br />
          <span>React components out.</span>
        </h1>
        <p>
          Paste HTML and get clean, production-ready JSX or TSX. Split layouts
          into components, preview every file, and download the whole project.
        </p>
        <div className="privacy-note">
          <span className="pulse-dot" />
          Your code stays in your browser
        </div>
      </section>

      <ConverterWorkspace />

      <section
        className="documentation shell"
        id="documentation"
        aria-labelledby="documentation-title"
      >
        <div className="documentation-intro">
          <div>
            <span className="section-kicker">How it works</span>
            <h2 id="documentation-title">
              From HTML fragment to reusable React files.
            </h2>
          </div>
          <p>
            MarkupShift handles the repetitive syntax changes while keeping you
            in control of component boundaries, names, and output language.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-icon">
              <Braces size={20} />
            </span>
            <span className="feature-number">01</span>
            <h3>Paste a fragment</h3>
            <p>
              Use the markup that belongs inside the HTML body. Complete
              documents with doctype, html, head, or body wrappers are rejected.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-icon">
              <Layers3 size={20} />
            </span>
            <span className="feature-number">02</span>
            <h3>Choose the structure</h3>
            <p>
              Generate one component or split sibling top-level elements into
              separate files. Add data-component for predictable names.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-icon">
              <Download size={20} />
            </span>
            <span className="feature-number">03</span>
            <h3>Preview and download</h3>
            <p>
              Review every JSX or TSX file, copy individual components, or
              download the complete result as a ready-to-use ZIP.
            </p>
          </article>
        </div>

        <div className="documentation-details">
          <div className="code-example">
            <div className="code-example-header">
              <span>Multiple component input</span>
              <span>HTML</span>
            </div>
            <pre>
              <code>{`<header data-component="Header">...</header>
<main data-component="Hero">...</main>
<footer data-component="Footer">...</footer>`}</code>
            </pre>
          </div>

          <div className="documentation-copy">
            <span className="section-kicker">Component splitting</span>
            <h2>Top-level siblings become separate files.</h2>
            <p>
              Nested elements stay together because they belong to the same
              component. To create several files, paste sibling elements at the
              first level and select <strong>Split top-level elements</strong>.
            </p>
            <p>
              The optional <code>data-component</code> attribute chooses the
              component and filename. It is removed from the generated code.
            </p>
            <a
              href="https://github.com/malopestorres/markupshift#creating-multiple-components"
              target="_blank"
              rel="noreferrer"
            >
              Read the complete documentation
              <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        <div className="privacy-panel">
          <span className="feature-icon">
            <ShieldCheck size={21} />
          </span>
          <div>
            <h2>Private by design</h2>
            <p>
              Conversion happens entirely in your browser. Your HTML is never
              uploaded, stored, or sent to an API.
            </p>
          </div>
          <a
            href="https://github.com/malopestorres/markupshift"
            target="_blank"
            rel="noreferrer"
          >
            View source
            <ArrowUpRight size={15} />
          </a>
        </div>

        <div className="faq">
          <span className="section-kicker">Common questions</span>
          <h2>HTML to React converter FAQ</h2>
          <div className="faq-list">
            <details>
              <summary>What HTML should I paste?</summary>
              <p>
                Paste an HTML fragment—the elements you would normally place
                inside a body tag. Do not include doctype, html, head, or body.
              </p>
            </details>
            <details>
              <summary>How do I generate multiple components?</summary>
              <p>
                Place each desired component as a top-level sibling, choose
                Split top-level elements, and optionally name each one with a
                data-component attribute.
              </p>
            </details>
            <details>
              <summary>Does MarkupShift execute my code?</summary>
              <p>
                No. Scripts and pasted event-handler strings are not executed.
                Event handlers become safe TODO callbacks in the generated code.
              </p>
            </details>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <span>Built for developers who value clean handoffs.</span>
        <span>HTML → JSX / TSX</span>
      </footer>
    </main>
  );
}

"use client";

import {
  AlertTriangle,
  Check,
  ChevronDown,
  Clipboard,
  Code2,
  Copy,
  Download,
  FileCode2,
  Files,
  PackageOpen,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  convertHtml,
  type OutputLanguage,
  type SplitMode,
  validateHtmlFragment,
} from "@/lib/converter";
import { downloadFile, downloadZip } from "@/lib/download";

const SAMPLE_HTML = `<header class="site-header">
  <a href="/" class="logo">Northstar</a>
  <nav aria-label="Primary navigation">
    <a href="/work">Work</a>
    <a href="/about">About</a>
  </nav>
</header>

<main id="portfolio">
  <p class="eyebrow">Selected work</p>
  <h1>Products built with clarity.</h1>
  <button type="button" style="background-color: #7c5cff; color: white;">
    Explore projects
  </button>
</main>

<footer class="site-footer">
  <p>© 2026 Northstar Studio</p>
</footer>`;

const emptySubscribe = () => () => {};

function LanguageToggle({
  value,
  onChange,
}: {
  value: OutputLanguage;
  onChange: (value: OutputLanguage) => void;
}) {
  return (
    <div className="segmented" aria-label="Output language">
      <button
        className={value === "typescript" ? "active" : ""}
        onClick={() => onChange("typescript")}
        type="button"
      >
        TypeScript
      </button>
      <button
        className={value === "javascript" ? "active" : ""}
        onClick={() => onChange("javascript")}
        type="button"
      >
        JavaScript
      </button>
    </div>
  );
}

export function ConverterWorkspace() {
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [language, setLanguage] = useState<OutputLanguage>("typescript");
  const [splitMode, setSplitMode] = useState<SplitMode>("top-level");
  const [hasConverted, setHasConverted] = useState(true);
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const validationError = useMemo(() => validateHtmlFragment(html), [html]);

  const files = useMemo(
    () =>
      isClient && hasConverted && !validationError
        ? convertHtml(html, {
            language,
            splitMode,
            rootName: "ConvertedComponent",
          })
        : [],
    [hasConverted, html, isClient, language, splitMode, validationError],
  );

  const currentFile = files[Math.min(activeFile, Math.max(files.length - 1, 0))];

  function handleConvert() {
    if (validationError) return;
    setActiveFile(0);
    setHasConverted(true);
  }

  function handleReset() {
    setHtml("");
    setHasConverted(false);
    setActiveFile(0);
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setHtml(text);
      setHasConverted(false);
    } catch {
      // Browser permission can prevent programmatic clipboard access.
    }
  }

  async function handleCopy() {
    if (!currentFile) return;
    await navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="workspace shell" aria-label="HTML to React converter">
      <div className="workspace-topbar">
        <div className="workspace-title">
          <span className="status-light" />
          New conversion
        </div>
        <LanguageToggle value={language} onChange={setLanguage} />
      </div>

      <div className="panels">
        <div className="panel input-panel">
          <div className="panel-header">
            <div>
              <span className="step-number">01</span>
              <h2>Paste HTML</h2>
            </div>
            <div className="panel-actions">
              <button type="button" onClick={handlePaste} title="Paste from clipboard">
                <Clipboard size={15} />
                Paste
              </button>
              <button type="button" onClick={handleReset} title="Clear editor">
                <RotateCcw size={15} />
                Clear
              </button>
            </div>
          </div>

          <div className="editor-shell">
            <div className="editor-bar">
              <div className="traffic-lights" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span>input.html</span>
              <span>{html.length.toLocaleString()} chars</span>
            </div>
            <div className="editor-body input-editor">
              <div className="line-numbers" aria-hidden="true">
                {Array.from(
                  { length: Math.max(html.split("\n").length, 16) },
                  (_, index) => (
                    <span key={index}>{index + 1}</span>
                  ),
                )}
              </div>
              <textarea
                value={html}
                onChange={(event) => {
                  setHtml(event.target.value);
                  setHasConverted(false);
                }}
                placeholder="<section>Paste your HTML here...</section>"
                spellCheck={false}
                aria-label="HTML input"
                aria-invalid={Boolean(validationError)}
                aria-describedby={validationError ? "html-validation-error" : undefined}
              />
            </div>
          </div>

          {validationError && (
            <div
              className="validation-message"
              id="html-validation-error"
              role="alert"
            >
              <AlertTriangle size={16} aria-hidden="true" />
              <span>
                <strong>Full HTML documents are not supported.</strong>
                {validationError}
              </span>
            </div>
          )}

          <div className="convert-controls">
            <label>
              <span>Component strategy</span>
              <span className="select-wrap">
                <select
                  value={splitMode}
                  onChange={(event) => {
                    setSplitMode(event.target.value as SplitMode);
                    setHasConverted(false);
                  }}
                >
                  <option value="top-level">Split top-level elements</option>
                  <option value="single">Single component</option>
                </select>
                <ChevronDown size={15} />
              </span>
            </label>
            <button
              className="convert-button"
              type="button"
              onClick={handleConvert}
              disabled={!html.trim() || Boolean(validationError)}
            >
              <Sparkles size={17} />
              Convert to {language === "typescript" ? "TSX" : "JSX"}
            </button>
          </div>
        </div>

        <div className="panel output-panel">
          <div className="panel-header">
            <div>
              <span className="step-number">02</span>
              <h2>React output</h2>
            </div>
            {files.length > 0 && (
              <span className="file-count">
                <Files size={14} />
                {files.length} {files.length === 1 ? "file" : "files"}
              </span>
            )}
          </div>

          {currentFile ? (
            <>
              <div className="file-tabs" role="tablist">
                {files.map((file, index) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeFile === index}
                    className={activeFile === index ? "active" : ""}
                    onClick={() => setActiveFile(index)}
                    key={file.name}
                  >
                    <FileCode2 size={14} />
                    {file.name}
                  </button>
                ))}
              </div>
              <div className="editor-shell output-editor">
                <div className="editor-bar">
                  <span className="language-badge">
                    {language === "typescript" ? "TSX" : "JSX"}
                  </span>
                  <div className="code-actions">
                    <button type="button" onClick={handleCopy}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button type="button" onClick={() => downloadFile(currentFile)}>
                      <Download size={14} />
                      Download
                    </button>
                  </div>
                </div>
                <pre>
                  <code>{currentFile.code}</code>
                </pre>
              </div>
              <button
                className="zip-button"
                type="button"
                onClick={() => downloadZip(files)}
              >
                <PackageOpen size={18} />
                <span>
                  <strong>Download all files</strong>
                  <small>Ready-to-use ZIP package</small>
                </span>
                <Download size={17} />
              </button>
            </>
          ) : (
            <div className="empty-output">
              <span className="empty-icon">
                <Code2 size={25} />
              </span>
              <h3>Your components will appear here</h3>
              <p>Paste valid HTML, choose a strategy, then run the conversion.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

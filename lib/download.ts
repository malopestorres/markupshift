import JSZip from "jszip";
import type { ConvertedFile } from "./converter";

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function downloadFile(file: ConvertedFile) {
  saveBlob(new Blob([file.code], { type: "text/plain;charset=utf-8" }), file.name);
}

export async function downloadZip(files: ConvertedFile[]) {
  const zip = new JSZip();
  const folder = zip.folder("markupshift-components");

  files.forEach((file) => folder?.file(file.name, file.code));
  const indexExtension = files[0]?.name.endsWith(".jsx") ? "js" : "ts";
  folder?.file(
    `index.${indexExtension}`,
    files
      .map(
        (file) =>
          `export { default as ${file.componentName} } from "./${file.componentName}";`,
      )
      .join("\n"),
  );

  const blob = await zip.generateAsync({ type: "blob" });
  saveBlob(blob, "markupshift-components.zip");
}

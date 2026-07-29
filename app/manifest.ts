import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MarkupShift — HTML to React Converter",
    short_name: "MarkupShift",
    description:
      "Convert HTML into clean React JSX or TypeScript TSX components.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a0f",
    theme_color: "#0b0a0f",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

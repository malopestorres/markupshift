import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://markupshift.js.org";
const title = "HTML to JSX/TSX Converter – MarkupShift";
const description =
  "Convert HTML into clean React JSX or TypeScript TSX components. Split layouts into files, preview the output, and download everything as a ZIP.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: "MarkupShift",
  authors: [{ name: "MarkupShift contributors", url: "https://github.com/malopestorres/markupshift" }],
  creator: "MarkupShift contributors",
  publisher: "MarkupShift",
  alternates: {
    canonical: "/",
  },
  category: "Developer Tools",
  keywords: [
    "HTML to JSX",
    "HTML to TSX",
    "HTML to React",
    "React component converter",
    "JSX converter",
    "TSX converter",
  ],
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "MarkupShift",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MarkupShift — convert HTML into React JSX and TSX components",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

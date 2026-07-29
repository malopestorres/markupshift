import type { NextConfig } from "next";

const hasCustomDomain = process.env.CUSTOM_DOMAIN_ACTIVE === "true";
const isGitHubProjectPages =
  process.env.GITHUB_ACTIONS === "true" && !hasCustomDomain;

const nextConfig: NextConfig = {
  assetPrefix: isGitHubProjectPages ? "/markupshift/" : undefined,
  basePath: isGitHubProjectPages ? "/markupshift" : "",
  images: {
    unoptimized: true,
  },
  output: "export",
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
};

export default nextConfig;

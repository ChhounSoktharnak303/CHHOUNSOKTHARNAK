import type { NextConfig } from "next";

/* DEPLOY_TARGET=gh is set only inside the GitHub Actions deploy job,
   so local dev/build stays untouched. */
const isGhPages = process.env.DEPLOY_TARGET === "gh";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  ...(isGhPages
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
        basePath: "/CHHOUNSOKTHARNAK",
        assetPrefix: "/CHHOUNSOKTHARNAK",
      }
    : {}),
};

export default nextConfig;

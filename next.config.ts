import type { NextConfig } from "next";

/* DEPLOY_TARGET=gh is set only inside the GitHub Actions deploy job,
   so local dev/build stays untouched.
   Custom domain (Chhounsoktharnak.com) serves at the root, so no
   base path is needed. */
const isGhPages = process.env.DEPLOY_TARGET === "gh";

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
  },
  ...(isGhPages
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;

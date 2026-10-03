import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 uses Turbopack by default, which resolves @monaco-editor/react
  // without needing a custom webpack fallback config.
  serverExternalPackages: ["mongodb"],
};

export default nextConfig;
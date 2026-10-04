import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 uses Turbopack by default, which resolves @monaco-editor/react
  // without needing a custom webpack fallback config.
  serverExternalPackages: ["mongodb"],
  // The Docker image builds with NEXT_OUTPUT=standalone so it only has to ship
  // the runtime files it needs. Plain `npm run build` leaves this unset, because
  // Next warns that `next start` is unsupported once standalone output is on.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
};

export default nextConfig;
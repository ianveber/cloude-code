import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Coach reads its knowledge base (~112 KB of markdown) from disk at runtime.
  // Next's file tracing only follows static imports, so without this the .md files
  // are absent from the serverless bundle and /api/coach fails in production while
  // working perfectly in dev — the worst possible failure shape.
  outputFileTracingIncludes: {
    "/api/coach": ["./src/lib/coach/brain/**/*.md"],
  },
};

export default nextConfig;

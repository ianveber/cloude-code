import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Fail the build on type errors rather than shipping past them. A build that
  // ignores its own errors is a build that tells you nothing.
  //
  // Note: there is no `eslint` key on NextConfig in 16.2.6 — adding one fails
  // the type check. Lint is a separate script, not a build flag.
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@pkl-community/pkl-eval"],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@pkl-community/pkl-eval"],
  },
  async redirects() {
    return [
      {
        source: "/discord-invite",
        destination: "https://discord.gg/Z6cB7BU5CF",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

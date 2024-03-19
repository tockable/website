/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   serverActions: { bodySizeLimit: "10mb" },
  // },
  experimental: {
    serverActions: true,
    serverActionsBodySizeLimit: "10mb",
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

module.exports = nextConfig;

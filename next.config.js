/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  output: "export",
  trailingSlash: true,

  basePath: "/Visual-Studios--Frontend",

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
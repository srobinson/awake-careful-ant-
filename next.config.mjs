/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    domains: ["localhost", "i.awake-careful-ant.com"],
  },
  reactStrictMode: true,
};

export default nextConfig;

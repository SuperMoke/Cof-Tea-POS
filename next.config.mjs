/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  // Keep your existing allowedDevOrigins
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.100.18:3000",
    "http://192.168.100.18",
    "http://192.168.1.65",
  ],
};

export default nextConfig;

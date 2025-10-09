// LogistikIOT/next.config.mjs
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // aktifkan alias "@" ke root LogistikIOT agar import "@/lib/..." tetap jalan
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@": projectRoot,
    };
    return config;
  },
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;

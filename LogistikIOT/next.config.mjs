
import path from 'path'
import { fileURLToPath } from 'url'
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    config.resolve.alias = { ...(config.resolve.alias || {}), '@': path.resolve(dirname, '.') }
    return config
  },
}
export default nextConfig

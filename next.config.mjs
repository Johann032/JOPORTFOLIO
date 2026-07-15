/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    '/api/content-media/**/*': ['./content/**/*'],
    '/projects/[slug]': ['./content/**/*'],
  },
}

export default nextConfig

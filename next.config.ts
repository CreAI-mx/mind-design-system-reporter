import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/**': ['./design-system/**/*'],
    },
  },
}

export default nextConfig

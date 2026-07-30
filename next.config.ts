import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/**': ['./design-system/**/*'],
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        destination: '/minifiers/:slug',
        source: '/:slug-minifier',
      },
      {
        destination: '/formatters/:slug',
        source: '/:slug-formatter',
      },
    ]
  },
}

export default nextConfig

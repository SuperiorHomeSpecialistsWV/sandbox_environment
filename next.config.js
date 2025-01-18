/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['your-image-domain.com'], // Add any image domains you'll use
    }
}

module.exports = nextConfig 
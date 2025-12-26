/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["images.unsplash.com"],
	},
	transpilePackages: ["react-query"],
};

module.exports = nextConfig;
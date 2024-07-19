/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "dsi-africa.org",
			},
			{
				hostname: "raw.githubusercontent.com",
			},
		],
	},
};

export default nextConfig;

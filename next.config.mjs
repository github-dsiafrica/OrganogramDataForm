/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "dsi-africa.org",
			},
			{
				hostname: "githubusercontent.com",
			},
		],
	},
};

export default nextConfig;

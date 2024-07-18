/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "dsi-africa.org",
			},
		],
	},
};

export default nextConfig;

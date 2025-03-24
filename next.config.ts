import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

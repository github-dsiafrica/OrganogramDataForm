import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
	title: "DS-I Africa Organogram Data Generator",
	description: "Generate data for the DS-I Africa Organogram",
	icons: {
		icon: ["/favicon.svg"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}

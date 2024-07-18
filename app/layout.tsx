import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "DS-I Africa Organogram Data Generator",
	description: "Generate data for the DS-I Africa Organogram",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<nav className="flex py-2 gap-8 justify-between px-4 items-center">
					<Image
						src="https://dsi-africa.org/sites/default/files/Logo%20-%20primary%20on%20white-%20transparent.png"
						width={300}
						height={200}
						alt="DS-I Africa Logo"
					/>
					<h1 className="text-3xl font-bold">
						DS-I Africa Organogram Data Generator
					</h1>
				</nav>
				{children}
			</body>
		</html>
	);
}

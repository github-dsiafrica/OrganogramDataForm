import type { Metadata } from "next";
import Image from "next/image";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Button } from "@/components/ui/button";

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
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<nav className="flex py-4 gap-8 justify-between items-center container mx-auto">
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
				</ThemeProvider>
			</body>
		</html>
	);
}

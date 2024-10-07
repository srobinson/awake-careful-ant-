import "./globals.css"; // Add this line

import type { Metadata } from "next";

export const metadata: Metadata = {
	description: "A beautiful image gallery",
	title: "Your Gallery App",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}

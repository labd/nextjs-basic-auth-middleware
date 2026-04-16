export const metadata = {
	title: "Basic Auth Example",
	description: "Example of nextjs-basic-auth-middleware",
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

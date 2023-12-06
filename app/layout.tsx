

export const metadata: Metadata = {
  title: "Ministream",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider forcedTheme="dark" attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "./theme-provider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    </html>
  );
}

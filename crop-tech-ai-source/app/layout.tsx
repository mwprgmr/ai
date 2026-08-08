import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crop Tech AI",
  description: "Intelligence built for your business."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

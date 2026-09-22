import type { Metadata } from "next";
import "./globals.css";
import "./story.css";

export const metadata: Metadata = {
  title: "Parteli | Built for What Moves You.",
  description: "A new operating system for powersports and recreational dealerships. Explore Parteli's vision for connected inventory, sales, service, and intelligence.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "3D Sphere",
  description: "Interactive 3D sphere using Three.js",
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

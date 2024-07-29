import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crop Guard",
  description: "An innovative crop disease detection system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

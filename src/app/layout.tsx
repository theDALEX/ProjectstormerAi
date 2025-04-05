import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
//context
import { BridgeProvider } from "../../context/bridgeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProjectstormerAi",
  description: "ProjectstormerAi empowers creativity and productivity by helping you brainstorm innovative ideas for your university and workplace projects",
  icons: { icon: "/icon.png" }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="FsILhKM8KhyhsIfPSyn8-AcZ2WjL6emNVJ3vWYWqQUI" />
        <link rel="icon" href="/icon.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BridgeProvider>
          {children}
        </BridgeProvider>
      </body>
    </html>
  );
}

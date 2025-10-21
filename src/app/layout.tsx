import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// Import global CSS styles
import "./globals.css";
import Navigation from "@/app/components/Navigation";
import ScrollToTop from "@/app/components/ScrollToTop";
import { UserProvider } from "./context/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClickHub",
  description: "A curated showcase of creative and interactive button designs for developers. Explore, contribute, and discover amazing button components built with React, Next.js, vanilla JavaScript, and HTML+CSS. Perfect for Hacktoberfest contributions and design inspiration.",
  metadataBase: new URL('https://clickhub-mrienan.vercel.app'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/clickhub-icon.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    apple: '/clickhub-icon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: "ClickHub - Button Showcase for Hacktoberfest 2025",
    description: "Discover amazing button designs for your next project. Join Hacktoberfest 2025 and contribute your own creative buttons!",
    images: ['/clickhub-icon.svg'],
    siteName: 'ClickHub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "ClickHub - Button Showcase",
    description: "Discover amazing button designs for your next project. Join Hacktoberfest 2025!",
    images: ['/clickhub-icon.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900`}
      >
        <UserProvider>
          <div className="min-h-screen py-8">
            <Navigation />
            <main>
              {children}
            </main>
            <ScrollToTop />
          </div>
        </UserProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "The AI Times - AI-Powered Business Intelligence",
    template: "%s | The AI Times"
  },
  description: "Your personalized AI-powered newsroom delivering curated business intelligence. Get real-time insights on markets, startups, technology, and global economy with vector-matched precision.",
  keywords: ["AI news", "business intelligence", "market insights", "personalized news", "vector search", "AI curation"],
  authors: [{ name: "The AI Times" }],
  creator: "The AI Times",
  publisher: "The AI Times",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aieinews.com",
    title: "The AI Times - AI-Powered Business Intelligence",
    description: "Your personalized AI-powered newsroom delivering curated business intelligence.",
    siteName: "The AI Times",
  },
  twitter: {
    card: "summary_large_image",
    title: "The AI Times - AI-Powered Business Intelligence",
    description: "Your personalized AI-powered newsroom delivering curated business intelligence.",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#B31921',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-full font-sans">{children}</body>
    </html>
  );
}

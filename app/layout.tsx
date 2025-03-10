import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/layout";
import Navbar from "@/components/nav-bar";
import { WalletProvider } from "@/lib/contexts/WalletContext";
import AgeVerification from "@/components/age-verification";
import "./globals.css";
import PurchaseStamina from "@/components/stamina/purchase-stamina";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SoftCORE - AI Dating Game & NFT Collection | Core DAO",
  description:
    "Experience unique AI-powered dating stories and collect memorable moments as NFTs on Core DAO. Interactive storytelling meets blockchain technology.",
  keywords:
    "AI dating game, Core DAO, NFT collection, interactive story, blockchain gaming, visual novel, dating simulation",
  openGraph: {
    title: "SoftCORE - AI Dating Game & NFT Collection",
    description:
      "Experience unique AI-powered dating stories and collect memorable moments as NFTs on Core DAO.",
    type: "website",
    url: "https://softcore.games",
    images: [
      {
        url: "/images/overview.png",
        width: 1200,
        height: 630,
        alt: "SoftCORE Game Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SoftCORE - AI Dating Game & NFT Collection",
    description:
      "Experience unique AI-powered dating stories and collect memorable moments as NFTs on Core DAO.",
    images: ["/images/overview.png"],
  },
  robots: "index, follow",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <WalletProvider>
          <Layout>
            <Navbar />
            {children}
            <AgeVerification />
            <Toaster />
          </Layout>
        </WalletProvider>
      </body>
    </html>
  );
}

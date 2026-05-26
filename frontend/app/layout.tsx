import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "CreatorWaitlist — Launch to Your Most Engaged Fans First",
  description:
    "Build hype, manage signups, and notify your audience the moment you go live. The waitlist platform built for creators.",
  keywords: ["waitlist", "creator", "launch", "email notifications", "audience"],
  openGraph: {
    title: "CreatorWaitlist — Launch to Your Most Engaged Fans First",
    description:
      "Build hype, manage signups, and notify your audience the moment you go live.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
        <body className={`${inter.className} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}

 
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ASSOCIATION_INFO } from "./constants/data";
import Script from 'next/script'

// Using Inter for a clean, modern aesthetic
const inter = Inter({ subsets: ["latin"] });
// Dynamically generate SEO metadata from our constants
export const metadata: Metadata = {
  title: `${ASSOCIATION_INFO.abbreviation} | ${ASSOCIATION_INFO.name}`,
  description: ASSOCIATION_INFO.tagline,
  keywords: ["Embryology", "Andhra Pradesh", "ART", "Clinical Embryologists", "EAAP", "Reproductive Medicine"],
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth selection:bg-[#0096a4]/20">
      {/* Added antialiased for smoother text rendering */}
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        {/* This will render either your (main) layout or (admin) layout depending on the route */}
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-87S332JCJ1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-87S332JCJ1');
          `}
        </Script>
      </body>
    </html>
  );
}
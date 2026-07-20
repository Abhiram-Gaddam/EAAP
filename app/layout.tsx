 
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
      <head>
      <Script id="google-tag-manager" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-MNVDKK3S');`}
        </Script>
      </head>
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
      <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MNVDKK3S"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
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
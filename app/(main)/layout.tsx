// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css";
import Navbar from "@/app/(main)/components/Navbar";
import Footer from "@/app/(main)/components/Footer";
import SmoothScrolling from "./components/SmoothScroll";

// Initialize the Inter font for a clean, modern medical UI
const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // scroll-smooth enables native smooth scrolling for anchor links
     
      <div className={`${inter.className} min-h-screen flex flex-col bg-emerald-50/30 antialiased`}>
      <SmoothScrolling> 
        <Navbar />
        
        {/* pt-20 accounts for the fixed 80px (h-20) Navbar so content isn't hidden behind it */}
        <main className="flex-grow relative selection:bg-[#0096a4]/20">
          {children}
        </main>

        <Footer />
        </SmoothScrolling >
      </div>
    
  );
}
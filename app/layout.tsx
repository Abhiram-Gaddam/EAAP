// // src/app/layout.tsx
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/app/(main)/components/Navbar";
// import Footer from "@/app/(main)/components/Footer";
// import { ASSOCIATION_INFO } from "@/app/constants/data";
// import SmoothScrolling from "./(main)/components/SmoothScroll";

// // Initialize the Inter font for a clean, modern medical UI
// const inter = Inter({ subsets: ["latin"] });

// // Dynamically generate SEO metadata from our constants
// export const metadata: Metadata = {
//   title: `${ASSOCIATION_INFO.abbreviation} | ${ASSOCIATION_INFO.name}`,
//   description: ASSOCIATION_INFO.tagline,
//   keywords: ["Embryology", "Andhra Pradesh", "ART", "Clinical Embryologists", "EAAP", "Reproductive Medicine"],
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     // scroll-smooth enables native smooth scrolling for anchor links
//     <html lang="en" className="scroll-smooth">
//       <body className={`${inter.className} min-h-screen flex flex-col bg-emerald-50/30 antialiased`}>
//       <SmoothScrolling> 
//         <Navbar />
        
//         {/* pt-20 accounts for the fixed 80px (h-20) Navbar so content isn't hidden behind it */}
//         <main className="flex-grow relative">
//           {children}
//         </main>

//         <Footer />
//         </SmoothScrolling >
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ASSOCIATION_INFO } from "./constants/data";

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
      </body>
    </html>
  );
}
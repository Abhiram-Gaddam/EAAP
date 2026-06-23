import { Metadata } from "next";

import MembershipHero from "../components/MemberShip/MemberShipHero";  
import EligibilityGuidelines from "../components/MemberShip/EligibilityGuidelines";
import MembershipRegistrationProcess from "../components/MemberShip/MemberReg";
import TermsAndDocuments from "../components/MemberShip/TermDocument";
import MembershipBenefits from "../components/MemberShip/WhyEaap";
import MembershipCheckoutButton from "../components/MemberShip/FakeMember";
export const metadata: Metadata = {
  title: "Membership | Embryologists Association of Andhra Pradesh (EAAP)",
  description: "Join the Embryologists Association of Andhra Pradesh (EAAP). Elevate your clinical embryology practice with professional networking, continuous education, and regulatory support.",
  keywords: [
    "EAAP membership",
    "clinical embryology association Andhra Pradesh",
    "join EAAP",
    "embryologist registration AP",
    "ART professionals Andhra Pradesh",
    "fertility specialists network"
  ],
  alternates: {
    canonical: "/membership",
  },
  openGraph: {
    title: "Membership | Embryologists Association of Andhra Pradesh",
    description: "Join the Embryologists Association of Andhra Pradesh (EAAP). Elevate your clinical embryology practice with professional networking, continuous education, and regulatory support.",
    url: "https://www.eaap.in/membership", // Update with your actual domain
    siteName: "EAAP",
    images: [
      {
        url: "/images/og-membership.jpg", // Update with your actual OG image
        width: 1200,
        height: 630,
        alt: "EAAP Membership Benefits",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Membership | EAAP",
    description: "Elevate your clinical embryology practice. Join the EAAP today.",
    images: ["/images/og-membership.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function MembershipPage() {
  const currentUser = {
    fullName: "John Doe",
    email: "john.doe@example.com"
  };
  return (
    <main className="flex min-h-screen flex-col w-full bg-white">
      {/* 1. Hero & Value Proposition */}
      <MembershipHero />
      <MembershipBenefits/>
      {/* 2. Eligibility & Membership Categories (To be added) */}
      <EligibilityGuidelines />
      
      {/* 3. Fee Structure & Registration Process (To be added) */}
      <MembershipRegistrationProcess />
      
      {/* 4. Document Checklist & Cancellation Policies (To be added) */}
      <TermsAndDocuments />

      <MembershipCheckoutButton user={currentUser} ></MembershipCheckoutButton>

    </main>
    
  );
}
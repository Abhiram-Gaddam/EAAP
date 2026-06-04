// src/app/about/page.tsx
import { Metadata } from 'next';
import AboutHero from '@/app/components/about/About';
import WhoWeAre from '../components/about/WhoWeAre';
import OurMandate from '../components/about/OurMandate';
import GoverningBody from '../components/about/GoverningBody';
import LegalDeclarations from '../components/about/LegalDeclarations';

export const metadata: Metadata = {
  title: 'About Us | Embryologists Association of Andhra Pradesh (EAAP)',
  description: 'Learn about the Embryologists Association of Andhra Pradesh, our legacy, mission, and the statutory framework guiding clinical embryology.',
  keywords: [
    'About EAAP',
    'Embryologists Association',
    'Clinical Embryology AP',
    'Reproductive Medicine Society',
    'EAAP Mission'
  ],
};

export default function AboutPage() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen selection:bg-[#0096a4]/20">
      <AboutHero />
      <WhoWeAre/> 
      <OurMandate/>
      <GoverningBody />
      <LegalDeclarations/>
    </main>
  );
}
"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { Network, BookOpen, Scale, Award, ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const BENEFITS = [
  {
    id: 1,
    icon: Network,
    title: 'Professional Networking',
    description: 'Connect with a statewide network of clinical embryologists and leading ART professionals.'
  },
  {
    id: 2,
    icon: BookOpen,
    title: 'Continuous Education',
    description: 'Exclusive access to EAAP-hosted CMEs, workshops, webinars, and scientific conferences.'
  },
  {
    id: 3,
    icon: Scale,
    title: 'Legal & Regulatory',
    description: 'Unified representation and guidance on the latest ART laws and compliance protocols.'
  },
  {
    id: 4,
    icon: Award,
    title: 'Career Advancement',
    description: 'Enhance your credibility with recognized membership status and specialized training.'
  }
];

export default function MembershipHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress: heroScrollY } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  
  const heroY = useTransform(heroScrollY, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(heroScrollY, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] bg-[#FAFAFA] flex items-center pt-32 pb-20 px-6 md:px-16 lg:px-24 overflow-hidden border-b border-slate-200"
    >
      
      {/* ─── Background Decor & SVGs ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        
        {/* Subtle Dot Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #1a365d 1px, transparent 0)",
            backgroundSize: "36px 36px",
          }}
        />
        
        {/* Gradients */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-gradient-to-br from-[#0096a4]/10 to-transparent rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-tr from-[#1a365d]/5 to-transparent rounded-full blur-[120px]" 
        />

        {/* Abstract Medical Structures (Reduced to just 2, made visible & premium) */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          
          {/* 1. DNA Helix - Large, top right, slowly rotating */}
          <motion.svg 
            animate={{ rotate: 360 }} 
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -right-[20%] md:-top-[20%] md:-right-[10%] w-[500px] h-[500px] md:w-[800px] md:h-[800px] text-[#0096a4] opacity-[0.04] md:opacity-[0.06]" 
            viewBox="0 0 200 200" fill="none"
          >
            <path d="M20,100 C60,20 140,20 180,100 C220,180 300,180 340,100" stroke="currentColor" strokeWidth="1.5" />
            <path d="M20,100 C60,180 140,180 180,100 C220,20 300,20 340,100" stroke="currentColor" strokeWidth="1.5" />
            <line x1="40" y1="80" x2="40" y2="120" stroke="currentColor" strokeWidth="1" />
            <line x1="70" y1="50" x2="70" y2="150" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="35" x2="100" y2="165" stroke="currentColor" strokeWidth="1" />
            <line x1="130" y1="50" x2="130" y2="150" stroke="currentColor" strokeWidth="1" />
            <line x1="160" y1="80" x2="160" y2="120" stroke="currentColor" strokeWidth="1" />
          </motion.svg>

          {/* 2. Molecular Chain - Bottom left, floating */}
          <motion.svg 
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-[5%] -left-[10%] md:bottom-[5%] md:-left-[5%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] text-[#1a365d] opacity-[0.04] md:opacity-[0.06]" 
            viewBox="0 0 200 200" fill="none"
          >
            <circle cx="50" cy="150" r="12" fill="currentColor" />
            <circle cx="100" cy="100" r="16" stroke="currentColor" strokeWidth="2" />
            <circle cx="160" cy="80" r="10" fill="currentColor" />
            <circle cx="130" cy="160" r="8" stroke="currentColor" strokeWidth="2" />
            <line x1="50" y1="150" x2="100" y2="100" stroke="currentColor" strokeWidth="1.5" />
            <line x1="100" y1="100" x2="160" y2="80" stroke="currentColor" strokeWidth="1.5" />
            <line x1="100" y1="100" x2="130" y2="160" stroke="currentColor" strokeWidth="1.5" />
          </motion.svg>

        </motion.div>
      </div>

      {/* ─── Main Content Grid ─── */}
      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Typography */}
        <div className="lg:col-span-5 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", x: -30 }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Themed Accent Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-8 bg-[#0096a4]" />
              <div className="flex items-center gap-2">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#0096a4] relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0096a4] opacity-40"></span>
                </span>
                <span className="text-[#0096a4] text-[11px] font-bold uppercase tracking-widest">
                  Membership Applications Open
                </span>
              </div>
            </div>

            <h1 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-5xl md:text-6xl lg:text-7xl text-[#1a365d] leading-[1.05] tracking-tight mb-6">
              Elevate Your <br />
              <span className="italic text-[#0096a4]">Practice.</span>
            </h1>
            
            <p className="text-slate-500 font-light text-lg md:text-xl leading-relaxed mb-10 max-w-md">
              Join Andhra Pradesh's definitive regulatory and scientific body for clinical embryologists. Secure your professional future and advance the science of ART.
            </p>
            
            {/* Small pill buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => document.getElementById('registration-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-[#1a365d] text-white px-6 py-2.5 rounded-full font-medium text-[13px] tracking-wide transition-colors duration-300 hover:bg-[#0b1b35] flex items-center justify-center gap-2 shadow-sm"
              >
                Apply for Membership
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              
              <button 
                onClick={() => document.getElementById('eligibility-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto text-[#1a365d] border border-slate-300 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-[#1a365d] px-6 py-2.5 rounded-full font-medium text-[13px] tracking-wide transition-colors duration-300 flex items-center justify-center shadow-sm"
              >
                Check Eligibility
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Bento Grid */}
        <div className="lg:col-span-7 w-full relative z-10">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full">
            
            <div className="flex flex-col gap-3 sm:gap-6 pt-6 sm:pt-16">
              {[BENEFITS[0], BENEFITS[2]].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + (index * 0.15), ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white/80 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-white shadow-sm hover:shadow-lg hover:border-[#0096a4]/20 transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-bl from-[#0096a4]/5 to-transparent rounded-bl-full transition-all duration-500 group-hover:scale-125" />
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#0096a4] group-hover:border-[#0096a4] transition-colors duration-500 relative z-10">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1a365d] group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-base sm:text-2xl text-[#1a365d] mb-2 sm:mb-3 relative z-10 leading-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-500 font-light text-[12px] sm:text-sm leading-relaxed relative z-10">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:gap-6 pb-6 sm:pb-16">
              {[BENEFITS[1], BENEFITS[3]].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.35 + (index * 0.15), ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white/80 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-white shadow-sm hover:shadow-lg hover:border-[#1a365d]/20 transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-bl from-[#1a365d]/5 to-transparent rounded-bl-full transition-all duration-500 group-hover:scale-125" />
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#1a365d] group-hover:border-[#1a365d] transition-colors duration-500 relative z-10">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0096a4] group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-base sm:text-2xl text-[#1a365d] mb-2 sm:mb-3 relative z-10 leading-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-500 font-light text-[12px] sm:text-sm leading-relaxed relative z-10">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
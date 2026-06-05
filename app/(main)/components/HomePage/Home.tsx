'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Microscope, ShieldCheck, ArrowRight, ArrowUpRight, TestTube2, Calendar, ChevronRight } from 'lucide-react';
import { ASSOCIATION_INFO  } from '@/app/constants/data';
import LeadershipSection from './LeaderShip';
import { ParallaxItem } from './ParllexItem';   
import LatestAnnouncements from './LatestAnnouncement';
import FinalCTASection from './FinalCTC';

// Mock data for News (You can move this to your data.ts later)
 

export default function HomeClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress: heroScrollY } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  
  const heroY = useTransform(heroScrollY, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(heroScrollY, [0, 0.8], [1, 0]);

    
  return (
    <main ref={containerRef} className="relative w-full bg-[#FAFAFA] text-slate-900 selection:bg-[#0096a4]/20">
      
      {/* 1. HERO SECTION */}
      {/* <section className="relative min-h-[100vh] w-full overflow-hidden flex items-center pt-24 pb-16 px-8 md:px-16 lg:px-24 bg-white border-b border-slate-200 shadow-sm">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-br from-white via-white to-[#0096a4]/5 z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0096a4]/10 rounded-full blur-[150px] mix-blend-multiply opacity-50 z-0" />
        </div>

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 z-0 hidden md:flex justify-center items-center pointer-events-none overflow-hidden"
        >
          <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[800px] h-[800px] text-[#0096a4]"
          >
             <svg className="absolute top-[20%] left-[20%] w-64 h-64" viewBox="0 0 200 200" fill="none">
              <motion.circle animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
              <circle cx="85" cy="85" r="35" stroke="currentColor" strokeWidth="2" className="opacity-60" />
              <circle cx="120" cy="115" r="32" stroke="currentColor" strokeWidth="2" className="opacity-60" />
              <circle cx="125" cy="75" r="28" stroke="currentColor" strokeWidth="2" className="opacity-60" />
              <circle cx="75" cy="125" r="30" stroke="currentColor" strokeWidth="2" className="opacity-60" />
            </svg>

             <motion.svg 
              animate={{ rotate: 360 }} 
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute top-[40%] right-[10%] w-80 h-80 opacity-40" viewBox="0 0 200 200" fill="none"
            >
              <path d="M20,100 C60,20 140,20 180,100 C220,180 300,180 340,100" stroke="currentColor" strokeWidth="2" />
              <path d="M20,100 C60,180 140,180 180,100 C220,20 300,20 340,100" stroke="currentColor" strokeWidth="2" />
              <line x1="40" y1="80" x2="40" y2="120" stroke="currentColor" strokeWidth="1" />
              <line x1="70" y1="50" x2="70" y2="150" stroke="currentColor" strokeWidth="1" />
              <line x1="100" y1="35" x2="100" y2="165" stroke="currentColor" strokeWidth="1" />
              <line x1="130" y1="50" x2="130" y2="150" stroke="currentColor" strokeWidth="1" />
              <line x1="160" y1="80" x2="160" y2="120" stroke="currentColor" strokeWidth="1" />
            </motion.svg>

             <motion.svg 
              animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[10%] left-[30%] w-72 h-72 opacity-50" viewBox="0 0 200 200" fill="none"
            >
              <circle cx="50" cy="150" r="12" fill="currentColor" />
              <circle cx="100" cy="100" r="16" stroke="currentColor" strokeWidth="3" />
              <circle cx="160" cy="80" r="10" fill="currentColor" />
              <circle cx="130" cy="160" r="8" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="150" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
              <line x1="100" y1="100" x2="160" y2="80" stroke="currentColor" strokeWidth="2" />
              <line x1="100" y1="100" x2="130" y2="160" stroke="currentColor" strokeWidth="2" />
            </motion.svg>
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-10"
            >
              <div className="h-[1px] w-12 bg-[#0096a4]" />
              <span className="tracking-[0.2em] text-[#0096a4] text-xs font-bold uppercase bg-[#0096a4]/5 px-4 py-2 rounded-full border border-[#0096a4]/10 shadow-sm">
                {ASSOCIATION_INFO.abbreviation} • Registered Society
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-8xl lg:text-[8.5rem] font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] tracking-tight leading-[0.95] text-[#1a365d]"
            >
              Advancing <br />
              <span className="italic text-[#0096a4] font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] pr-4">
                Genesis.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-8 text-xl md:text-2xl text-slate-600 max-w-2xl font-light leading-relaxed"
            >
              {ASSOCIATION_INFO.tagline}. We are the official professional body setting benchmarks in <span className="italic font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-[#1a365d] font-medium">clinical embryology</span> and <span className="italic font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-[#1a365d] font-medium">Assisted Reproductive Technology</span> across Andhra Pradesh.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-12 flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
            >
              <a 
                href="/membership" 
                className="group w-full sm:w-auto relative flex items-center justify-center gap-3 bg-[#1a365d] text-white px-10 py-5 rounded-full text-lg font-medium hover:bg-[#0096a4] transition-all duration-500 shadow-xl shadow-[#1a365d]/20 overflow-hidden"
              >
                <span className="relative z-10">Become a Member</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              </a>
              
              <a 
                href="/about" 
                className="group flex items-center gap-2 text-slate-600 font-medium hover:text-[#0096a4] transition-colors duration-300 py-3 px-6 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200"
              >
                Explore Our Mandate
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section> */}
      <section className="relative min-h-[100vh] w-full overflow-hidden flex items-center pt-24 pb-16 px-8 md:px-16 lg:px-24 bg-white border-b border-slate-200 shadow-sm">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-br from-white via-white to-[#0096a4]/5 z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0096a4]/10 rounded-full blur-[150px] mix-blend-multiply opacity-50 z-0" />
        </div>

        {/* Abstract Medical Structures - Now visible on mobile, expanded on desktop */}
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 md:left-auto md:right-0 w-full lg:w-1/2 z-0 flex justify-center items-center pointer-events-none overflow-hidden"
        >
          <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full h-full max-w-[800px] max-h-[800px] text-[#0096a4]"
          >
             {/* 1. Dividing Cell - Hidden on mobile, slightly larger on desktop */}
             <svg className="hidden md:block absolute top-[15%] left-[10%] w-72 h-72" viewBox="0 0 200 200" fill="none">
              <motion.circle animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
              <circle cx="85" cy="85" r="35" stroke="currentColor" strokeWidth="2" className="opacity-60" />
              <circle cx="120" cy="115" r="32" stroke="currentColor" strokeWidth="2" className="opacity-60" />
              <circle cx="125" cy="75" r="28" stroke="currentColor" strokeWidth="2" className="opacity-60" />
              <circle cx="75" cy="125" r="30" stroke="currentColor" strokeWidth="2" className="opacity-60" />
            </svg>

             {/* 2. DNA Helix - Small & top-right on mobile, large & centered-right on desktop */}
             <motion.svg 
              animate={{ rotate: 360 }} 
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[5%] -right-[10%] md:top-[35%] md:right-[5%] w-64 h-64 md:w-96 md:h-96 opacity-20 md:opacity-40" viewBox="0 0 200 200" fill="none"
            >
              <path d="M20,100 C60,20 140,20 180,100 C220,180 300,180 340,100" stroke="currentColor" strokeWidth="2" />
              <path d="M20,100 C60,180 140,180 180,100 C220,20 300,20 340,100" stroke="currentColor" strokeWidth="2" />
              <line x1="40" y1="80" x2="40" y2="120" stroke="currentColor" strokeWidth="1" />
              <line x1="70" y1="50" x2="70" y2="150" stroke="currentColor" strokeWidth="1" />
              <line x1="100" y1="35" x2="100" y2="165" stroke="currentColor" strokeWidth="1" />
              <line x1="130" y1="50" x2="130" y2="150" stroke="currentColor" strokeWidth="1" />
              <line x1="160" y1="80" x2="160" y2="120" stroke="currentColor" strokeWidth="1" />
            </motion.svg>

             {/* 3. Molecular Chain - Bottom-right on mobile, bottom-left on desktop */}
             <motion.svg 
              animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[5%] -right-[10%] md:bottom-[10%] md:left-[20%] w-56 h-56 md:w-[22rem] md:h-[22rem] opacity-20 md:opacity-50" viewBox="0 0 200 200" fill="none"
            >
              <circle cx="50" cy="150" r="12" fill="currentColor" />
              <circle cx="100" cy="100" r="16" stroke="currentColor" strokeWidth="3" />
              <circle cx="160" cy="80" r="10" fill="currentColor" />
              <circle cx="130" cy="160" r="8" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="150" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
              <line x1="100" y1="100" x2="160" y2="80" stroke="currentColor" strokeWidth="2" />
              <line x1="100" y1="100" x2="130" y2="160" stroke="currentColor" strokeWidth="2" />
            </motion.svg>

            {/* 4. NEW: Biochemical Hexagon - Added for extra desktop depth, hidden on mobile */}
            <motion.svg 
              animate={{ rotate: -360 }} 
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="hidden lg:block absolute top-[60%] left-[5%] w-48 h-48 opacity-30" viewBox="0 0 200 200" fill="none"
            >
              <path d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
              <line x1="100" y1="20" x2="100" y2="60" stroke="currentColor" strokeWidth="2" />
              <line x1="30" y1="140" x2="65" y2="120" stroke="currentColor" strokeWidth="2" />
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* Content Container */}
        <motion.div 
          style={{ opacity: heroOpacity }}
          className="relative z-20 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-8 md:mb-10"
            >
              <div className="h-[1px] w-8 md:w-12 bg-[#0096a4]" />
              <span className="tracking-[0.15em] md:tracking-[0.2em] text-[#0096a4] text-[10px] md:text-xs font-bold uppercase bg-[#0096a4]/5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-[#0096a4]/10 shadow-sm">
                {ASSOCIATION_INFO.abbreviation} • Registered Society
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[3.5rem] leading-[1.1] sm:text-6xl md:text-8xl lg:text-[8.5rem] font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] tracking-tight md:leading-[0.95] text-[#1a365d]"
            >
              Advancing <br />
              <span className="italic text-[#0096a4] font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] pr-4">
                Genesis.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="mt-6 md:mt-8 text-lg md:text-2xl text-slate-600 max-w-2xl font-light leading-relaxed"
            >
              {ASSOCIATION_INFO.tagline}. We are the official professional body setting benchmarks in <span className="italic font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-[#1a365d] font-medium">clinical embryology</span> and <span className="italic font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-[#1a365d] font-medium">Assisted Reproductive Technology</span> across Andhra Pradesh.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto"
            >
              <a 
                href="/membership" 
                className="group w-full sm:w-auto relative flex items-center justify-center gap-3 bg-[#1a365d] text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-medium hover:bg-[#0096a4] transition-all duration-500 shadow-xl shadow-[#1a365d]/20 overflow-hidden"
              >
                <span className="relative z-10">Become a Member</span>
                <ArrowRight className="relative z-10 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
              </a>
              
              <a 
                href="/about" 
                className="group w-full sm:w-auto flex items-center justify-center gap-2 text-slate-600 font-medium hover:text-[#0096a4] transition-colors duration-300 py-3 px-6 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200"
              >
                Explore Our Mandate
                <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 2. STATS & INFO SECTION */}
     
      <section className="relative z-30 bg-[#FAFAFA] px-8 md:px-16 lg:px-24 py-32 border-b border-slate-200 overflow-hidden">
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0096a4]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/3 translate-x-1/3" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10">
          
          {/* Left Content Area */}
          <div className="lg:col-span-5 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="flex items-center gap-4 text-[#0096a4] text-xs font-bold uppercase tracking-widest mb-6">
                <div className="h-[1px] w-8 bg-[#0096a4]" />
                Our Commitment
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] leading-[1.1] text-[#1a365d]">
                Setting the <span className="italic text-[#0096a4]">gold standard</span> in clinical embryology.
              </h2>
              <p className="mt-8 text-lg text-slate-500 font-light leading-relaxed">
                {ASSOCIATION_INFO.actReference}. We are the authoritative voice and regulatory representative for reproductive medicine professionals across Andhra Pradesh.
              </p>
            </motion.div>

            {/* Reintegrated Value Props for Layout Balance */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              <div className="flex flex-col border-l-2 border-[#0096a4]/20 pl-6 hover:border-[#0096a4] transition-colors duration-300 group">
                 <ShieldCheck className="w-6 h-6 text-[#0096a4] mb-4 group-hover:scale-110 origin-left transition-transform duration-300" />
                 <h3 className="text-xl font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-[#1a365d] mb-2">Statutory Body</h3>
                 <p className="text-sm text-slate-500 font-light">Legal and professional representation.</p>
              </div>
              <div className="flex flex-col border-l-2 border-[#0096a4]/20 pl-6 hover:border-[#0096a4] transition-colors duration-300 group">
                 <Microscope className="w-6 h-6 text-[#0096a4] mb-4 group-hover:scale-110 origin-left transition-transform duration-300" />
                 <h3 className="text-xl font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-[#1a365d] mb-2">Lab Excellence</h3>
                 <p className="text-sm text-slate-500 font-light">Maintaining high standards in ART.</p>
              </div>
            </motion.div>
          </div>
          
          {/* Right Parallax Image Area */}
          <div className="lg:col-span-7 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-full"
            >
              {/* Designer Offset Frame Element */}
              <div className="absolute -inset-4 md:-inset-6 border border-slate-200/80 rounded-sm -z-10 translate-x-4 translate-y-4 bg-white/40 backdrop-blur-sm" />
              
              <div className="relative overflow-hidden rounded-sm shadow-2xl shadow-[#1a365d]/5 bg-white ring-1 ring-slate-100">
                <ParallaxItem  
                  src="/images/Lab_Stock.png"
                  alt="State of the art clinical laboratory"
                  className="aspect-[4/3] md:aspect-[5/4] w-full object-cover"
                  speed={2} 
                />
                
                {/* Elegant Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1a365d]/20 to-transparent pointer-events-none mix-blend-overlay" />
              </div>
            </motion.div>
          </div>
          
        </div>
      </section>

      {/* 3. LATEST NEWS & ANNOUNCEMENTS */}
     
      <LatestAnnouncements/>
  
      {/* 4. BOARD SECTION */}
     <LeadershipSection />

      {/* 5. FINAL MEMBERSHIP CTA */}
       
      <FinalCTASection/>
    </main>
  );
}
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ASSOCIATION_INFO } from '@/app/constants/data';

export default function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.6], ['0%', '50px']);
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full pt-32 md:pt-40 pb-20 px-6 md:px-16 lg:px-24 overflow-hidden border-b border-slate-200 bg-white"
    >
      {/* Background Subtle Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0096a4]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1a365d]/5 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      {/* Abstract Medical Structures Background */}
      <motion.div 
        style={{ y: bgY, opacity: textOpacity }}
        className="absolute   inset-0 z-0 md:flex justify-center items-center pointer-events-none overflow-hidden"
      >
        <motion.div 
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full h-full max-w-[1200px] text-[#0096a4]"
        >
           {/* 1. Dividing Cell */}
           <svg className="absolute top-[10%] left-[5%] md:left-[10%] w-48 h-48 md:w-64 md:h-64 opacity-30" viewBox="0 0 200 200" fill="none">
            <motion.circle animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
            <circle cx="85" cy="85" r="35" stroke="currentColor" strokeWidth="2" className="opacity-60" />
            <circle cx="120" cy="115" r="32" stroke="currentColor" strokeWidth="2" className="opacity-60" />
            <circle cx="125" cy="75" r="28" stroke="currentColor" strokeWidth="2" className="opacity-60" />
            <circle cx="75" cy="125" r="30" stroke="currentColor" strokeWidth="2" className="opacity-60" />
          </svg>

           {/* 2. DNA Helix */}
           <motion.svg 
            animate={{ rotate: 360 }} 
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[5%] right-[-5%] md:top-[15%] md:right-[5%] w-56 h-56 md:w-80 md:h-80 opacity-20 md:opacity-30" viewBox="0 0 200 200" fill="none"
          >
            <path d="M20,100 C60,20 140,20 180,100 C220,180 300,180 340,100" stroke="currentColor" strokeWidth="2" />
            <path d="M20,100 C60,180 140,180 180,100 C220,20 300,20 340,100" stroke="currentColor" strokeWidth="2" />
            <line x1="40" y1="80" x2="40" y2="120" stroke="currentColor" strokeWidth="1" />
            <line x1="70" y1="50" x2="70" y2="150" stroke="currentColor" strokeWidth="1" />
            <line x1="100" y1="35" x2="100" y2="165" stroke="currentColor" strokeWidth="1" />
            <line x1="130" y1="50" x2="130" y2="150" stroke="currentColor" strokeWidth="1" />
            <line x1="160" y1="80" x2="160" y2="120" stroke="currentColor" strokeWidth="1" />
          </motion.svg>

           {/* 3. Molecular Chain */}
           <motion.svg 
            animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] -left-[5%] md:top-[45%] md:left-[2%] w-48 h-48 md:w-72 md:h-72 opacity-20 md:opacity-40" viewBox="0 0 200 200" fill="none"
          >
            <circle cx="50" cy="150" r="12" fill="currentColor" />
            <circle cx="100" cy="100" r="16" stroke="currentColor" strokeWidth="3" />
            <circle cx="160" cy="80" r="10" fill="currentColor" />
            <circle cx="130" cy="160" r="8" stroke="currentColor" strokeWidth="2" />
            <line x1="50" y1="150" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
            <line x1="100" y1="100" x2="160" y2="80" stroke="currentColor" strokeWidth="2" />
            <line x1="100" y1="100" x2="130" y2="160" stroke="currentColor" strokeWidth="2" />
          </motion.svg>

          {/* 4. Biochemical Hexagon */}
          <motion.svg 
            animate={{ rotate: -360 }} 
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="hidden lg:block absolute bottom-[10%] right-[10%] w-40 h-40 opacity-20" viewBox="0 0 200 200" fill="none"
          >
            <path d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
            <line x1="100" y1="20" x2="100" y2="60" stroke="currentColor" strokeWidth="2" />
            <line x1="30" y1="140" x2="65" y2="120" stroke="currentColor" strokeWidth="2" />
          </motion.svg>
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        
        {/* Header Content */}
        <motion.div 
          style={{ opacity: textOpacity, y: textY }}
          className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 md:mb-24"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-4 mb-6 md:mb-8"
          >
            <div className="h-[1px] w-8 md:w-12 bg-[#0096a4]" />
            <span className="tracking-[0.15em] md:tracking-[0.2em] text-[#0096a4] text-[10px] md:text-xs font-bold uppercase bg-[#0096a4]/5 px-4 py-2 rounded-full border border-[#0096a4]/10 shadow-sm">
              Our Legacy & Mission
            </span>
            <div className="h-[1px] w-8 md:w-12 bg-[#0096a4]" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] tracking-tight leading-[1.1] text-[#1a365d] mb-6 md:mb-8"
          >
            Pioneering the future of <br className="hidden md:block" />
            <span className="italic text-[#0096a4] pr-2">Reproductive Science.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg lg:text-xl text-slate-600 font-light leading-relaxed max-w-2xl px-2 md:px-4"
          >
            Founded under the {ASSOCIATION_INFO.actReference}, {ASSOCIATION_INFO.abbreviation} stands as the premier institution uniting clinical embryologists to set unparalleled benchmarks in Assisted Reproductive Technology.
          </motion.p>
        </motion.div>

        {/* Parallax Featured Image */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative h-[40vh] sm:h-[50vh] md:h-[65vh] lg:h-[75vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-[#1a365d]/10 border border-slate-200/50"
        >
          {/* Parallax Container */}
          <motion.div 
            style={{ y: imageY }}
            className="absolute inset-0 -top-[20%] -bottom-[20%] w-full h-[140%]"
          >
            <Image 
              src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2500&auto=format&fit=crop" 
              alt="Clinical Embryology Laboratory"
              fill
              className="object-cover"
              priority
            />
            {/* Elegant Branding Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a365d]/60 via-[#1a365d]/20 to-transparent mix-blend-multiply" />
            <div className="absolute inset-0 bg-[#0096a4]/10 mix-blend-overlay" />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
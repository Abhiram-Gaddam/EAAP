// app/publications/page.tsx (or components/PublicationsPlaceholder.tsx)
"use client";

import { motion } from 'framer-motion';
import { BookOpenText, Microscope, ArrowRight } from 'lucide-react';

export default function PublicationsPlaceholder() {
  return (
    <section className="relative min-h-[80vh] bg-[#1a365d] flex items-center justify-center py-24 px-6 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0096a4]/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-3xl w-full"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 md:p-16 text-center flex flex-col items-center shadow-2xl">
          
          <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8">
            <BookOpenText className="w-10 h-10 text-[#0096a4]" strokeWidth={1.5} />
          </div>

          <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest mb-4 block flex items-center gap-2">
            <Microscope className="w-4 h-4" />
            Research & Library
          </span>
          
          <h1 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
            Scientific <span className="italic text-[#0096a4]">Publications.</span>
          </h1>
          
          <p className="text-white/70 font-light text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            Our digital repository of clinical guidelines, ART research papers, and the official EAAP journal is currently under development. A centralized hub for scientific excellence is coming soon.
          </p>

          <button className="bg-[#0096a4] text-white px-8 py-3.5 rounded-full font-medium text-sm hover:bg-[#007a86] transition-colors duration-300 flex items-center gap-2 group">
            Return to Homepage
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
        </div>
      </motion.div>
    </section>
  );
}
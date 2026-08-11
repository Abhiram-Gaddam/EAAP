'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white flex items-center px-8 md:px-16 lg:px-24">
      {/* Background gradients — matches hero section treatment */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-br from-white via-white to-[#0096a4]/5" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#0096a4]/10 rounded-full blur-[150px] mix-blend-multiply opacity-50" />
      </div>

      {/* Unwinding DNA helix — same motif as homepage, but fraying at one end to read as "incomplete" */}
      <motion.div
        animate={{ y: [0, -16, 0], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:block absolute right-[6%] top-1/2 -translate-y-1/2 w-[420px] h-[420px] text-[#0096a4] pointer-events-none z-0"
      >
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          <path d="M40,200 C100,80 180,80 220,200 C250,290 300,300 330,260" stroke="currentColor" strokeWidth="2" />
          <path d="M40,200 C100,320 180,320 220,200 C250,110 300,100 330,140" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" opacity="0.5" />
          {[70, 105, 140, 175, 210].map((x, i) => (
            <line key={i} x1={x} y1={160 + i * 4} x2={x} y2={240 - i * 4} stroke="currentColor" strokeWidth="1" opacity={0.5} />
          ))}
          {/* fraying end — rungs dissolve into scattered points */}
          <circle cx="300" cy="270" r="2.5" fill="currentColor" opacity="0.6" />
          <circle cx="318" cy="255" r="2" fill="currentColor" opacity="0.4" />
          <circle cx="332" cy="230" r="1.5" fill="currentColor" opacity="0.3" />
          <circle cx="340" cy="200" r="1" fill="currentColor" opacity="0.2" />
        </svg>
      </motion.div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-[1px] w-8 bg-[#0096a4]" />
            <span className="tracking-[0.15em] text-[#0096a4] text-[10px] md:text-xs font-bold uppercase bg-[#0096a4]/5 px-4 py-2 rounded-full border border-[#0096a4]/10 shadow-sm">
              EAAP • Page Not Found
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-[3rem] leading-[1.1] sm:text-6xl md:text-7xl font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] tracking-tight text-[#1a365d]"
          >
            Lost in <br />
            <span className="italic text-[#0096a4]">translation.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="mt-6 md:mt-8 text-lg md:text-xl text-slate-500 max-w-xl font-light leading-relaxed"
          >
            The page you're looking for doesn't exist, or it may have moved. The address didn't
            resolve to anything on our end.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto"
          >
            <a
              href="/"
              className="group w-full sm:w-auto relative flex items-center justify-center gap-3 bg-[#1a365d] text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-medium hover:bg-[#0096a4] transition-all duration-500 shadow-xl shadow-[#1a365d]/20 overflow-hidden"
            >
              <span className="relative z-10">Return Home</span>
              <ArrowRight className="relative z-10 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            </a>

            <a
              href="/membership"
              className="group w-full sm:w-auto flex items-center justify-center gap-2 text-slate-600 font-medium hover:text-[#0096a4] transition-colors duration-300 py-3 px-6 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200"
            >
              Explore Membership
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </a>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
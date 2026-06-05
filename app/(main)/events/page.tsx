// app/events/page.tsx (or components/EventsPlaceholder.tsx)
"use client";

import { motion } from 'framer-motion';
import { CalendarClock, Sparkles, MapPin } from 'lucide-react';

export default function EventsPlaceholder() {
  return (
    <section className="relative min-h-[80vh] bg-[#FAFAFA] flex items-center justify-center py-24 px-6 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-gradient-to-tr from-[#0096a4]/10 to-[#1a365d]/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-full bg-white border border-slate-200 shadow-xl shadow-[#1a365d]/5 flex items-center justify-center mb-8 relative">
          <CalendarClock className="w-10 h-10 text-[#1a365d]" strokeWidth={1.5} />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#0096a4] rounded-full flex items-center justify-center border-2 border-white">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>

        <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest mb-4 block">
          Academic Calendar
        </span>
        
        <h1 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl lg:text-6xl text-[#1a365d] leading-tight mb-6">
          Upcoming <span className="italic text-[#0096a4]">Events & CMEs.</span>
        </h1>
        
        <p className="text-slate-500 font-light text-lg md:text-xl leading-relaxed mb-10">
          We are currently curating our schedule of Continuous Medical Education (CME) programs, hands-on workshops, and the annual state conference. 
        </p>

        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm text-sm text-slate-600">
          <MapPin className="w-4 h-4 text-[#0096a4]" />
          <span>Schedules will be updated shortly.</span>
        </div>
      </motion.div>
    </section>
  );
}
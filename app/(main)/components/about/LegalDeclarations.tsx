"use client";

import { motion } from "framer-motion";
import { Landmark, Scale, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

const DECLARATIONS = [
  {
    id: 1,
    icon: Landmark,
    title: "Registered Society",
    text: "Formally incorporated under the Andhra Pradesh Societies Registration Act 35 of 2001 as the Embryologists Association of Andhra Pradesh (EAAP)."
  },
  {
    id: 2,
    icon: Scale,
    title: "Non-Profit Mandate",
    text: "Certified that the society is established with no profit motive, and absolutely no commercial activity is involved in its operations."
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Financial Integrity",
    text: "Certified that office bearers are not remunerated from society funds. All assets are strictly utilized for the attainment of our scientific objectives."
  },
  {
    id: 4,
    icon: FileText,
    title: "Professional Conduct",
    text: "Certified that the society operates strictly as a professional and scientific academic body, and shall not engage in agitational activities."
  }
];

export default function StatutoryCompliance() {
  return (
    <section className="bg-slate-50 py-32 px-6 md:px-16 lg:px-24 relative overflow-visible border-b border-slate-200">
      
      {/* Soft, Serene Background Mesh Gradient (Glassmorphism Base) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-[#0096a4]/10 rounded-full blur-[100px] opacity-70" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#1a365d]/5 rounded-full blur-[120px] opacity-80" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
        
        {/* Left Side: Sticky Header */}
        <div className="lg:w-5/12 relative">
          <div className="lg:sticky lg:top-40 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="flex items-center gap-2 text-[#0096a4] text-xs font-bold uppercase tracking-widest mb-6">
                <CheckCircle2 className="w-4 h-4" />
                Statutory Compliance
              </span>
              <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-5xl md:text-6xl text-[#1a365d] leading-[1.1] mb-6">
                Legal & Formal <br />
                <span className="italic text-[#0096a4]">Declarations.</span>
              </h2>
              <p className="text-slate-500 font-light text-lg leading-relaxed max-w-md">
                Maintaining absolute transparency and unwavering adherence to the statutory guidelines governing professional medical societies in Andhra Pradesh.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right Side: Sticky Glassmorphic Cards */}
        <div className="lg:w-7/12 flex flex-col pb-[20vh] relative">
          {DECLARATIONS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                // Glassmorphism Card Styling
                className="sticky w-full rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col group"
                style={{ 
                  top: `calc(15vh + ${index * 60}px)`, 
                  marginBottom: '24px'
                }}
              >
                {/* Subtle top highlight line for the glass effect */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/0 via-white to-white/0" />

                <div className="p-8 md:p-12 flex flex-col h-full relative z-10">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <Icon className="w-6 h-6 text-[#0096a4]" strokeWidth={1.5} />
                      </div>
                      <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-2xl text-[#1a365d]">
                        {item.title}
                      </h3>
                    </div>
                    <span className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-5xl text-[#1a365d]/5 font-bold">
                      0{item.id}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div>
                    <p className="text-slate-600 font-light text-lg md:text-xl leading-relaxed">
                      {item.text}
                    </p>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import { Landmark, Activity, ShieldCheck } from "lucide-react";

const PILLARS = [
    {
        id: 1,
        icon: Landmark,
        title: "Our Foundation",
        text: "The Embryologists Association of Andhra Pradesh (EAAP) was established as a registered society under the Andhra Pradesh Societies Registration Act 35 of 2001. We operate strictly as a non-profit organization dedicated to advancing the science and practice of Clinical Embryology without any commercial motives."
    },
    {
        id: 2,
        icon: Activity,
        title: "Our Core Mission",
        text: "At our core, we are the authoritative voice for reproductive medicine professionals across the state. We exist to establish and maintain the highest benchmarks in ART laboratories. By uniting practitioners, we create a unified infrastructure that represents embryologists in critical legal, regulatory, and professional matters."
    },
    {
        id: 3,
        icon: ShieldCheck,
        title: "Our Vision for the Future",
        text: "Today, EAAP stands as the definitive professional body empowering our members through continuous education, rigorous standards, and ethical guidance. We are committed to ensuring that every clinical embryologist has the support necessary to deliver world-class patient care with absolute integrity."
    }
];

export default function WhoWeAre() {
    return (
        <section className="bg-white py-24 md:py-32 px-6 md:px-16 lg:px-24 border-b border-slate-100 relative overflow-hidden">
            
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#0096a4]/5 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start relative z-10">
                
                {/* Left Column: Heading */}
                <div className="lg:col-span-5 flex flex-col items-start relative lg:sticky lg:top-40">
                    <motion.div
                        initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-[1px] w-8 bg-[#0096a4]" />
                            <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest">
                                Who We Are
                            </span>
                        </div>
                        
                        <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-5xl md:text-6xl lg:text-7xl text-[#1a365d] leading-[1.05] tracking-tight">
                            Where Clinical Rigor Meets <br className="hidden lg:block" />
                            <span className="italic text-[#0096a4]">Integrity.</span>
                        </h2>

                        <p className="mt-8 text-slate-500 font-light text-lg leading-relaxed max-w-sm">
                            United to establish unparalleled benchmarks in Assisted Reproductive Technology and clinical excellence.
                        </p>
                    </motion.div>
                </div>

                {/* Right Column: Content with Timeline Aesthetic */}
                <div className="lg:col-span-7 relative">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[27px] top-8 bottom-8 w-[1px] bg-gradient-to-b from-[#0096a4]/30 via-slate-200 to-transparent hidden md:block" />

                    <div className="flex flex-col gap-12 md:gap-16">
                        {PILLARS.map((pillar, index) => {
                            const Icon = pillar.icon;
                            return (
                                <motion.div
                                    key={pillar.id}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
                                    className="relative flex flex-col md:flex-row gap-6 md:gap-8 group"
                                >
                                    {/* Icon / Node */}
                                    <div className="relative z-10 shrink-0">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center group-hover:bg-[#0096a4]/5 group-hover:border-[#0096a4]/20 transition-all duration-500">
                                            <Icon className="w-6 h-6 text-[#1a365d] group-hover:text-[#0096a4] transition-colors duration-500" strokeWidth={1.5} />
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex flex-col pt-2">
                                        <h3 className="text-xl md:text-2xl font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-[#1a365d] mb-4">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-slate-600 font-light text-lg md:text-xl leading-relaxed">
                                            {pillar.text}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}
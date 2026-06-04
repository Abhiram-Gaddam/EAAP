"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const MANDATES = [
    {
        id: 1,
        title: "Promote Clinical Embryology",
        description: "Advancing the science and practice of Clinical Embryology across the state."
    },
    {
        id: 2,
        title: "High Standards in ART",
        description: "Establishing and maintaining rigorous quality standards in all ART laboratories."
    },
    {
        id: 3,
        title: "Continuous Education",
        description: "Conducting regular CMEs, workshops, conferences, and comprehensive training programs."
    },
    {
        id: 4,
        title: "Research & Innovation",
        description: "Encouraging and supporting groundbreaking research in reproductive medicine."
    },
    {
        id: 5,
        title: "Professional Development",
        description: "Supporting the career growth and overall welfare of practicing embryologists."
    },
    {
        id: 6,
        title: "Public Awareness",
        description: "Creating widespread awareness about Assisted Reproductive Technology among the general public."
    },
    {
        id: 7,
        title: "Global Collaboration",
        description: "Fostering strong collaborations with national and international reproductive medical bodies."
    },
    {
        id: 8,
        title: "Regulatory Representation",
        description: "Representing the interests of embryologists in legal, regulatory, and professional forums."
    }
];

export default function OurMandate() {
    return (
        <section className="bg-[#FAFAFA] py-24 md:py-32 px-6 md:px-16 lg:px-24 border-b border-slate-200">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
                
                {/* Left Column: Sticky Header */}
                <div className="lg:col-span-5 flex flex-col items-start lg:sticky lg:top-40">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl lg:text-6xl text-[#1a365d] leading-[1.1] mb-6">
                            The Core <br />
                            <span className="italic text-[#0096a4]">Objectives</span>
                        </h2>
                        <p className="text-slate-600 font-light text-base leading-relaxed max-w-md">
                            Our registered mandate establishes a unified framework built for precision, continuous education, and the long-term growth of clinical embryology in Andhra Pradesh.
                        </p>
                    </motion.div>
                </div>

                {/* Right Column: List of Mandates */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    {MANDATES.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="bg-white p-5 md:p-6 rounded-xl border border-slate-100 hover:border-[#0096a4]/20 transition-colors duration-300 flex items-start gap-4 group"
                        >
                            <div className="mt-0.5 shrink-0">
                                <CheckCircle2 className="w-5 h-5 text-[#0096a4]/50 group-hover:text-[#0096a4] transition-colors duration-300" strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-lg font-medium text-[#1a365d]">
                                    {item.title}
                                </h3>
                                <p className="text-slate-500 font-light text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
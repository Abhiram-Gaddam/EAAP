"use client";

import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, CreditCard, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ESSENTIAL_GUIDELINES = [
  "Membership is maintained through an annual subscription, payable at the start of each financial year.",
  "Members are expected to uphold the highest standards of clinical integrity and professional conduct.",
  "Detailed statutory policies, forfeiture terms, and eligibility criteria are available in our official legal directory."
];

export default function FeeStructureAndGuidelines() {
  return (
    <section id="fee-structure-section" className="bg-[#FAFAFA] py-24 md:py-32 px-6 md:px-16 lg:px-24 border-b border-slate-200 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0096a4]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
        
        {/* Left Column: Standard Membership Card */}
        <div className="lg:w-5/12 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-8 bg-[#0096a4]" />
              <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest">
                Subscriptions & Fees
              </span>
            </div>
            <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl text-[#1a365d] leading-[1.1]">
              Membership <span className="italic text-[#0096a4]">Structure.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative p-8 md:p-10 rounded-[2rem] bg-[#1a365d] border border-[#1a365d] text-white shadow-2xl shadow-[#1a365d]/20 overflow-hidden"
          >
            {/* Decorative Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#0096a4]/20 to-transparent rounded-bl-full pointer-events-none" />

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white/10 backdrop-blur-sm">
                  <CreditCard className="w-6 h-6 text-[#0096a4]" strokeWidth={1.5} />
                </div>
                <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-3xl mb-2">
                  Standard Membership
                </h3>
                <p className="text-sm text-white/70">
                  The official membership for clinical embryologists in Andhra Pradesh.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold mb-1 text-[#0096a4]">
                  Admission Fee
                </p>
                <p className="text-3xl font-semibold">₹1,500</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold mb-1 text-[#0096a4]">
                  Annual Subscription
                </p>
                <p className="text-3xl font-semibold">
                  ₹1,500 <span className="text-sm font-normal opacity-70">/ year</span>
                </p>
              </div>
            </div>

            <div className="space-y-4 relative z-10 pt-6 border-t border-white/10">
              {[
                'Voting rights at General Body meetings',
                'Access to all EAAP scientific programs',
                'Participation in CMEs, workshops, and conferences',
                'Unified representation in regulatory matters'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#0096a4]" />
                  <span className="text-sm text-white/90">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Cleaned Up Guidelines */}
        <div className="lg:w-7/12 flex flex-col lg:pl-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="sticky top-32 bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full bg-[#0096a4]/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#0096a4]" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-2xl text-[#1a365d]">
                  Membership Essentials
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Core expectations for EAAP members
                </p>
              </div>
            </div>

            <ul className="flex flex-col gap-6 mb-8">
              {ESSENTIAL_GUIDELINES.map((guideline, idx) => (
                <motion.li 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + (idx * 0.1) }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0096a4] shrink-0" />
                  <span className="text-slate-600 leading-relaxed font-light text-base">
                    {guideline}
                  </span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <Link 
                href="/legal" 
                className="inline-flex items-center gap-2 text-[#1a365d] hover:text-[#0096a4] font-medium text-sm transition-colors duration-300 group"
              >
                Read full eligibility & legal terms
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
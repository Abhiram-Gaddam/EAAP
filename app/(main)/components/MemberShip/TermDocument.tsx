"use client";

import { motion } from 'framer-motion';
import { FileCheck, UserMinus, ArrowRight, Scale } from 'lucide-react';
import Link from 'next/link';

export default function TermsAndDocuments() {
  return (
    <section id="terms-section" className="bg-white py-24  px-6 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-2xl"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-[#0096a4]" />
            <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest">
              Final Requirements
            </span>
            <div className="h-[1px] w-8 bg-[#0096a4]" />
          </div>
          <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl text-[#1a365d] leading-[1.1] mb-6">
            Prerequisites & <span className="italic text-[#0096a4]">Policies.</span>
          </h2>
          <p className="text-slate-500 font-light text-base md:text-lg leading-relaxed">
            A brief overview of the necessary documentation and statutory rules regarding membership forfeiture. Full details are available in our legal directory.
          </p>
        </motion.div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
          
          {/* Documents Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-[#FAFAFA] rounded-[2rem] p-8 md:p-10 border border-slate-200 hover:border-[#0096a4]/30 transition-colors duration-500"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6">
              <FileCheck className="w-6 h-6 text-[#1a365d]" strokeWidth={1.5} />
            </div>
            <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-2xl text-[#1a365d] mb-4">
              Required Documentation
            </h3>
            <p className="text-slate-600 font-light text-sm md:text-base leading-relaxed mb-6">
              To verify your eligibility, you will need to provide standard professional credentials during your application. Have these ready:
            </p>
            <ul className="space-y-3">
              {[
                "Government-issued ID Proof",
                "Latest Educational Certificates",
                "Employment or Experience Verification",
                "Passport Size Photograph"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0096a4]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Cancellation & Forfeiture Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#FAFAFA] rounded-[2rem] p-8 md:p-10 border border-slate-200 hover:border-[#1a365d]/30 transition-colors duration-500"
          >
            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6">
              <UserMinus className="w-6 h-6 text-[#1a365d]" strokeWidth={1.5} />
            </div>
            <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-2xl text-[#1a365d] mb-4">
              Cancellation & Forfeiture
            </h3>
            <p className="text-slate-600 font-light text-sm md:text-base leading-relaxed mb-6">
              As per the EAAP official guidelines, membership can be forfeited under specific circumstances:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
                <span>Any member of the Society may resign his membership by notifying the Secretary in writing[cite: 1].</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
                <span>If the annual subscription is not paid within three months from the date of commencement of the financial year, such member shall forfeit the membership[cite: 1].</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 shrink-0" />
                <span>Membership is forfeited for those who fail to attend three consecutive meetings of the managing committee, or those who are expelled by the committee for conduct detrimental to the society[cite: 1].</span>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* Global CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link 
            href="/legal" 
            className="inline-flex items-center gap-3 bg-white border border-slate-200 text-[#1a365d] px-8 py-4 rounded-full font-medium text-sm hover:border-[#0096a4] hover:text-[#0096a4] hover:shadow-lg transition-all duration-300 group"
          >
            <Scale className="w-4 h-4" />
            Review Full Legal & Eligibility Guidelines
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
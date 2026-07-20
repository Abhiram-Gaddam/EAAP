"use client";

import { motion } from 'framer-motion';
import { Lock, ShieldCheck, MapPin, Building, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-16 lg:px-24 relative font-sans overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#FAFAFA]">
        <div className="absolute top-[-10%] right-[-5%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-gradient-to-bl from-slate-200/60 via-[#0096a4]/5 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-gradient-to-tr from-slate-200/60 via-[#1a365d]/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[#1a365d] text-[11px] font-medium uppercase tracking-widest mb-6 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-[#0096a4] stroke-[1.5]" /> Legal & Privacy
          </div>
          <h1 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl lg:text-6xl text-[#1a365d] tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            Privacy & <span className="italic text-[#0096a4]">Statutory Policy.</span>
          </h1>
          <p className="text-slate-500 font-normal leading-relaxed text-lg md:text-xl max-w-3xl text-center mx-auto">
            The Embryologists Association of Andhra Pradesh (EAAP) operates strictly in accordance with its Memorandum of Association and state regulations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 bg-white/80 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] border border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Building className="w-6 h-6 text-[#1a365d]" />
              </div>
              <h3 className="text-2xl font-medium text-[#1a365d]">Statutory Operations</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-[#0096a4] shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-[#1a365d] mb-1">Non-Profit Status</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Certified that the society is formed with no profit motive and no commercial activity is involved in its working. The Funds of the society shall be spent for the attainment of the object of the society and no portion thereof shall be paid or transferred directly or indirectly to any of its members through by any means.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-[#0096a4] shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-[#1a365d] mb-1">Financial Auditing</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    The accounts of the society shall be audited by a qualified chartered accountant and the financial year of the society shall be April 1st to March 31st.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[#1a365d] text-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_10px_30px_rgba(26,54,93,0.15)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full" />
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 relative z-10">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-medium mb-4 relative z-10">Registered Office</h3>
            <p className="text-white/80 text-sm leading-relaxed relative z-10">
              Embryologists Association of Andhra Pradesh (EAAP)
            </p>
            <p className="text-white/80 text-sm leading-relaxed relative z-10 mt-2">
              Door No.3-161/53-509, Nidamanuru, Vijayawada Rural, N.T.R. District.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] border border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#0096a4]" />
            </div>
            <h3 className="text-2xl font-medium text-[#1a365d]">Data Privacy & Security</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-3 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors">
              <FileText className="w-6 h-6 text-[#1a365d]" />
              <h5 className="font-medium text-[#1a365d]">Data Collection</h5>
              <p className="text-slate-600 font-normal text-sm leading-relaxed">
                We collect personal and professional data strictly for verifying membership eligibility, maintaining the official society register, and issuing certificates.
              </p>
            </div>
            <div className="flex flex-col gap-3 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors">
              <Lock className="w-6 h-6 text-[#1a365d]" />
              <h5 className="font-medium text-[#1a365d]">Data Protection</h5>
              <p className="text-slate-600 font-normal text-sm leading-relaxed">
                All uploaded documents and credentials are encrypted. Your data is not sold, rented, or shared with third-party commercial entities under any circumstances.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
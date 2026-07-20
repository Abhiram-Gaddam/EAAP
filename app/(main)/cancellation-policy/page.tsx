"use client";

import { motion } from 'framer-motion';
import { UserMinus, ShieldAlert, CheckCircle2, Gavel, Scale } from 'lucide-react';

export default function CancellationPolicyPage() {
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
          className="mb-16 text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[#1a365d] text-[11px] font-medium uppercase tracking-widest mb-6 shadow-sm">
            <Scale className="w-3.5 h-3.5 text-[#0096a4] stroke-[1.5]" /> Statutory Guidelines
          </div>
          <h1 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl lg:text-6xl text-[#1a365d] tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
            Cancellation & <span className="italic text-[#0096a4]">Forfeiture.</span>
          </h1>
          <p className="text-slate-500 font-normal text-base md:text-lg leading-relaxed max-w-2xl">
            Pursuant to the Memorandum of Association, the following conditions strictly govern the forfeiture, resignation, and expulsion of members from the Embryologists Association of Andhra Pradesh.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.05)] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 shadow-inner">
              <UserMinus className="w-6 h-6 text-[#1a365d]" />
            </div>
            <h3 className="text-2xl font-medium text-[#1a365d] mb-4">Voluntary Resignation</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0096a4] shrink-0 mt-0.5" />
                <span className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Those who resign in writing and whose resignations are accepted by the managing Committee.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0096a4] shrink-0 mt-0.5" />
                <span className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Any member of the Society may resign his membership by notifying the Secretary in writing.
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.05)] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6 shadow-inner">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-medium text-[#1a365d] mb-4">Involuntary Forfeiture</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#0096a4] shrink-0 mt-0.5" />
                <span className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Those who fail to attend three consecutive meetings of the managing committee.
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-white shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_35px_rgba(0,0,0,0.05)] transition-all lg:col-span-2"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-6 shadow-inner">
              <Gavel className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-2xl font-medium text-[#1a365d] mb-4">Expulsion</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 leading-relaxed text-sm md:text-base">
                  Those who were expelled by the Managing committee.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 leading-relaxed text-sm md:text-base">
                  The executive committee may at its discretion take such action including expulsion of a member in case the conduct or the activities of such member are found to be detrimental to the interests of the society.
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative overflow-hidden p-8 bg-gradient-to-br from-[#0096a4]/10 to-transparent border border-white rounded-[2rem] shadow-[0_2px_15px_rgba(0,0,0,0.02)]"
          >
            <h5 className="text-xl font-medium text-[#1a365d] mb-3">Rejoining Policy</h5>
            <p className="text-slate-600 font-normal text-sm md:text-base m-0 leading-relaxed">
              The Persons whose membership is forfeited, can rejoin as members subject to the approval of the managing committee on payment of such fee as determined and within the time laid down by them.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative overflow-hidden p-8 bg-gradient-to-br from-[#1a365d]/10 to-transparent border border-white rounded-[2rem] shadow-[0_2px_15px_rgba(0,0,0,0.02)]"
          >
            <h5 className="text-xl font-medium text-[#1a365d] mb-3">Resolution of Disputes</h5>
            <p className="text-slate-600 font-normal text-sm md:text-base m-0 leading-relaxed">
              In the event of any disputes, arising among the committee or the members of the society in respect of any matter relating to the affairs of the Society, any member of the society may proceed with the dispute under the provisions as mentioned in the A.P.S.R.Act(Section 23).
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
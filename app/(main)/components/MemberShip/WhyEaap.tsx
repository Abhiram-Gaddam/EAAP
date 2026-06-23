// 'use client'
// import { motion } from "framer-motion";
// import { FileCheck, UserMinus, ArrowRight, Star, BookOpen, Award, Briefcase, CheckSquare, FlaskConical, Microscope, Network, Tag, Gem } from 'lucide-react';

// const LIFETIME_BENEFITS = [
//     { id: 1, icon: Gem, text: 'Lifetime membership without renewal' },
//     { id: 2, icon: Award, text: 'Membership certificate' },
//     { id: 3, icon: Tag, text: 'Discounts on conferences and workshops' },
//     { id: 4, icon: BookOpen, text: 'Exclusive educational programs' },
//     { id: 5, icon: Network, text: 'Networking with ART professionals' },
//     { id: 6, icon: Microscope, text: 'Scientific updates and newsletters' },
//     { id: 7, icon: Briefcase, text: 'Leadership and committee opportunities' },
//     { id: 8, icon: FlaskConical, text: 'Research and publication support' },
//     { id: 9, icon: CheckSquare, text: 'Voting and election eligibility' },
//     { id: 10, icon: Star, text: 'Professional recognition and career growth' }
//   ];
  
//  export default function MembershipBenefits() {
//     return (
//       <section className="bg-white py-24 md:py-32 px-6 md:px-16 lg:px-24 border-b border-slate-100 relative overflow-hidden">
//         {/* Background Decor */}
//         <div className="absolute inset-0 pointer-events-none">
//           <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-[#0096a4]/5 to-transparent rounded-full blur-[80px]" />
//           <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-bl from-[#1a365d]/5 to-transparent rounded-full blur-[100px]" />
//         </div>
  
//         <div className="max-w-7xl mx-auto relative z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: "-100px" }}
//             transition={{ duration: 0.6 }}
//             className="text-center max-w-3xl mx-auto mb-16"
//           >
//             <div className="flex items-center justify-center gap-4 mb-6">
//               <div className="h-[1px] w-8 bg-[#0096a4]" />
//               <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest">
//                 Premium Value
//               </span>
//               <div className="h-[1px] w-8 bg-[#0096a4]" />
//             </div>
//             <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl text-[#1a365d] leading-[1.1] mb-6">
//               Why Become an EAAP <span className="italic text-[#0096a4]">Lifetime Member?</span>
//             </h2>
//             <p className="text-slate-500 font-light text-lg leading-relaxed">
//               Unlock exclusive career advantages, unmatched networking opportunities, and continuous scientific growth within Andhra Pradesh's premier clinical embryology community.
//             </p>
//           </motion.div>
  
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//             {LIFETIME_BENEFITS.map((benefit, idx) => {
//               const Icon = benefit.icon;
//               return (
//                 <motion.div
//                   key={benefit.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true, margin: "-50px" }}
//                   transition={{ duration: 0.5, delay: idx * 0.05 }}
//                   className="group relative bg-[#FAFAFA] p-6 rounded-[1.5rem] border border-slate-200 hover:border-[#0096a4]/30 hover:shadow-[0_8px_30px_rgb(0,150,164,0.08)] transition-all duration-500 flex items-center gap-5 overflow-hidden"
//                 >
//                   <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-[#0096a4]/5 to-transparent rounded-bl-full transition-transform duration-700 group-hover:scale-150" />
//                   <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-[#0096a4] group-hover:border-[#0096a4] transition-colors duration-500 relative z-10">
//                     <Icon className="w-6 h-6 text-[#1a365d] group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
//                   </div>
//                   <span className="font-medium text-[#1a365d] text-base md:text-lg relative z-10 leading-tight">
//                     {benefit.text}
//                   </span>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       </section>
//     );
//   } 

'use client'

import { motion } from "framer-motion";
import {
  Gem,
  Award,
  Tag,
  BookOpen,
  Network,
  Microscope,
  Briefcase,
  CheckSquare,
  FlaskConical,
  Star,
} from "lucide-react";

const benefits = [
  { icon: Gem, label: "Lifetime Membership" },
  { icon: Award, label: "Membership Certificate" },
  { icon: Tag, label: "Conference Discounts" },
  { icon: BookOpen, label: "Educational Programs" },
  { icon: Network, label: "Professional Networking" },
  { icon: Microscope, label: "Scientific Updates" },
  { icon: Briefcase, label: "Leadership Opportunities" },
  { icon: FlaskConical, label: "Research Support" },
  { icon: CheckSquare, label: "Voting Rights" },
  { icon: Star, label: "Career Growth" },
];

export default function MembershipBenefits() {
  return (
    <section className="relative overflow-hidden bg-white py-24 lg:py-32 px-6">
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0096a4]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="uppercase tracking-[0.3em] text-[#0096a4] text-xs font-semibold mb-4">
            Premium Value
          </p>
          <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl lg:text-6xl text-[#1a365d] leading-tight">
            Why Become an EAAP{" "}
            <span className="italic text-[#0096a4]">
              Lifetime Member?
            </span>
          </h2>
          <p className="mt-6 text-slate-500 text-lg leading-relaxed">
            A prestigious professional identity backed by education,
            research, leadership opportunities, and lifelong recognition.
          </p>
        </div>

        <div className="hidden lg:flex justify-center">
          <div className="relative w-[800px] h-[800px] mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 120,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border border-[#0096a4]/10"
            />

            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 150,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-[120px] rounded-full border border-[#1a365d]/10"
            />

            <div className="absolute left-1/2 top-1/2 w-[260px] h-[260px] -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative h-full w-full rounded-full bg-white border-[12px] border-[#0096a4]/10 shadow-[0_30px_80px_rgba(0,0,0,0.08)] flex items-center justify-center">
                <div className="absolute inset-5 rounded-full border border-dashed border-[#0096a4]/20" />
                <div className="text-center px-8">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#0096a4]">
                    <Gem className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-3xl text-[#1a365d]">
                    EAAP
                  </h3>
                  <div className="w-16 h-px bg-[#0096a4] mx-auto my-4" />
                  <p className="uppercase tracking-[0.25em] text-xs text-[#0096a4] font-semibold">
                    Lifetime Member
                  </p>
                  <p className="mt-4 text-slate-500 text-sm">
                    Scientific Excellence • Leadership • Recognition
                  </p>
                </div>
              </div>
            </div>

            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              const angle = (2 * Math.PI * i) / benefits.length;
              const radius = 320;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);

              return (
                <div
                  key={benefit.label}
                  className="absolute z-30"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.05,
                    }}
                  >
                    <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-md hover:shadow-xl hover:border-[#0096a4]/30 transition-all duration-300">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0096a4]/10 group-hover:bg-[#0096a4] transition-colors">
                        <Icon className="h-5 w-5 text-[#0096a4] group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-[#1a365d] whitespace-nowrap">
                        {benefit.label}
                      </span>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:hidden">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.label}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0096a4]/10">
                  <Icon className="h-5 w-5 text-[#0096a4]" />
                </div>
                <span className="font-medium text-[#1a365d]">
                  {benefit.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
// 'use client';

// import { useRef } from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';
// import { Microscope, ShieldCheck, BookOpen, ArrowRight, ArrowUpRight } from 'lucide-react';
// import { ASSOCIATION_INFO, AIMS_AND_OBJECTIVES, GOVERNING_BODY } from '@/app/constants/data';

// export default function Home() {
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   const { scrollYProgress: heroScrollY } = useScroll({
//     target: containerRef,
//     offset: ['start start', 'end start'],
//   });
  
//   const heroY = useTransform(heroScrollY, [0, 1], ['0%', '50%']);
//   const heroScale = useTransform(heroScrollY, [0, 1], [1, 1.1]);
//   const heroOpacity = useTransform(heroScrollY, [0, 0.8], [1, 0]);

//   const horizontalRef = useRef<HTMLDivElement>(null);
//   const { scrollYProgress: horizontalScrollProgress } = useScroll({
//     target: horizontalRef,
//     offset: ['start start', 'end end'],
//   });

//   const xTransform = useTransform(horizontalScrollProgress, [0, 1], ['0%', '-80%']);

//   return (
//     <main ref={containerRef} className="relative w-full bg-[#0a0a0a] text-white selection:bg-[#0096a4]/30">
      
//       <section className="relative h-screen w-full overflow-hidden flex flex-col justify-end pb-24 px-8 md:px-24">
//         <motion.div 
//           style={{ y: heroY, scale: heroScale }}
//           className="absolute inset-0 z-0"
//         >
//           <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#0a0a0a] z-10" />
//           <img 
//             src="https://images.unsplash.com/photo-1583912265927-8cb2f1118b52?q=80&w=2500&auto=format&fit=crop" 
//             alt="Microscopic Cellular Structure" 
//             className="w-full h-full object-cover"
//           />
//         </motion.div>

//         <motion.div 
//           style={{ opacity: heroOpacity }}
//           className="relative z-20 max-w-6xl"
//         >
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
//             className="flex items-center gap-6 mb-8"
//           >
//             <div className="h-[1px] w-24 bg-[#0096a4]" />
//             <span className="tracking-[0.3em] text-[#0096a4] text-xs font-semibold uppercase">
//               {ASSOCIATION_INFO.abbreviation} • Registered Society
//             </span>
//           </motion.div>
          
//           <motion.h1 
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
//             className="text-6xl md:text-8xl lg:text-[10rem] font-serif tracking-tighter leading-[0.9] text-white"
//           >
//             Advancing<br />
//             <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-white">Genesis.</span>
//           </motion.h1>
//         </motion.div>
//       </section>

//       <section className="relative z-30 bg-[#0a0a0a] px-8 md:px-24 py-32">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
//           <div className="md:w-1/2">
//             <motion.p 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8 }}
//               className="text-3xl md:text-5xl font-serif leading-tight text-slate-300"
//             >
//               Setting the gold standard in <span className="text-[#0096a4] italic">clinical embryology</span> and ART across Andhra Pradesh.
//             </motion.p>
//             <motion.p 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="mt-8 text-lg text-slate-500 font-light max-w-md"
//             >
//               {ASSOCIATION_INFO.actReference}. We are the authoritative voice and regulatory representative for reproductive medicine professionals.
//             </motion.p>
//           </div>
          
//           <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <img 
//               src="https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000&auto=format&fit=crop" 
//               alt="Laboratory Process" 
//               className="w-full h-80 object-cover rounded-sm grayscale hover:grayscale-0 transition-all duration-700"
//             />
//             <div className="flex flex-col gap-4">
//               <div className="bg-[#111] p-8 h-full flex flex-col justify-center rounded-sm border border-white/5 hover:border-[#0096a4]/30 transition-colors">
//                  <ShieldCheck className="w-8 h-8 text-[#0096a4] mb-4" />
//                  <h3 className="text-xl font-serif text-white mb-2">Statutory Body</h3>
//                  <p className="text-sm text-slate-500 font-light">Legal and professional representation.</p>
//               </div>
//               <div className="bg-[#111] p-8 h-full flex flex-col justify-center rounded-sm border border-white/5 hover:border-[#0096a4]/30 transition-colors">
//                  <Microscope className="w-8 h-8 text-[#0096a4] mb-4" />
//                  <h3 className="text-xl font-serif text-white mb-2">Lab Excellence</h3>
//                  <p className="text-sm text-slate-500 font-light">Maintaining high standards in ART.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section ref={horizontalRef} className="relative h-[300vh] bg-[#050505]">
//         <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
//           <div className="absolute top-0 left-0 w-full p-8 md:p-24 z-20 pointer-events-none flex justify-between items-start">
//              <h2 className="text-2xl md:text-4xl font-serif text-white">Our<br/><span className="text-slate-500 italic">Mandate</span></h2>
//              <span className="text-sm tracking-widest text-[#0096a4] uppercase">Scroll to explore</span>
//           </div>
          
//           <motion.div 
//             style={{ x: xTransform }}
//             className="flex gap-12 px-8 md:px-[20vw] pt-24"
//           >
//             {AIMS_AND_OBJECTIVES.map((aim, idx) => (
//               <div 
//                 key={aim.id} 
//                 className="w-[85vw] md:w-[35vw] flex-shrink-0 relative group"
//               >
//                 <div className="h-[60vh] md:h-[70vh] relative overflow-hidden rounded-sm">
//                   <img 
//                     src={`https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1000&auto=format&fit=crop&sig=${idx}`} 
//                     alt="Abstract Scientific" 
//                     className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 opacity-40 group-hover:opacity-60"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
                  
//                   <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
//                     <span className="text-[#0096a4] text-xl font-serif mb-4 block">
//                       {String(idx + 1).padStart(2, '0')}
//                     </span>
//                     <p className="text-3xl md:text-4xl font-serif text-white leading-tight">
//                       {aim.text}.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       <section className="relative py-32 px-8 md:px-24 bg-[#0a0a0a] border-t border-white/5">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
          
//           <div className="md:w-1/3 relative">
//             <div className="sticky top-32">
//               <img 
//                 src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop" 
//                 alt="President" 
//                 className="w-full h-[500px] object-cover rounded-sm grayscale"
//               />
//               <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black to-transparent">
//                 <p className="text-2xl font-serif text-white">{GOVERNING_BODY[0].name}</p>
//                 <p className="text-[#0096a4] text-sm tracking-widest uppercase mt-2">{GOVERNING_BODY[0].designation}</p>
//               </div>
//             </div>
//           </div>

//           <div className="md:w-2/3 flex flex-col justify-center">
//             <h2 className="text-5xl md:text-7xl font-serif text-white mb-12">
//               Executive <br/><span className="text-slate-600 italic">Board</span>
//             </h2>
            
//             <div className="space-y-0">
//               {GOVERNING_BODY.slice(1, 6).map((member) => (
//                 <div key={member.sNo} className="group border-b border-white/10 py-8 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors px-6 -mx-6">
//                   <div>
//                     <span className="text-[#0096a4] text-xs tracking-widest block mb-2 uppercase">{member.designation}</span>
//                     <span className="text-2xl md:text-3xl font-serif text-slate-300 group-hover:text-white transition-colors">{member.name}</span>
//                   </div>
//                   <ArrowUpRight className="w-8 h-8 text-slate-600 group-hover:text-white transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500" />
//                 </div>
//               ))}
//             </div>
            
//             <button className="mt-16 w-fit flex items-center gap-4 text-sm uppercase tracking-widest text-white border-b border-[#0096a4] pb-2 hover:gap-8 transition-all">
//               View Full Directory <ArrowRight className="w-4 h-4 text-[#0096a4]" />
//             </button>
//           </div>

//         </div>
//       </section>
//     </main>
//   );
// // }
// 'use client';

// import { useRef } from 'react';
// import { motion, useScroll, useTransform } from 'framer-motion';
// import { Microscope, ShieldCheck, BookOpen, ArrowRight, ArrowUpRight } from 'lucide-react';
// import { ASSOCIATION_INFO, AIMS_AND_OBJECTIVES, GOVERNING_BODY } from '@/app/constants/data';

// export default function Home() {
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   const { scrollYProgress: heroScrollY } = useScroll({
//     target: containerRef,
//     offset: ['start start', 'end start'],
//   });
  
//   const heroY = useTransform(heroScrollY, [0, 1], ['0%', '40%']);
//   const heroScale = useTransform(heroScrollY, [0, 1], [1, 1.05]);
//   const heroOpacity = useTransform(heroScrollY, [0, 0.8], [1, 0]);

//   const horizontalRef = useRef<HTMLDivElement>(null);
//   const { scrollYProgress: horizontalScrollProgress } = useScroll({
//     target: horizontalRef,
//     offset: ['start start', 'end end'],
//   });

//   const xTransform = useTransform(horizontalScrollProgress, [0, 1], ['0%', '-80%']);

//   return (
//     <main ref={containerRef} className="relative w-full bg-[#FAFAFA] text-slate-900 selection:bg-[#0096a4]/20">
      
//       <section className="relative h-screen w-full overflow-hidden flex flex-col justify-end pb-24 px-8 md:px-24 bg-white">
//         <motion.div 
//           style={{ y: heroY, scale: heroScale }}
//           className="absolute inset-0 z-0"
//         >
//           <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
//           <div className="absolute inset-0 bg-white/20 z-10" />
//           <img 
//             src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2500&auto=format&fit=crop" 
//             alt="Abstract Scientific Fluid" 
//             className="w-full h-full object-cover opacity-30 mix-blend-multiply"
//           />
//         </motion.div>

//         <motion.div 
//           style={{ opacity: heroOpacity }}
//           className="relative z-20 max-w-6xl"
//         >
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
//             className="flex items-center gap-6 mb-8"
//           >
//             <div className="h-[1px] w-24 bg-[#0096a4]" />
//             <span className="tracking-[0.3em] text-[#0096a4] text-xs font-semibold uppercase">
//               {ASSOCIATION_INFO.abbreviation} • Registered Society
//             </span>
//           </motion.div>
          
//           <motion.h1 
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
//             className="text-6xl md:text-8xl lg:text-[10rem] font-serif tracking-tighter leading-[0.9] text-slate-900"
//           >
//             Advancing<br />
//             <span className="italic text-[#0096a4]">Genesis.</span>
//           </motion.h1>
//         </motion.div>
//       </section>

//       <section className="relative z-30 bg-[#FAFAFA] px-8 md:px-24 py-32 border-t border-slate-200">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
//           <div className="md:w-1/2">
//             <motion.p 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8 }}
//               className="text-3xl md:text-5xl font-serif leading-tight text-slate-800"
//             >
//               Setting the gold standard in <span className="text-[#0096a4] italic">clinical embryology</span> and ART across Andhra Pradesh.
//             </motion.p>
//             <motion.p 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="mt-8 text-lg text-slate-500 font-light max-w-md"
//             >
//               {ASSOCIATION_INFO.actReference}. We are the authoritative voice and regulatory representative for reproductive medicine professionals.
//             </motion.p>
//           </div>
          
//           <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="overflow-hidden rounded-lg relative group shadow-sm">
//               <img 
//                 src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000&auto=format&fit=crop" 
//                 alt="Laboratory Process" 
//                 className="w-full h-80 object-cover scale-105 group-hover:scale-100 transition-all duration-1000"
//               />
//               <div className="absolute inset-0 bg-[#0096a4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
//             </div>
//             <div className="flex flex-col gap-4">
//               <div className="bg-white p-8 h-full flex flex-col justify-center rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:border-[#0096a4]/20 transition-all duration-500">
//                  <ShieldCheck className="w-8 h-8 text-[#0096a4] mb-4" />
//                  <h3 className="text-xl font-serif text-slate-900 mb-2">Statutory Body</h3>
//                  <p className="text-sm text-slate-500 font-light">Legal and professional representation.</p>
//               </div>
//               <div className="bg-white p-8 h-full flex flex-col justify-center rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:border-[#0096a4]/20 transition-all duration-500">
//                  <Microscope className="w-8 h-8 text-[#0096a4] mb-4" />
//                  <h3 className="text-xl font-serif text-slate-900 mb-2">Lab Excellence</h3>
//                  <p className="text-sm text-slate-500 font-light">Maintaining high standards in ART.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section ref={horizontalRef} className="relative h-[300vh] bg-white">
//         <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden border-t border-slate-100">
//           <div className="absolute top-0 left-0 w-full p-8 md:p-24 z-20 pointer-events-none flex justify-between items-start">
//              <h2 className="text-2xl md:text-4xl font-serif text-slate-900">Our<br/><span className="text-[#0096a4] italic">Mandate</span></h2>
//              <span className="text-sm tracking-widest text-slate-400 uppercase">Scroll to explore</span>
//           </div>
          
//           <motion.div 
//             style={{ x: xTransform }}
//             className="flex gap-12 px-8 md:px-[20vw] pt-24"
//           >
//             {AIMS_AND_OBJECTIVES.map((aim, idx) => (
//               <div 
//                 key={aim.id} 
//                 className="w-[85vw] md:w-[35vw] flex-shrink-0 relative group"
//               >
//                 <div className="h-[60vh] md:h-[70vh] relative overflow-hidden rounded-xl bg-[#FAFAFA] border border-slate-200">
//                   <div className="absolute inset-0 bg-gradient-to-br from-white to-[#FAFAFA] z-0" />
                  
//                   <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between z-10">
//                     <span className="text-slate-200 text-6xl font-serif block group-hover:text-[#0096a4]/20 transition-colors duration-500">
//                       {String(idx + 1).padStart(2, '0')}
//                     </span>
//                     <p className="text-3xl md:text-4xl font-serif text-slate-800 leading-tight">
//                       {aim.text}.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       <section className="relative py-32 px-8 md:px-24 bg-[#FAFAFA] border-t border-slate-200">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
          
//           <div className="md:w-1/3 relative">
//             <div className="sticky top-32">
//               <div className="relative overflow-hidden rounded-xl shadow-lg border border-slate-200/50 bg-white">
//                 <img 
//                   src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop" 
//                   alt="President" 
//                   className="w-full h-[500px] object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
//                 />
//                 <div className="absolute bottom-0 left-0 w-full p-8 bg-white/90 backdrop-blur-md border-t border-slate-100">
//                   <p className="text-2xl font-serif text-slate-900">{GOVERNING_BODY[0].name}</p>
//                   <p className="text-[#0096a4] text-sm tracking-widest uppercase mt-2">{GOVERNING_BODY[0].designation}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="md:w-2/3 flex flex-col justify-center">
//             <h2 className="text-5xl md:text-7xl font-serif text-slate-900 mb-12">
//               Executive <br/><span className="text-slate-400 italic">Board</span>
//             </h2>
            
//             <div className="space-y-0">
//               {GOVERNING_BODY.slice(1, 6).map((member) => (
//                 <div key={member.sNo} className="group border-b border-slate-200 py-8 flex items-center justify-between cursor-pointer hover:bg-white transition-colors px-6 -mx-6 rounded-lg">
//                   <div>
//                     <span className="text-[#0096a4] text-xs tracking-widest block mb-2 uppercase font-medium">{member.designation}</span>
//                     <span className="text-2xl md:text-3xl font-serif text-slate-600 group-hover:text-slate-900 transition-colors">{member.name}</span>
//                   </div>
//                   <ArrowUpRight className="w-8 h-8 text-slate-300 group-hover:text-[#0096a4] transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-500" />
//                 </div>
//               ))}
//             </div>
            
//             <button className="mt-16 w-fit flex items-center gap-4 text-sm uppercase tracking-widest text-slate-900 border-b border-[#0096a4] pb-2 hover:gap-8 transition-all font-medium">
//               View Full Directory <ArrowRight className="w-4 h-4 text-[#0096a4]" />
//             </button>
//           </div>

//         </div>
//       </section>
//     </main>
//   );
// }
import { Metadata } from 'next';
import HomeClient from './components/HomePage/Home';
 
export const metadata: Metadata = {
  title: 'Advancing Genesis | Embryologists Association of Andhra Pradesh (EAAP)',
  description: 'The official professional body setting benchmarks in clinical embryology and Assisted Reproductive Technology across Andhra Pradesh.',
  keywords: [
    'EAAP',
    'Embryologists Association',
    'Andhra Pradesh Embryology',
    'Clinical Embryology',
    'ART Benchmarks',
    'Reproductive Medicine'
  ],
  openGraph: {
    title: 'Advancing Genesis | EAAP',
    description: 'Empowering Embryologists - Advancing Science across Andhra Pradesh.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function Home() {
  return <HomeClient />;
}
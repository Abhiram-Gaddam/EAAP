"use client";

import { useState, useEffect, useRef } from 'react';
import { Scale, FileText, UserMinus, ShieldAlert, Lock, ChevronRight, CheckCircle2 } from 'lucide-react';

const SECTIONS = [
  { id: 'mandate', title: 'Registration & Mandate', icon: FileText },
  { id: 'membership', title: 'Membership Rules', icon: Scale },
  { id: 'cancellation', title: 'Cancellation & Forfeiture', icon: UserMinus },
  { id: 'disputes', title: 'Disputes & Liquidation', icon: ShieldAlert },
  { id: 'privacy', title: 'Privacy Policy', icon: Lock },
];

export default function LegalCenter() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          
          const mobileNav = document.getElementById('mobile-legal-nav');
          const activePill = document.getElementById(`pill-${entry.target.id}`);
          if (mobileNav && activePill) {
            mobileNav.scrollTo({
              left: activePill.offsetLeft - 24,
              behavior: 'smooth'
            });
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset adjusted slightly to accommodate the lowered mobile nav
      const offset = window.innerWidth < 1024 ? 160 : 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24 px-6 md:px-16 lg:px-24 relative">
      
      {/* FIXED BACKGROUND LAYER */}
      <div className=" hidden md:fixed   inset-0 pointer-events-none z-[-1] bg-[#FAFAFA]">
        <div className="absolute top-[-10%] right-[-5%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-gradient-to-bl from-slate-200/60 via-[#0096a4]/5 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] bg-gradient-to-tr from-slate-200/60 via-[#1a365d]/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#00000005_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-16 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-[#0096a4] shadow-[0_0_10px_rgba(0,150,164,0.3)]" />
            <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest drop-shadow-sm">
              Official Directory
            </span>
          </div>
          <h1 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl lg:text-7xl text-[#1a365d] tracking-tight leading-[1.1] drop-shadow-sm">
            Legal & <span className="italic text-[#0096a4]">Statutory.</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-0 lg:gap-16 relative items-start z-10">
        
        {/* Mobile Sticky Navigation - Lowered from top-[60px] to top-[80px] to clear navbar */}
        <div className=" hidden   top-[80px] md:top-[90px] z-50 -mx-6 px-6 py-4 w-[100vw]">
          <div className="absolute inset-0 bg-[#FAFAFA]/70 backdrop-blur-3xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" />
          <div 
            id="mobile-legal-nav"
            className="relative flex overflow-x-auto hide-scrollbar gap-3 w-full scroll-smooth snap-x snap-mandatory pb-1"
          >
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={`pill-${section.id}`}
                  id={`pill-${section.id}`}
                  onClick={() => scrollToSection(section.id)}
                  className={`relative flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium shrink-0 snap-center border backdrop-blur-md ${
                    isActive 
                      ? 'bg-[#1a365d] text-white shadow-[0_2px_10px_rgba(26,54,93,0.2),_0_8px_30px_rgba(26,54,93,0.15)] border-[#1a365d]' 
                      : 'bg-white/60 text-slate-500 border-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-white hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0096a4]' : 'text-slate-400'}`} strokeWidth={isActive ? 2 : 1.5} />
                  <span className="relative z-10">{section.title}</span>
                </button>
              );
            })}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#FAFAFA] to-transparent pointer-events-none" />
        </div>

        {/* Desktop Sidebar Navigation (Sticky) */}
        <div className="hidden lg:block lg:w-[320px] shrink-0 lg:sticky lg:top-32 z-40 h-max">
          <nav className="flex flex-col gap-2 p-5 rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.02),_0_16px_60px_rgba(0,0,0,0.05)]">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl w-full text-left group overflow-hidden ${
                    isActive ? 'text-[#1a365d]' : 'text-slate-500 hover:text-[#1a365d]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-white/90 border border-white shadow-[0_2px_10px_rgba(0,0,0,0.02),_0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl z-0" />
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#0096a4] rounded-r-full z-10 shadow-[0_0_12px_rgba(0,150,164,0.5)]" />
                  )}
                  <Icon className={`w-5 h-5 z-10 ${isActive ? 'text-[#0096a4]' : 'text-slate-400 group-hover:text-[#1a365d]'}`} strokeWidth={isActive ? 2 : 1.5} />
                  <span className={`text-base z-10 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {section.title}
                  </span>
                  <ChevronRight className={`w-4 h-4 ml-auto z-10 ${isActive ? 'text-[#0096a4] opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-50'}`} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Scrollable Content Area */}
        <div className="w-full lg:w-[calc(100%-384px)] flex flex-col pb-[20vh] space-y-20 md:space-y-32 pt-8 lg:pt-0 relative z-10">
          
          {/* Section 1: Registration & Mandate */}
          <section id="mandate" className="scroll-mt-32 md:scroll-mt-44 relative">
            <div>
              <div className="mb-10">
                <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-3xl md:text-5xl text-[#1a365d] mb-4 tracking-tight drop-shadow-sm">
                  Registration & Mandate
                </h2>
                <p className="text-slate-500 font-light text-base md:text-lg leading-relaxed max-w-2xl">
                  The Embryologists Association of Andhra Pradesh (EAAP) is a formally recognized entity. Our registered office is located at Door No.3-161/53-509, Nidamanuru, Vijayawada Rural, N.T.R. District.
                </p>
              </div>

              {/* Advanced Deep Card */}
              <div className="group relative bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-1.5 border border-white shadow-[0_2px_15px_rgba(0,0,0,0.02),_0_16px_50px_rgba(0,0,0,0.04)] mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/40 to-slate-50/80 z-0" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-slate-200/50 to-transparent rounded-bl-full z-0" />
                
                <div className="relative z-10 bg-[#1a365d] rounded-[2rem] px-8 py-6 flex items-center gap-4 shadow-[0_4px_20px_rgba(26,54,93,0.3)]">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm shadow-inner">
                    <FileText className="w-5 h-5 text-[#0096a4] drop-shadow-sm" />
                  </div>
                  <h3 className="text-white font-medium text-xl drop-shadow-sm">Aims and Objectives</h3>
                </div>
                
                <div className="relative z-10 p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    "To promote the science and practice of Clinical Embryology.",
                    "To establish and maintain high standards in ART laboratories.",
                    "To conduct CMEs, workshops, conferences, and training programs.",
                    "To encourage research and innovation in reproductive medicine.",
                    "To support professional development and welfare of embryologists.",
                    "To create awareness about ART among the public.",
                    "To collaborate with national and international bodies.",
                    "To represent embryologists in legal, regulatory, and professional matters."
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-transparent hover:bg-white hover:shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-transparent hover:border-white">
                      <div className="shrink-0 mt-0.5 bg-white rounded-full shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-[#0096a4]" strokeWidth={2} />
                      </div>
                      <span className="text-sm md:text-base text-slate-600 font-light leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden p-8 bg-gradient-to-br from-[#FAFAFA] to-white border border-white rounded-[2.5rem] shadow-[0_2px_15px_rgba(0,0,0,0.02),_0_16px_50px_rgba(0,0,0,0.04)]">
                <div className="absolute inset-0 bg-[radial-gradient(#1a365d0a_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-slate-200/50 blur-3xl rounded-full" />
                <h4 className="relative z-10 text-[#1a365d] font-semibold text-lg mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-[#0096a4]" />
                  </div>
                  Statutory Declarations
                </h4>
                <p className="relative z-10 text-slate-600 font-light text-base leading-relaxed mb-0 pl-11">
                  Certified that the society is formed with no profit motive and no commercial activity is involved in its working. Certified that the office bearers are not paid from the funds of the society.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Membership Rules */}
          <section id="membership" className="scroll-mt-32 md:scroll-mt-44">
            <div>
              <div className="mb-10">
                <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-3xl md:text-5xl text-[#1a365d] mb-4 tracking-tight drop-shadow-sm">
                  Membership Rules & Financials
                </h2>
                <p className="text-slate-500 font-light text-base md:text-lg leading-relaxed">
                  Financial obligations and operational rules governing the membership lifecycle within the association.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 3D Elevated Card 1 */}
                <div className="relative bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white shadow-[0_2px_15px_rgba(0,0,0,0.02),_0_16px_50px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-slate-200/50 to-transparent rounded-bl-full" />
                  <div className="relative z-10 flex items-center gap-3 mb-6">
                    <span className="flex w-2 h-2 rounded-full bg-[#0096a4] shadow-[0_0_8px_rgba(0,150,164,0.5)]" />
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#0096a4]">Admission</span>
                  </div>
                  <div className="relative z-10 text-4xl md:text-5xl font-light text-[#1a365d] mb-6 tracking-tight flex items-baseline gap-2 drop-shadow-sm">
                    ₹1,500<span className="text-base text-slate-400 tracking-normal font-medium">/ one-time</span>
                  </div>
                  <p className="relative z-10 text-slate-600 font-light text-sm md:text-base leading-relaxed">
                    Every member shall pay an amount of Rs.1500/- as membership fee at the time of admission.
                  </p>
                </div>
                
                {/* 3D Elevated Card 2 */}
                <div className="relative bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white shadow-[0_2px_15px_rgba(0,0,0,0.02),_0_16px_50px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-slate-200/50 to-transparent rounded-bl-full" />
                  <div className="relative z-10 flex items-center gap-3 mb-6">
                    <span className="flex w-2 h-2 rounded-full bg-[#1a365d] shadow-[0_0_8px_rgba(26,54,93,0.5)]" />
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1a365d]">Subscription</span>
                  </div>
                  <div className="relative z-10 text-4xl md:text-5xl font-light text-[#1a365d] mb-6 tracking-tight flex items-baseline gap-2 drop-shadow-sm">
                    ₹1,500<span className="text-base text-slate-400 tracking-normal font-medium">/ annual</span>
                  </div>
                  <p className="relative z-10 text-slate-600 font-light text-sm md:text-base leading-relaxed">
                    Each member shall pay Rs.1500/- as annual subscription at the beginning of every year.
                  </p>
                </div>

                {/* Wide Glass Card */}
                <div className="md:col-span-2 relative bg-[#1a365d] p-10 rounded-[2.5rem] overflow-hidden shadow-[0_10px_30px_rgba(26,54,93,0.15),_0_30px_60px_rgba(26,54,93,0.2)] border border-[#1a365d]">
                  <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#0096a4]/15 via-transparent to-transparent rounded-full blur-[80px] -translate-y-1/3 translate-x-1/3 opacity-60" />
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
                  <div className="relative z-10 flex flex-col items-start gap-5">
                    <div className="px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-inner flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0096a4]" />
                      <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-white drop-shadow-md">Fee Alterations</span>
                    </div>
                    <p className="text-white/90 font-light text-lg md:text-xl leading-relaxed max-w-3xl m-0 drop-shadow-sm">
                      The Governing Body/Managing committee shall have power to fix membership fee at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Cancellation & Forfeiture */}
          <section id="cancellation" className="scroll-mt-32 md:scroll-mt-44">
            <div>
              <div className="mb-10">
                <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-3xl md:text-5xl text-[#1a365d] mb-4 tracking-tight drop-shadow-sm">
                  Cancellation & Forfeiture
                </h2>
                <p className="text-slate-500 font-light text-base md:text-lg leading-relaxed max-w-2xl">
                  Conditions under which membership status may be revoked, suspended, or voluntarily terminated.
                </p>
              </div>
              
              <div className="flex flex-col gap-8 relative">
                {/* Embedded depth line */}
                <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-gradient-to-b from-transparent via-slate-200 to-transparent z-0 hidden md:block shadow-inner" />

                {[
                  { title: "Voluntary Resignation", text: "Any member of the Society may resign his membership by notifying the Secretary in writing.", glow: "shadow-[0_0_15px_rgba(203,213,225,0.5)]", dot: "bg-slate-400" },
                  { title: "Financial Forfeiture", text: "If it is not paid within three months from the date of commencement of the financial year, such member shall forfeit the membership.", glow: "shadow-[0_0_15px_rgba(251,191,36,0.4)]", dot: "bg-amber-400" },
                  { title: "Attendance Forfeiture", text: "Those who fail to attend three consecutive meetings of the managing committee.", glow: "shadow-[0_0_15px_rgba(251,191,36,0.4)]", dot: "bg-amber-400" },
                  { title: "Expulsion", text: "Those who were expelled by the Managing committee.", glow: "shadow-[0_0_15px_rgba(248,113,113,0.4)]", dot: "bg-red-400" }
                ].map((rule, idx) => (
                  <div key={idx} className="relative flex flex-col md:flex-row items-start gap-8">
                    <div className={`hidden md:flex w-16 h-16 rounded-full bg-white/80 backdrop-blur-xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.05),_0_8px_30px_rgba(0,0,0,0.03)] items-center justify-center shrink-0 z-10 ${rule.glow}`}>
                      <div className={`w-3 h-3 rounded-full ${rule.dot} shadow-inner`} />
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white shadow-[0_2px_15px_rgba(0,0,0,0.02),_0_16px_50px_rgba(0,0,0,0.04)] w-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-100/50 to-transparent rounded-bl-full" />
                      <div className="flex items-center gap-3 mb-4 md:hidden">
                         <div className={`w-2.5 h-2.5 rounded-full ${rule.dot} shadow-sm`} />
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rule {idx + 1}</span>
                      </div>
                      <h4 className="font-semibold text-lg text-[#1a365d] mb-3 relative z-10 drop-shadow-sm">{rule.title}</h4>
                      <p className="text-slate-600 font-light text-base m-0 leading-relaxed relative z-10">{rule.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 relative overflow-hidden p-8 md:p-10 bg-white/80 backdrop-blur-2xl border border-white rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-8 shadow-[0_2px_15px_rgba(0,0,0,0.02),_0_16px_50px_rgba(0,0,0,0.04)]">
                <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-slate-100/50 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#00000004_1px,transparent_1px)] [background-size:12px_12px]" />
                
                <div className="w-20 h-20 rounded-[1.5rem] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.05),_inset_0_2px_10px_rgba(255,255,255,1)] border border-slate-100 flex items-center justify-center shrink-0 relative z-10">
                  <UserMinus className="w-8 h-8 text-[#1a365d]" />
                </div>
                <div className="relative z-10">
                  <h5 className="text-2xl font-semibold text-[#1a365d] mb-3 drop-shadow-sm">Rejoining Policy</h5>
                  <p className="text-slate-600 font-light text-base md:text-lg m-0 leading-relaxed">
                    The Persons whose membership is forfeited, can rejoin as members subject to the approval of the managing committee.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Disputes & Liquidation */}
          <section id="disputes" className="scroll-mt-32 md:scroll-mt-44">
            <div>
              <div className="mb-10">
                <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-3xl md:text-5xl text-[#1a365d] mb-4 tracking-tight drop-shadow-sm">
                  Disputes & Liquidation
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Depth Card 1 */}
                <div className="relative bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white shadow-[0_2px_15px_rgba(0,0,0,0.02),_0_16px_50px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#0096a4]/10 to-transparent rounded-bl-[4rem] opacity-50" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-center mb-8 relative z-10 bg-[#0096a4]/5 border-[#0096a4]/20">
                    <ShieldAlert className="w-7 h-7 text-[#0096a4]" />
                  </div>
                  <h4 className="text-2xl font-semibold text-[#1a365d] mb-5 relative z-10 drop-shadow-sm">Resolution of Disputes</h4>
                  <p className="text-slate-600 font-light text-base leading-relaxed relative z-10">
                    Any member of the society may proceed with the dispute under the provisions as mentioned in the A.P.S.R.Act(Section 23).
                  </p>
                </div>

                {/* Depth Card 2 */}
                <div className="relative bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white shadow-[0_2px_15px_rgba(0,0,0,0.02),_0_16px_50px_rgba(0,0,0,0.04)] overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#1a365d]/10 to-transparent rounded-bl-[4rem] opacity-50" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-center mb-8 relative z-10 bg-[#1a365d]/5 border-[#1a365d]/20">
                    <FileText className="w-7 h-7 text-[#1a365d]" />
                  </div>
                  <h4 className="text-2xl font-semibold text-[#1a365d] mb-5 relative z-10 drop-shadow-sm">Winding Up</h4>
                  <p className="text-slate-600 font-light text-base leading-relaxed mb-4 relative z-10">
                    It shall under Act 35 of the societies Registration act 2001 after obtaining the approval of 3/5 th of the majority of the general body.
                  </p>
                  <p className="text-slate-600 font-light text-base leading-relaxed relative z-10">
                    All the legal affairs of the society movable and immovable properties shall be settled under section 26 of the Societies Registration Act.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Privacy Policy */}
          <section id="privacy" className="scroll-mt-32 md:scroll-mt-44">
            <div>
              <div className="mb-10">
                <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-3xl md:text-5xl text-[#1a365d] mb-4 tracking-tight drop-shadow-sm">
                  Website Privacy Policy
                </h2>
              </div>
              
              <div className="bg-white/80 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border border-white shadow-[0_4px_20px_rgba(0,0,0,0.03),_0_24px_80px_rgba(0,0,0,0.06)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#0096a408_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#0096a4]/5 to-transparent rounded-tl-[100%] pointer-events-none" />
                
                <p className="relative z-10 text-slate-500 font-light leading-relaxed mb-14 text-lg md:text-xl max-w-3xl">
                  The Embryologists Association of Andhra Pradesh is committed to protecting the privacy and security of our members' data through our digital portal.
                </p>
                
                <div className="space-y-6 relative z-10">
                  {[
                    { title: "Data Collection", desc: "We collect personal and professional data strictly for verifying membership eligibility and maintaining the official society register." },
                    { title: "Data Protection", desc: "All uploaded documents and credentials are encrypted. Your data is not sold, rented, or shared with third-party commercial entities." },
                    { title: "Payment Processing", desc: "Membership fees are handled by secure, PCI-DSS compliant third-party payment gateways. EAAP does not store banking information." }
                  ].map((policy, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start gap-6 p-6 rounded-3xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-50">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50/50 shadow-inner border border-slate-100 flex items-center justify-center shrink-0">
                        <Lock className="w-6 h-6 text-[#0096a4]" strokeWidth={1.5} />
                      </div>
                      <div className="pt-2">
                        <h5 className="font-semibold text-xl text-[#1a365d] mb-2">{policy.title}</h5>
                        <p className="text-slate-600 font-light text-base m-0 leading-relaxed">{policy.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </main>
  );
}
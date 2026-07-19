"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, FileText, Clock, CreditCard, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/app/lib/utilities/apis';  
const REGISTRATION_STEPS = [
  {
    id: 1,
    icon: UserPlus,
    title: 'Create an Account',
    description: 'Register on the EAAP portal or log in if you already have an account. This is required to track your application status.'
  },
  {
    id: 2,
    icon: FileText,
    title: 'Submit Application',
    description: 'Fill out your professional details and upload necessary documents (e.g., degree certificates, experience letters).'
  },
  {
    id: 3,
    icon: CreditCard,
    title: 'Fee Payment',
    description: 'Upon Submitting, you will be prompted to pay the Admission Fee and Annual Subscription to activate your membership.'
  },
  {
    id: 4,
    icon: Clock,
    title: 'Committee Review',
    description: 'After Successfull Payment, The Executive Committee will review your application to ensure it meets the statutory eligibility criteria.'
   }
];

export default function MembershipRegistrationProcess() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    verifyAuth();
  }, []);
  return (
    <section id="registration-section" className="bg-white py-24 px-6 md:px-16 lg:px-24 border-b border-slate-100 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-bl from-[#0096a4]/5 to-transparent rounded-full blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
        
        {/* Left Column: The Steps */}
        <div className="lg:w-7/12 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-8 bg-[#0096a4]" />
              <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest">
                Application Journey
              </span>
            </div>
            <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl text-[#1a365d] leading-[1.1]">
              How to <span className="italic text-[#0096a4]">Apply.</span>
            </h2>
            <p className="text-slate-500 font-light text-base md:text-lg mt-6 leading-relaxed max-w-lg">
              A streamlined, transparent process designed to verify credentials and onboard eligible clinical embryologists seamlessly into our professional community.
            </p>
          </motion.div>

          <div className="relative pl-2 md:pl-0">
            {/* Vertical Connecting Line (Hidden on very small mobile, visible on sm and up) */}
            <div className="absolute left-[27px] top-8 bottom-8 w-[2px] bg-slate-100 hidden sm:block" />
            <div className="absolute left-[27px] top-8 h-1/3 w-[2px] bg-gradient-to-b from-[#0096a4] to-transparent hidden sm:block" />

            <div className="flex flex-col gap-10">
              {REGISTRATION_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative flex flex-col sm:flex-row gap-5 md:gap-8 group"
                  >
                    {/* Step Icon */}
                    <div className="relative z-10 shrink-0 self-start">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:bg-[#1a365d] group-hover:border-[#1a365d] transition-all duration-500">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#1a365d] group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                      </div>
                      {/* Number badge */}
                      <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0096a4] text-white text-[10px] sm:text-xs font-bold flex items-center justify-center border-2 border-white shadow-sm">
                        {step.id}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex flex-col pt-1">
                      <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-xl sm:text-2xl text-[#1a365d] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-500 font-light text-sm sm:text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Welcoming Action Card */}
        <div className="lg:w-5/12 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:sticky lg:top-32"
          >
            <div className="relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,150,164,0.08)] transition-shadow duration-500 p-6 md:p-10">
              
              <AnimatePresence mode="wait">
                {!isAuthenticated ? (
                  // STATE: GUEST / NOT LOGGED IN
                  <motion.div 
                    key="guest"
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0096a4]/10 flex items-center justify-center mb-6">
                      <Sparkles className="w-6 h-6 text-[#0096a4]" strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-2xl md:text-3xl text-[#1a365d] mb-3">
                      Begin Your Journey
                    </h3>
                    <p className="text-slate-500 font-light text-sm md:text-base leading-relaxed mb-6">
                      Join Andhra Pradesh's premier network of clinical embryologists. Create your secure portal account to start your application, upload credentials, and access exclusive resources.
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-[#0096a4]" />
                        <span>Takes less than 5 minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-[#0096a4]" />
                        <span>Secure document upload</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-auto">
                      <button 
                        onClick={()=>{router.push('/login')} }
                        className="w-full bg-[#1a365d] text-white px-6 py-3.5 md:py-4 rounded-xl font-medium text-sm md:text-base tracking-wide hover:bg-[#0b1b35] transition-colors duration-300 flex items-center justify-center gap-2 group shadow-sm hover:shadow-lg shadow-[#1a365d]/20"
                      >
                        Create Account / Log In
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  // STATE: LOGGED IN
                  <motion.div 
                    key="authenticated"
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#0096a4]/10 flex items-center justify-center mb-6">
                      <UserPlus className="w-6 h-6 text-[#0096a4]" strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-2xl md:text-3xl text-[#1a365d] mb-3">
                      Welcome Back
                    </h3>
                    <p className="text-slate-500 font-light text-sm md:text-base leading-relaxed mb-8">
                      Your identity is verified. You are now ready to proceed with the official EAAP membership application. Have your credentials and documents ready.
                    </p>

                    <div className="flex flex-col gap-4 mt-auto">
                      <button 
                      onClick={()=>{router.push('/user/membership')} }
                        className="w-full bg-[#0096a4] text-white px-6 py-3.5 md:py-4 rounded-xl font-medium text-sm md:text-base tracking-wide hover:bg-[#007a86] transition-colors duration-300 flex items-center justify-center gap-2 group shadow-sm hover:shadow-lg shadow-[#0096a4]/20"
                      >
                        Become a Member
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                      
                      {/* <button 
                        onClick={() => setIsAuthenticated(false)}
                        className="text-slate-400 hover:text-[#1a365d] text-sm font-medium transition-colors duration-300 mt-2"
                      >
                        Sign Out
                      </button> */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
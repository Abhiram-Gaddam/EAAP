// app/login/page.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/app/lib/utilities/apis';

export default function LoginPage() {
  const router = useRouter();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Ensure your loginUser utility returns the JSON response from your API
      const res = await loginUser({ email, password });
      
      // Redirect based on the role returned from the database
      if (res.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white font-sans selection:bg-[#0096a4]/20">
      
      {/* Left Panel: Immersive Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#FAFAFA] border-r border-slate-100 flex-col justify-between p-12 lg:p-16 relative overflow-hidden">
        
        {/* Dynamic Watermark & Gradients */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-white to-[#0096a4]/5 z-10" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            className="w-[800px] h-[800px] opacity-[0.03] mix-blend-multiply"
          >
            <Image src="/images/small-logo.png" alt="EAAP Watermark" fill className="object-contain" />
          </motion.div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#1a365d]/5 rounded-full blur-[120px] z-0" />
        </div>

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link href="/">
            <Image src="/images/Logo-NoBg.png" alt="EAAP Logo" width={200} height={70} className="h-14 w-auto object-contain" priority />
          </Link>
        </div>

        {/* Middle: Engaging Copy & Floating Card */}
        <div className="relative z-10 w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
              <span className="flex w-2 h-2 rounded-full bg-[#0096a4] animate-pulse" />
              <span className="text-[#1a365d] text-xs font-bold uppercase tracking-widest">Member Portal</span>
            </div>
            
            <h1 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-5xl xl:text-6xl text-[#1a365d] leading-[1.1] mb-6 tracking-tight">
              Welcome back <br/>
              <span className="italic text-[#0096a4] font-light">to the Community.</span>
            </h1>
            <p className="text-slate-500 font-light text-lg leading-relaxed mb-12">
              Access your professional dashboard, renew your membership, and stay updated with the latest in clinical embryology.
            </p>

            {/* Floating Trust Card */}
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0096a4]/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#0096a4]" />
              </div>
              <div>
                <h4 className="text-[#1a365d] font-semibold mb-1">Secure & Verified</h4>
                <p className="text-slate-500 text-sm font-light leading-relaxed">
                  Your professional data is encrypted and strictly managed under EAAP statutory guidelines.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10 text-sm text-slate-400 font-light flex items-center gap-2">
          <span>© {new Date().getFullYear()} EAAP. All rights reserved.</span>
        </div>
      </div>

      {/* Right Panel: Clean Interactive Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative">
        <div className="w-full max-w-md">
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Mobile Header Logo */}
            <div className="mb-12 lg:hidden flex justify-center">
              <Link href="/">
                <Image src="/images/Logo-NoBg.png" alt="EAAP Logo" width={160} height={60} className="h-12 w-auto object-contain" priority />
              </Link>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-semibold text-[#1a365d] mb-2 tracking-tight">Sign In</h2>
              <p className="text-slate-500 font-light">Enter your credentials to access your account.</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              
              {/* Error Message Display */}
              {error && (
                <div className="bg-red-50 text-red-500 border border-red-100 p-4 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5 group">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 group">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">
                    Password
                  </label>
                  <button 
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs font-medium text-[#0096a4] hover:text-[#1a365d] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a365d] hover:bg-[#0096a4] text-white rounded-xl py-4 font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(26,54,93,0.15)] hover:shadow-[0_4px_20px_rgba(0,150,164,0.25)] flex items-center justify-center gap-2 mt-8 group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In to Portal'}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-slate-500 font-light text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="font-medium text-[#1a365d] hover:text-[#0096a4] transition-colors underline underline-offset-4 decoration-slate-200 hover:decoration-[#0096a4]">
                  Apply for Membership
                </Link>
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1a365d]/40 backdrop-blur-sm"
              onClick={() => setIsForgotPasswordOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden"
            >
              <button 
                onClick={() => setIsForgotPasswordOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-[#1a365d] hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-[#0096a4]/10 flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-[#0096a4]" />
              </div>

              <h3 className="text-2xl font-semibold text-[#1a365d] mb-2">Reset Password</h3>
              <p className="text-slate-500 font-light text-sm mb-8 leading-relaxed">
                Enter your registered email address and we'll send you instructions to reset your password.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); setIsForgotPasswordOpen(false); }}>
                <div className="space-y-1.5 group mb-8">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                    <input 
                      type="email" 
                      required
                      className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="flex-1 bg-white border border-slate-200 text-slate-600 rounded-xl py-3.5 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-[#1a365d] hover:bg-[#0096a4] text-white rounded-xl py-3.5 font-medium transition-colors shadow-lg shadow-[#1a365d]/10 hover:shadow-[#0096a4]/20"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
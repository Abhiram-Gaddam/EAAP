// app/contact/page.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { submitInquiry } from '@/app/lib/utilities/userApis';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsSubmitting(true);
      await submitInquiry(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        <div className="flex flex-col justify-center space-y-10">
          <div>
            <span className="px-3 py-1.5 rounded-lg bg-[#0096a4]/10 text-[#0096a4] text-xs font-medium uppercase tracking-widest mb-4 inline-block">
              Contact Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-medium text-[#1a365d] leading-tight tracking-tight mb-4">
              How can we help you today?
            </h1>
            <p className="text-base font-normal text-slate-500 max-w-md leading-relaxed">
              Whether you have a question about an upcoming event, membership details, or publication guidelines, our team is ready to answer your questions.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#0096a4] shadow-sm shrink-0">
                <Mail className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1">Email</p>
                <a href="mailto:support@eaap.in" className="text-base font-medium text-slate-800 hover:text-[#0096a4] transition-colors">support@eaap.in</a>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#0096a4] shadow-sm shrink-0">
                <Phone className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                <a href="tel:+919876543210" className="text-base font-medium text-slate-800 hover:text-[#0096a4] transition-colors">+91 98765 43210</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#0096a4] shadow-sm shrink-0">
                <MapPin className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-1">Office</p>
                <p className="text-base font-medium text-slate-800">123 Innovation Drive<br/>Tech Park, AP 522001</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <AnimatePresence>
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6">
                  <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="text-2xl font-medium text-slate-800 mb-2">Message Sent</h3>
                <p className="text-sm font-normal text-slate-500">Thank you for reaching out. We have received your inquiry and will get back to you shortly.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Your Name</label>
                <input 
                  type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Subject</label>
              <input 
                type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Message</label>
              <textarea 
                required rows={5} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all resize-none"
                placeholder="Type your message here..."
              />
            </div>

            <button 
              type="submit" disabled={isSubmitting}
              className="w-full py-4 bg-[#1a365d] hover:bg-[#12284b] text-white rounded-xl text-base font-medium transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin stroke-[1.5]" />
              ) : (
                <Send className="w-4 h-4 stroke-[1.5] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              )}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
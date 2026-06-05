"use client";

import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Send, Clock } from 'lucide-react';

// Contact US
export default function ContactUs() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-32 pb-24 px-4 md:px-16 lg:px-24 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#0096a4]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#1a365d]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-24"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-[#0096a4]" />
            <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest">
              Get In Touch
            </span>
            <div className="h-[1px] w-8 bg-[#0096a4]" />
          </div>
          <h1 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-5xl md:text-6xl text-[#1a365d] leading-[1.1] mb-6">
            Contact <span className="italic text-[#0096a4]">EAAP.</span>
          </h1>
          <p className="text-slate-500 font-light text-lg leading-relaxed">
            Reach out to the Embryologists Association of Andhra Pradesh for membership inquiries, regulatory guidance, or general support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-3xl text-[#1a365d] mb-8">
                Official Information
              </h3>

              <div className="flex flex-col gap-8">
                {/* Address (From PDF) */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-[#1a365d] group-hover:border-[#1a365d] transition-all duration-300">
                    <MapPin className="w-5 h-5 text-[#1a365d] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[#1a365d] font-medium mb-2">Registered Office</h4>
                    <p className="text-slate-500 font-light text-base leading-relaxed">
                      Door No.3-161/53-509, Nidamanuru<br />
                      Vijayawada Rural, N.T.R. District<br />
                      Andhra Pradesh, India
                    </p>
                  </div>
                </div>

                {/* Email Placeholder */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-[#0096a4] group-hover:border-[#0096a4] transition-all duration-300">
                    <Mail className="w-5 h-5 text-[#0096a4] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[#1a365d] font-medium mb-2">Email Address</h4>
                    <p className="text-slate-500 font-light text-base leading-relaxed">
                      info@eaap.in
                    </p>
                  </div>
                </div>

                {/* Phone Placeholder */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-[#1a365d] group-hover:border-[#1a365d] transition-all duration-300">
                    <Phone className="w-5 h-5 text-[#1a365d] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[#1a365d] font-medium mb-2">Phone Number</h4>
                    <p className="text-slate-500 font-light text-base leading-relaxed">
                      +91 98765 43210
                    </p>
                  </div>
                </div>
                
                {/* Working Hours */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-[#0096a4] group-hover:border-[#0096a4] transition-all duration-300">
                    <Clock className="w-5 h-5 text-[#0096a4] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-[#1a365d] font-medium mb-2">Working Hours</h4>
                    <p className="text-slate-500 font-light text-base leading-relaxed">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Closed on Public Holidays
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-2xl text-[#1a365d] mb-8">
                Send us a Message
              </h3>

              <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="firstName" className="text-xs uppercase tracking-wider font-semibold text-slate-500">First Name</label>
                    <input 
                      type="text" 
                      id="firstName"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-4 rounded-xl focus:outline-none focus:border-[#0096a4] focus:ring-1 focus:ring-[#0096a4] transition-all duration-300 text-slate-700"
                      placeholder="John"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="lastName" className="text-xs uppercase tracking-wider font-semibold text-slate-500">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName"
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-4 rounded-xl focus:outline-none focus:border-[#0096a4] focus:ring-1 focus:ring-[#0096a4] transition-all duration-300 text-slate-700"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-slate-500">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-4 rounded-xl focus:outline-none focus:border-[#0096a4] focus:ring-1 focus:ring-[#0096a4] transition-all duration-300 text-slate-700"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-xs uppercase tracking-wider font-semibold text-slate-500">Subject</label>
                  <input 
                    type="text" 
                    id="subject"
                    className="w-full bg-slate-50 border border-slate-200 px-4  py-4 rounded-xl focus:outline-none focus:border-[#0096a4] focus:ring-1 focus:ring-[#0096a4] transition-all duration-300 text-slate-700"
                    placeholder="Membership Inquiry"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs uppercase tracking-wider font-semibold text-slate-500">Message</label>
                  <textarea 
                    id="message"
                    rows={5}
                    className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-xl focus:outline-none focus:border-[#0096a4] focus:ring-1 focus:ring-[#0096a4] transition-all duration-300 text-slate-700 resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#1a365d] text-white px-6 py-4 rounded-xl font-medium tracking-wide hover:bg-[#0b1b35] transition-colors duration-300 flex items-center justify-center gap-3 group mt-2"
                >
                  Send Message
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </form>

            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}
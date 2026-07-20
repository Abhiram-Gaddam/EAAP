'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'About', href: '/about' },
  { name: 'Team', href: '/team' },
  { 
    name: 'Membership', 
    href: '/membership',
    hasDropdown: true 
  },
  { name: 'Events & CMEs', href: '/events' },
  { name: 'Publications', href: '/publications' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50">
        <nav className="bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-full px-4 py-3 md:py-2 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
             <Image 
               src="/images/Logo-NoBg.png" 
               alt="EAAP LOGO" 
               width={160} 
               height={48} 
               className="h-10 md:h-12 w-auto object-contain"
               priority
             />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <div key={link.name} className="relative group">
                <Link 
                  href={link.href}
                  className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-[#0096a4] transition-colors py-2"
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#0096a4] transition-colors" />}
                </Link>
              </div>
            ))}
          </div>

          {/* CTA Button & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link 
              href="/register" 
              className="hidden md:flex items-center gap-2 bg-[#0096a4] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a365d] hover:shadow-md hover:shadow-[#0096a4]/20 transition-all duration-300"
            >
              Join EAAP
            </Link>

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-[#0096a4] transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-24 z-40 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-slate-800 hover:text-[#0096a4] border-b border-slate-50 pb-3"
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                href="/register"
                onClick={() => setIsOpen(false)} 
                className="mt-4 text-center bg-[#1a365d] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0096a4] transition-colors"
              >
                Join EAAP
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


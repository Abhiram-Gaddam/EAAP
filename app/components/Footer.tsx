 "use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ASSOCIATION_INFO } from "@/app/constants/data";

const QUICK_LINKS = [
    { name: "About the Society", href: "/about" },
    { name: "Membership Details", href: "/membership" },
    { name: "CMEs & Workshops", href: "/events" },
    { name: "Publications & Research", href: "/publications" },
    { name: "Contact Secretariat", href: "/contact" },
];

const LEGAL_LINKS = [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cancellation Policy", href: "/membership#cancellation" },
    { name: "Eligibility Guidelines", href: "/membership#eligibility" },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 pt-10 md:pt-18 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
                
                {/* Top Section: Branding & Contact */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-slate-200 pb-12 mb-12 gap-10">
                    <div className="flex flex-col items-start">
                        <Link href="/" className="mb-8 block">
                            <Image 
                                src="/images/Logo.png" 
                                alt="EAAP Logo" 
                                width={200}
                                height={60}
                                className="h-10 md:h-14 w-auto object-contain"
                            />
                        </Link>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-[#1a365d] leading-tight">
                            Empowering <br className="hidden md:block" />
                            <span className="italic text-[#0096a4]">Embryologists.</span>
                        </h2>
                    </div>
                    
                    <div className="flex flex-col items-start lg:items-end">
                        <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest mb-3">
                            Reach the Secretariat
                        </span>
                        <a 
                            href="mailto:info@eaap.org.in" 
                            className="text-2xl md:text-3xl lg:text-4xl font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-slate-800 hover:text-[#0096a4] transition-colors border-b-2 border-transparent hover:border-[#0096a4] pb-1 group flex items-center gap-3"
                        >
                            info@eaap.org.in
                            <ArrowUpRight className="w-5 h-5 md:w-8 md:h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>
                </div>

                {/* Middle Section: Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
                    
                    {/* Headquarters */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-[#1a365d] font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-xl font-medium">
                            Headquarters
                        </h4>
                        <address className="not-italic text-slate-500 font-light text-sm leading-relaxed">
                            {ASSOCIATION_INFO.registeredAddress}
                        </address>
                        <div className="mt-2">
                            <span className="block text-[#0096a4] text-[10px] font-bold uppercase tracking-widest mb-1">
                                Registered Under
                            </span>
                            <span className="text-xs text-slate-500 font-medium leading-snug block pr-4">
                                {ASSOCIATION_INFO.actReference}
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-[#1a365d] font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-xl font-medium">
                            Navigation
                        </h4>
                        <ul className="space-y-3">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-500 hover:text-[#0096a4] transition-colors text-sm font-medium inline-flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#0096a4] transition-colors" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col gap-5">
                        <h4 className="text-[#1a365d] font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-xl font-medium">
                            Legal & Guidelines
                        </h4>
                        <ul className="space-y-3">
                            {LEGAL_LINKS.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-slate-500 hover:text-[#0096a4] transition-colors text-sm font-medium inline-flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#0096a4] transition-colors" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA Container */}
                    <div className="flex flex-col gap-5 bg-slate-50 p-6 rounded-2xl border border-slate-100 h-fit">
                        <h4 className="text-[#1a365d] font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-xl font-medium">
                            Join EAAP
                        </h4>
                        <p className="text-slate-500 font-light text-sm leading-relaxed">
                            Become a part of Andhra Pradesh's premier clinical embryology network.
                        </p>
                        <Link 
                            href="/membership" 
                            className="mt-2 w-fit flex items-center justify-center gap-2 text-sm font-medium text-white bg-[#1a365d] px-6 py-2.5 rounded-full hover:bg-[#0096a4] hover:shadow-lg hover:shadow-[#0096a4]/20 transition-all duration-300"
                        >
                            Apply Now <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100">
                    <p className="text-slate-400 text-xs font-medium text-center md:text-left">
                        &copy; {new Date().getFullYear()} {ASSOCIATION_INFO.name}. All rights reserved.
                    </p>
                    <p className="text-slate-400 text-xs font-medium text-center md:text-right">
                        Designed for Clinical Excellence.
                    </p>
                </div>
                
            </div>
        </footer>
    );
}
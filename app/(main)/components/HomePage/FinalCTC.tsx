 "use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function FinalCTASection() {
    const containerRef = useRef(null);

    return (
        <section ref={containerRef} className="relative w-full h-[110vh] md:h-[130vh]">

            {/* Background Image - Absolute and covering the full scrollable height */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2500&auto=format&fit=crop"
                    alt="Medical Research"
                    fill
                    className="object-cover brightness-[0.35] scale-105"
                />
                {/* Subtle Teal/Navy Tint Overlay to match brand */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a365d]/90 via-[#1a365d]/50 to-[#0096a4]/20 mix-blend-multiply" />
            </div>

            {/* Sticky Container for the Card */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center z-10 px-2 md:px-8">

                {/* Elevated Popup Card - Resized and styled with light aqua-white background */}
                <div className="bg-gradient-to-b from-[#ffffff] via-[#effafb] to-[#e6fdff] px-4 md:px-10 py-6 md:py-10  max-w-75   md:max-w-2xl w-full text-center shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] rounded-xl  border border-[#0096a4]/20 flex flex-col items-center backdrop-blur-sm">
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-4 md:mb-6">
                       <Image 
                           src={'/images/small-logo.png'} 
                           alt="LOGO"
                           width={100}
                           height={100} 
                           className="object-contain drop-shadow-sm"
                       />
                    </div>

                    {/* Title */}
                    <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-2xl md:text-5xl text-[#1a365d] leading-tight mb-5">
                        Ready to advance your <span className="italic text-[#0096a4]">practice?</span>
                    </h2>

                    {/* Description */}
                    <p className="font-light text-slate-600 text-xs md:text-base mb-8 max-w-lg mx-auto leading-relaxed">
                        Join the elite network of clinical embryologists in Andhra Pradesh. Gain access to exclusive CMEs, regulatory support, and a community dedicated to excellence in ART.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row w-3/5 md:w-full justify-center">
                        <a 
                            href="/membership" 
                            className="group flex items-center justify-center gap-3 bg-[#1a365d] text-white  md:px-8 py-3.5 rounded-full text-xs font-semibold tracking-wide hover:bg-[#0096a4] transition-all duration-300 shadow-lg shadow-[#1a365d]/20"
                        >
                            Start Application
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                         
                    </div>

                </div>
            </div>

        </section>
    );
}
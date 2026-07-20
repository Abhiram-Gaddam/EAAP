 
"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { GOVERNING_BODY } from "@/app/constants/data";
 
const CARD_GAP = 40;

function VisionaryCard({ 
    member, 
    cardWidth 
}: { 
    member: typeof GOVERNING_BODY[0],
    cardWidth: number 
}) {
    return (
        <div 
            style={{ width: cardWidth }} 
            className="flex flex-col gap-6 relative group flex-shrink-0 h-full justify-center"
        >
            <div className="relative w-full aspect-[3/4] shrink-0 overflow-hidden rounded-[2rem] bg-slate-200 shadow-lg border border-slate-200/50">
                <Image
                    src={`${member.image}`}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105 "
                    sizes="(max-width: 768px) 80vw, 380px"
                    priority={member.sNo <= 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a365d]/40 via-transparent to-transparent opacity-60 group-hover:opacity-10 transition-opacity duration-500" />
            </div>
            
            <div className="flex flex-col gap-2 px-2">
                <span className="text-[#0096a4] text-xs md:text-sm font-bold uppercase tracking-widest">
                    {member.designation}
                </span>
                <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-2xl md:text-3xl text-[#1a365d] whitespace-normal leading-tight">
                    {member.name}
                </h3>
            </div>
        </div>
    );
}

export default function GoverningBodySection() {
    const targetRef = useRef(null);
    const cardCount = GOVERNING_BODY.length;

    const [vw, setVw] = useState(0);
    
    useEffect(() => {
        setVw(window.innerWidth);
        const update = () => setVw(window.innerWidth);
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    const introW = vw > 0 ? Math.min(vw * 0.85, 600) : 600;
    const cardW = vw > 0 ? Math.min(vw * 0.75, 360) : 360; 
    const paddingX = vw * 0.1; 
    
    const elementsW = introW + CARD_GAP + (cardW * cardCount) + (CARD_GAP * (cardCount - 1));
    const totalTrackW = elementsW + (paddingX * 2);
    const travel = vw > 0 ? Math.min(0, -(totalTrackW - vw)) : 0; 

    const xTransform = useTransform(scrollYProgress, [0, 1], [0, travel]);
    const smoothX = useSpring(xTransform, { stiffness: 60, damping: 25, mass: 0.8 });

    return (
        <section ref={targetRef} className="relative h-[400vh] bg-[#FAFAFA] text-[#1a365d]">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center border-b border-slate-200">

                <div className="flex-1 flex items-center min-h-0 w-full h-full">
                    <motion.div
                        style={{
                            x: smoothX,
                            display: "flex",
                            gap: CARD_GAP,
                            paddingLeft: paddingX,
                            paddingRight: paddingX,
                            alignItems: "center",
                            height: "100%",
                            willChange: "transform",
                        }}
                    >
                        <div 
                            style={{ width: introW }}
                            className="flex-shrink-0 flex flex-col justify-center pr-8 md:pr-16"
                        >
                            <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest mb-4 block">
                                The Executive Committee
                            </span>
                            <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-5xl md:text-6xl lg:text-[5rem] leading-[1.1] mb-8 text-[#1a365d]">
                                Meet the <br />
                                <span className="italic text-[#0096a4]">Visionaries.</span>
                            </h2>
                            <div className="flex items-center gap-4 text-slate-400">
                                <span className="text-xs uppercase tracking-widest font-semibold">Scroll to view</span>
                                <div className="w-16 h-[1px] bg-slate-300" />
                            </div>
                        </div>

                        {GOVERNING_BODY.map((member) => (
                            <VisionaryCard 
                                key={member.sNo} 
                                member={member} 
                                cardWidth={cardW} 
                            />
                        ))}
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
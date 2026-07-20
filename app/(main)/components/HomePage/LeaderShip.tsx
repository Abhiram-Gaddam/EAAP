 "use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { GOVERNING_BODY } from "@/app/constants/data";

const memberImages = [
    "0.webp",
    "1.jpeg",
    "2.jpeg",
    "3.jpeg",
    "4.webp",
    "5.webp",
    "6.webp",
    "7.webp",
    "8.webp",
];
  
// Generate placeholder images and messages for the members
const membersWithAssets = GOVERNING_BODY.map((member, index) => ({
    ...member,
    // Using colored medical/professional placeholder images
    image: `${member.image}`,

    message: index === 0 
        ? "As the President of EAAP, my primary vision is to elevate the clinical standards across Andhra Pradesh. We are at a critical juncture in reproductive medicine, and fostering continuous innovation in ART is no longer optional—it is imperative for the future of patient care. \n\nOur commitment extends beyond the laboratory; it is about building a cohesive community of professionals who are equipped with the latest scientific knowledge and ethical frameworks to lead this field globally."
        : index === 2 
        ? "My role focuses on ensuring transparent operations and rigorous academic pursuits. Seamless communication across all our members is the bedrock of a strong professional society. \n\nWe are actively working on expanding our CME programs and creating robust platforms for knowledge exchange, ensuring every member has a voice and access to the resources they need to thrive."
        : "Committed to maintaining the highest ethical, legal, and scientific standards in the field of clinical embryology. We believe that professional integrity is the cornerstone of trust between practitioners and patients.",
}));

const MemberItem = ({
    item,
    setActiveId,
}: {
    item: typeof membersWithAssets[0];
    setActiveId: (id: number) => void;
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        margin: "-50% 0px -50% 0px",
    });

    useEffect(() => {
        if (isInView) {
            setActiveId(item.sNo);
        }
    }, [isInView, item.sNo, setActiveId]);

    return (
        // Added min-h-screen to ensure only one item is typically in view at a time
        <div ref={ref} className="min-h-screen py-20 flex flex-col justify-center border-b border-white/20 md:border-slate-200">
            <motion.div
                animate={{
                    opacity: isInView ? 1 : 0.2,
                    y: isInView ? 0 : 20,
                }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex overflow-hidden flex-col"
            >
                <span className="text-[#0096a4] text-sm font-bold uppercase tracking-widest mb-4 drop-shadow-md md:drop-shadow-none">
                    {item.designation}
                </span>
                <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-5xl md:text-6xl text-white md:text-[#1a365d] mb-8 drop-shadow-lg md:drop-shadow-none">
                    {item.name}
                </h3>
                
                <div className="space-y-6">
                    {item.message.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-white/90 md:text-slate-600 font-light text-lg md:text-xl leading-relaxed max-w-xl drop-shadow-md md:drop-shadow-none italic">
                            "{paragraph}"
                        </p>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default function LeadershipSection() {
    const [activeId, setActiveId] = useState(membersWithAssets[0].sNo);

    return (
        <section className="bg-white relative border-b border-slate-200">
            
            {/* --- MOBILE ONLY: Background Crossfade --- */}
             <div className="absolute inset-0 z-0 md:hidden h-full pointer-events-none">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {membersWithAssets.map((member) => (
                        <motion.div
                            key={member.sNo}
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: activeId === member.sNo ? 1 : 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="absolute inset-0 bg-[#1a365d]/85 z-10 mix-blend-multiply" />
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                 className="object-cover" 
                                priority={member.sNo === 1}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="relative z-10 py-20 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 relative text-left">
                    <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest mb-2 block">
                        Governing Body
                    </span>
                    <h2 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-6xl tracking-tight text-white md:text-[#1a365d]">
                        Leadership <span className="italic text-[#0096a4]">Directory.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-start">
                    
                    {/* Left – Sticky Image (DESKTOP ONLY) */}
                    <div className="sticky top-32 self-start hidden md:block order-1 h-[80vh]">
                        <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-xl border border-slate-200/50 bg-[#FAFAFA]">
                            {membersWithAssets.map((member) => (
                                <motion.div
                                    key={member.sNo}
                                    className="absolute inset-0 overflow-hidden"
                                    animate={{
                                        opacity: activeId === member.sNo ? 1 : 0,
                                        scale: activeId === member.sNo ? 1 : 1.05,
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: "easeInOut",
                                    }}
                                >
                                    <div className="relative h-full w-full overflow-hidden">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover" 
                                            priority={member.sNo === 1}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a365d]/90 via-[#1a365d]/20 to-transparent" />
                                        
                                        {/* Overlay Details on Desktop Image */}
                                        <div className="absolute bottom-0 left-0 w-full p-6 text-white z-20">
                                            <p className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl mb-2">
                                                {member.name}
                                            </p>
                                            <p className="text-[#0096a4] font-semibold tracking-widest uppercase text-sm">
                                                {member.designation}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        {/* Decorative background element behind image */}
                        <div className="absolute top-1/2 -left-12 -translate-y-1/2 w-64 h-64 bg-[#0096a4]/10 rounded-full blur-[60px] -z-10" />
                    </div>

                    {/* Right – List (Names & Messages) */}
                    <div className="flex flex-col relative order-2">
                        {membersWithAssets.map((member) => (
                            <MemberItem
                                key={member.sNo}
                                item={member}
                                setActiveId={setActiveId}
                            />
                        ))}

                        {/* Footer Text & CTA */}
                        <div className="py-32 max-w-md hidden md:block">
                            <p className="font-light text-slate-500 text-lg leading-relaxed mb-8">
                                The EAAP Executive Committee represents the pinnacle of clinical embryology expertise in Andhra Pradesh, dedicated to setting rigorous standards and empowering the next generation of practitioners.
                            </p>
                            <a 
                                href="/about" 
                                className="inline-flex items-center gap-3 text-sm uppercase tracking-widest text-[#1a365d] border-b-2 border-[#0096a4] pb-2 hover:gap-8 transition-all font-bold"
                            >
                                View Full Organization <ArrowRight className="w-5 h-5 text-[#0096a4]" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
} 
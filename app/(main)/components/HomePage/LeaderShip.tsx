 "use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { GOVERNING_BODY } from "@/app/constants/data";

const memberMessages: Record<number, string> = {
    1: "EAAP is dedicated to bringing together embryologists across Andhra Pradesh, fostering professional growth, scientific excellence, and ethical practices in the field of clinical embryology. Through education, collaboration, and continuous learning, we aim to strengthen our fraternity and contribute to advancements in assisted reproductive technology.\n\nI invite all members to actively participate in EAAP initiatives and join hands in shaping a progressive future for embryology.",
    2: "EAAP serves as a platform to unite embryologists, encourage scientific excellence, and promote continuous learning and professional development. We are committed to strengthening our community through collaboration, education, and ethical practices in clinical embryology.\n\nI look forward to the active participation and support of all members as we work together towards the growth and advancement of our profession.",
    3: "It is a privilege to serve as the Secretary of the Embryologists Association of Andhra Pradesh (EAAP) and to welcome you to our official website.\n\nEAAP is committed to providing a strong platform for embryologists to connect, learn, and grow through academic activities, professional collaboration, and scientific advancement. Our association strives to promote excellence, encourage innovation, and support the continuous development of embryology professionals.\n\nWith the active involvement of all members, we can build a stronger fraternity and contribute to the progress of reproductive medicine.",
    4: "I am delighted to be a part of the Embryologists Association of Andhra Pradesh (EAAP) and contribute towards its vision of advancing the field of clinical embryology.\n\nEAAP provides a valuable platform for communication, cooperation, and professional growth among embryologists. Through collective efforts, academic initiatives, and sharing of knowledge and experience, we aim to strengthen our profession and encourage excellence in reproductive science.\n\nI look forward to working together with all members in achieving the goals and aspirations of EAAP.",
    5: "It is an honor to serve as the Treasurer of the Embryologists Association of Andhra Pradesh (EAAP).\n\nI am committed to ensuring responsible and transparent support for the association’s activities while working towards the growth, unity, and professional advancement of embryologists. Together, we can strengthen EAAP and contribute to the progress of clinical embryology.",
    6: "It is a privilege to be associated with the Embryologists Association of Andhra Pradesh (EAAP) and contribute to its vision and growth.\n\nAs Joint Treasurer, I am committed to supporting the association’s initiatives with dedication, responsibility, and transparency. Together, with the active involvement of all members, we can strengthen our professional community and promote excellence in clinical embryology."
};

  
// Generate placeholder images and messages for the members
const membersWithAssets = GOVERNING_BODY.map((member, index) => ({
    ...member,
    // Using colored medical/professional placeholder images
    image: `${member.image}`,

    message: memberMessages[member.sNo] || "Committed to maintaining the highest ethical, legal, and scientific standards in the field of clinical embryology.",
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
                                sizes="(max-width: 768px) 100vw, 50vw"
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
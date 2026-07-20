// "use client";

// import { useRef, useState, useEffect } from "react";
// import Image from "next/image";
// import { ArrowLeft, ArrowRight } from "lucide-react";

// export interface NewsItem {
//     id: number;
//     date: string;
//     category: string;
//     title: string;
//     excerpt: string;
//     src: string;
// }

// const DEFAULT_NEWS: NewsItem[] = [
//   {
//     id: 1,
//     date: "August 15, 2026",
//     category: "CME Event",
//     title: "Annual Conference on Advanced ART Protocols",
//     excerpt: "Join us for a two-day comprehensive workshop focusing on the latest advancements in clinical embryology and lab management.",
//     src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
//   },
//   {
//     id: 2,
//     date: "July 22, 2026",
//     category: "Regulatory",
//     title: "Updated Guidelines for State ART Clinics",
//     excerpt: "The EAAP has released the revised compliance and ethics guidelines for all registered fertility clinics in Andhra Pradesh.",
//     // src: "https://images.unsplash.com/photo-1582719478250-c89af14fb4ba?q=80&w=800&auto=format&fit=crop"
//     src: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=800&auto=format&fit=crop"
//   },
//   {
//     id: 3,
//     date: "June 10, 2026",
//     category: "Scholarship",
//     title: "Merit Scholarship Applications Now Open",
//     excerpt: "Applications for the 2026 EAAP academic scholarships for underprivileged clinical embryology students are now live.",
//     src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
//   },
//   {
//     id: 4,
//     date: "May 05, 2026",
//     category: "Research",
//     title: "Breakthroughs in Cryopreservation Tech",
//     excerpt: "A look into the recent publications supported by the EAAP research grant program regarding vitrification.",
//     src: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop"
//   }
// ];

// export default function LatestAnnouncements({ news = DEFAULT_NEWS }: { news?: NewsItem[] }) {
//     const scrollContainerRef = useRef<HTMLDivElement>(null);
//     const [canScrollLeft, setCanScrollLeft] = useState(false);
//     const [canScrollRight, setCanScrollRight] = useState(true);

//     const checkScroll = () => {
//         if (scrollContainerRef.current) {
//             const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//             setCanScrollLeft(scrollLeft > 10);
//             setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
//         }
//     };

//     useEffect(() => {
//         const container = scrollContainerRef.current;
//         if (container) {
//             container.addEventListener("scroll", checkScroll);
//             checkScroll(); 
//             return () => container.removeEventListener("scroll", checkScroll);
//         }
//     }, []);

//     const scroll = (direction: 'left' | 'right') => {
//         if (scrollContainerRef.current) {
//             const container = scrollContainerRef.current;
//             const scrollAmount = container.clientWidth * 0.8; 
//             const targetScroll = direction === 'left'
//                 ? container.scrollLeft - scrollAmount
//                 : container.scrollLeft + scrollAmount;

//             container.scrollTo({ left: targetScroll, behavior: 'smooth' });
//         }
//     };

//     return (
//         <section className="bg-white py-16 overflow-hidden flex flex-col justify-center border-b border-slate-100">
//             <div className="max-w-[1600px] w-full mx-auto relative px-8 md:px-16 lg:px-24">
                
//                 <div className="flex justify-between items-end mb-12">
//                     <div>
//                         <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest mb-2 block">Updates & Events</span>
//                         <h2 className="text-4xl md:text-5xl font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-[#1a365d]">
//                             Latest <span className="italic text-[#0096a4]">Announcements</span>
//                         </h2>
//                     </div>
//                 </div>

//                 {/* Horizontal Scrolling Container */}
//                 <div
//                     ref={scrollContainerRef}
//                     className="flex overflow-x-auto gap-6 md:gap-8 pb-12 pt-4 scrollbar-hide snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
//                 >
//                     {news.map((item) => (
//                         <div
//                             key={item.id}
//                             className="relative min-w-[300px] sm:min-w-[360px] md:min-w-[420px] aspect-[4/5] shrink-0 snap-start snap-always rounded-3xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-500"
//                         >
//                             {/* Background Image */}
//                             <Image
//                                 src={item.src}
//                                 alt={item.title}
//                                 fill
//                                 className="object-cover transition-transform duration-700 group-hover:scale-105"
//                                 sizes="(max-width: 768px) 80vw, 30vw"
//                             />

//                             {/* Gradient Overlay for Text Readability */}
//                             <div className="absolute inset-0 bg-gradient-to-b from-[#1a365d]/80 via-[#1a365d]/20 to-[#1a365d]/95 pointer-events-none" />

//                             {/* Content Overlay */}
//                             <div className="absolute top-0 left-0 w-full p-6 md:p-8 flex flex-col items-start gap-3 z-10">
//                                 <span className="text-white text-xs font-semibold uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 shadow-sm">
//                                     {item.category}
//                                 </span>
//                                 <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-white text-2xl md:text-3xl font-medium leading-tight mt-2 max-w-[90%] drop-shadow-md">
//                                     {item.title}
//                                 </h3>
//                             </div>

//                             {/* Description at bottom left */}
//                             <div className="absolute bottom-0 left-0 p-6 md:p-8 z-10 w-full">
//                                 <p className="text-white/80 text-sm font-light leading-relaxed drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 transform">
//                                     {item.excerpt}
//                                 </p>
//                                 <div className="mt-4 flex items-center gap-2 text-[#0096a4] text-xs font-bold uppercase tracking-widest">
//                                     {item.date}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Navigation Arrows */}
//                 <div className="absolute md:top-0 top-20 right-8 md:right-16 lg:right-24 flex gap-4 mt-8 md:mt-12">
//                     <button
//                         onClick={() => scroll('left')}
//                         disabled={!canScrollLeft}
//                         className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border border-slate-200
//                             ${canScrollLeft
//                                 ? 'bg-white text-[#1a365d] hover:bg-[#1a365d] hover:text-white hover:border-[#1a365d] cursor-pointer shadow-sm'
//                                 : 'bg-transparent text-slate-300 cursor-not-allowed'}`}
//                         aria-label="Scroll left"
//                     >
//                         <ArrowLeft size={20} />
//                     </button>
//                     <button
//                         onClick={() => scroll('right')}
//                         disabled={!canScrollRight}
//                         className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border border-slate-200
//                             ${canScrollRight
//                                 ? 'bg-[#1a365d] text-white hover:bg-[#0096a4] hover:border-[#0096a4] cursor-pointer shadow-lg'
//                                 : 'bg-transparent text-slate-300 cursor-not-allowed'}`}
//                         aria-label="Scroll right"
//                     >
//                         <ArrowRight size={20} />
//                     </button>
//                 </div>
//             </div>
//         </section>
//     );
// }
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface NewsItem {
    id: string | number;
    date: string;
    category: string;
    title: string;
    excerpt: string;
    src: string;
}

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 1,
    date: "August 15, 2026",
    category: "CME Event",
    title: "Annual Conference on Advanced ART Protocols",
    excerpt: "Join us for a two-day comprehensive workshop focusing on the latest advancements in clinical embryology and lab management.",
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    date: "July 22, 2026",
    category: "Regulatory",
    title: "Updated Guidelines for State ART Clinics",
    excerpt: "The EAAP has released the revised compliance and ethics guidelines for all registered fertility clinics in Andhra Pradesh.",
    src: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    date: "June 10, 2026",
    category: "Scholarship",
    title: "Merit Scholarship Applications Now Open",
    excerpt: "Applications for the 2026 EAAP academic scholarships for underprivileged clinical embryology students are now live.",
    src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    date: "May 05, 2026",
    category: "Research",
    title: "Breakthroughs in Cryopreservation Tech",
    excerpt: "A look into the recent publications supported by the EAAP research grant program regarding vitrification.",
    src: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop"
  }
];

export default function LatestAnnouncements({ news }: { news?: NewsItem[] }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [displayNews, setDisplayNews] = useState<NewsItem[]>(news || DEFAULT_NEWS);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            if (news) return; 
            try {
                const res = await fetch('/api/public/announcements');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setDisplayNews(data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch announcements:', error);
            }
        };

        fetchAnnouncements();
    }, [news]);

    const checkScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", checkScroll);
            checkScroll(); 
            return () => container.removeEventListener("scroll", checkScroll);
        }
    }, [displayNews]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth * 0.8; 
            const targetScroll = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
    };

    return (
        <section className="bg-white py-16 overflow-hidden flex flex-col justify-center border-b border-slate-100">
            <div className="max-w-[1600px] w-full mx-auto relative px-8 md:px-16 lg:px-24">
                
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest mb-2 block">Updates & Events</span>
                        <h2 className="text-4xl md:text-5xl font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-[#1a365d]">
                            Latest <span className="italic text-[#0096a4]">Announcements</span>
                        </h2>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-6 md:gap-8 pb-12 pt-4 scrollbar-hide snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {displayNews.map((item) => (
                        <div
                            key={item.id}
                            className="relative min-w-[300px] sm:min-w-[360px] md:min-w-[420px] aspect-[4/5] shrink-0 snap-start snap-always rounded-3xl overflow-hidden group cursor-pointer border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-500"
                        >
                            <Image
                                src={item.src}
                                alt={item.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 768px) 80vw, 30vw"
                            />

                            <div className="absolute inset-0 bg-gradient-to-b from-[#1a365d]/80 via-[#1a365d]/20 to-[#1a365d]/95 pointer-events-none" />

                            <div className="absolute top-0 left-0 w-full p-6 md:p-8 flex flex-col items-start gap-3 z-10">
                                <span className="text-white text-xs font-semibold uppercase tracking-widest bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 shadow-sm">
                                    {item.category}
                                </span>
                                <h3 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-white text-2xl md:text-3xl font-medium leading-tight mt-2 max-w-[90%] drop-shadow-md">
                                    {item.title}
                                </h3>
                            </div>

                            <div className="absolute bottom-0 left-0 p-6 md:p-8 z-10 w-full">
                                <p className="text-white/80 text-sm font-light leading-relaxed drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 transform">
                                    {item.excerpt}
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-[#0096a4] text-xs font-bold uppercase tracking-widest">
                                    {item.date}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute md:top-0 top-20 right-8 md:right-16 lg:right-24 flex gap-4 mt-8 md:mt-12">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border border-slate-200
                            ${canScrollLeft
                                ? 'bg-white text-[#1a365d] hover:bg-[#1a365d] hover:text-white hover:border-[#1a365d] cursor-pointer shadow-sm'
                                : 'bg-transparent text-slate-300 cursor-not-allowed'}`}
                        aria-label="Scroll left"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border border-slate-200
                            ${canScrollRight
                                ? 'bg-[#1a365d] text-white hover:bg-[#0096a4] hover:border-[#0096a4] cursor-pointer shadow-lg'
                                : 'bg-transparent text-slate-300 cursor-not-allowed'}`}
                        aria-label="Scroll right"
                    >
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}
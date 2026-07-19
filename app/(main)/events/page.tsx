// // app/events/page.tsx (or components/EventsPlaceholder.tsx)
// "use client";

// import { motion } from 'framer-motion';
// import { CalendarClock, Sparkles, MapPin } from 'lucide-react';

// export default function EventsPlaceholder() {
//   return (
//     <section className="relative min-h-[80vh] bg-[#FAFAFA] flex items-center justify-center py-24 px-6 overflow-hidden">
      
//       {/* Background Decor */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-gradient-to-tr from-[#0096a4]/10 to-[#1a365d]/5 rounded-full blur-[100px]" />
//       </div>

//       <motion.div 
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="relative z-10 max-w-2xl w-full text-center flex flex-col items-center"
//       >
//         <div className="w-20 h-20 rounded-full bg-white border border-slate-200 shadow-xl shadow-[#1a365d]/5 flex items-center justify-center mb-8 relative">
//           <CalendarClock className="w-10 h-10 text-[#1a365d]" strokeWidth={1.5} />
//           <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#0096a4] rounded-full flex items-center justify-center border-2 border-white">
//             <Sparkles className="w-3 h-3 text-white" />
//           </div>
//         </div>

//         <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest mb-4 block">
//           Academic Calendar
//         </span>
        
//         <h1 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl lg:text-6xl text-[#1a365d] leading-tight mb-6">
//           Upcoming <span className="italic text-[#0096a4]">Events & CMEs.</span>
//         </h1>
        
//         <p className="text-slate-500 font-light text-lg md:text-xl leading-relaxed mb-10">
//           We are currently curating our schedule of Continuous Medical Education (CME) programs, hands-on workshops, and the annual state conference. 
//         </p>

//         <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm text-sm text-slate-600">
//           <MapPin className="w-4 h-4 text-[#0096a4]" />
//           <span>Schedules will be updated shortly.</span>
//         </div>
//       </motion.div>
//     </section>
//   );
// }

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDays, MapPin, Search, Loader2, Video, 
  Sparkles, History, ArrowRight
} from 'lucide-react';
import { getPublicEvents } from '@/app/lib/utilities/userApis';

// Graceful image component with a frosted glass date badge
const PublicEventImage = ({ src, alt, date }: { src: string, alt: string, date: Date }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full aspect-[4/3] relative overflow-hidden bg-slate-100 group">
      <CalendarDays className="absolute inset-0 m-auto w-12 h-12 text-slate-200 stroke-[1.5] z-0" />
      
      {src && !hasError && (
        <img 
          src={src} 
          alt={alt} 
          className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-1000 group-hover:scale-105" 
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f213b]/80 via-transparent to-transparent z-10 pointer-events-none" />

      <div className="absolute top-4 left-4 z-20 flex flex-col items-center justify-center w-14 h-16 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-white/20">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
        <span className="text-xl font-medium text-[#1a365d] leading-none mt-0.5">{date.getDate()}</span>
      </div>
    </div>
  );
};

export default function PublicEventsPage() {
  const [data, setData] = useState<{ types: string[], upcomingEvents: any[], pastEvents: any[] }>({
    types: [], upcomingEvents: [], pastEvents: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Client-side filtering states
  const [timeFilter, setTimeFilter] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await getPublicEvents();
      setData(res);
    } catch (err) {
      console.error("Failed to load events", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which array to filter based on the time toggle
  const sourceArray = timeFilter === 'UPCOMING' ? data.upcomingEvents : data.pastEvents;

  // Apply search and category filters
  const filteredEvents = sourceArray.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (evt.location && evt.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'ALL' || evt.type === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-white border-b border-slate-200/60">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-gradient-to-b from-[#0096a4]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0096a4]/10 border border-[#0096a4]/20 text-[#0096a4] text-xs font-medium uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 stroke-[1.5]" /> Academic Calendar
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#1a365d] leading-tight tracking-tight mb-6 max-w-4xl"
          >
            Discover Upcoming <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#0096a4]">Conferences & CMEs</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg font-normal text-slate-500 max-w-2xl leading-relaxed"
          >
            Join industry leaders and peers in our curated continuous medical education programs, hands-on workshops, and annual summits.
          </motion.p>
        </div>
      </section>

      {/* Discovery & Filters Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-12">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col md:flex-row gap-4">
          
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 stroke-[1.5]" />
            <input 
              type="text" 
              placeholder="Search by event name or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-transparent border-none outline-none text-sm font-medium text-slate-800 placeholder:font-normal placeholder:text-slate-400"
            />
          </div>

          <div className="hidden md:block w-px bg-slate-200 my-2" />

          {/* Controls: Time Toggle & Categories */}
          <div className="flex flex-col sm:flex-row items-center gap-3 p-2 md:p-0">
            
            {/* Time Toggle (Upcoming vs Past) */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto shrink-0">
              <button
                onClick={() => setTimeFilter('UPCOMING')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${
                  timeFilter === 'UPCOMING' ? 'bg-white text-[#0096a4] shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700 font-normal'
                }`}
              >
                <CalendarDays className="w-4 h-4 stroke-[1.5]" /> Upcoming
              </button>
              <button
                onClick={() => setTimeFilter('PAST')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${
                  timeFilter === 'PAST' ? 'bg-white text-slate-800 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700 font-normal'
                }`}
              >
                <History className="w-4 h-4 stroke-[1.5]" /> Past
              </button>
            </div>

            {/* Dynamic Categories (Rendered from backend unique types) */}
            {data.types.length > 0 && (
              <div className="flex items-center overflow-x-auto hide-scrollbar gap-1 w-full sm:w-auto">
                <button
                  onClick={() => setActiveCategory('ALL')}
                  className={`px-5 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap ${
                    activeCategory === 'ALL' 
                      ? 'bg-[#1a365d] text-white font-medium shadow-sm' 
                      : 'bg-transparent text-slate-500 hover:bg-slate-100 font-normal'
                  }`}
                >
                  All Events
                </button>
                {data.types.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap ${
                      activeCategory === cat 
                        ? 'bg-[#1a365d] text-white font-medium shadow-sm' 
                        : 'bg-transparent text-slate-500 hover:bg-slate-100 font-normal'
                    }`}
                  >
                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Event Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="w-full py-32 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
            <p className="text-slate-500 font-medium text-sm tracking-wide">Loading calendar...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((evt, index) => {
                const evtDate = new Date(evt.date);
                const isVirtual = evt.location?.toLowerCase() === 'virtual' || !evt.location;

                return (
                  <motion.div
                    key={evt.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Link href={`/events/${evt.id}`} className="group block h-full">
                      <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,150,164,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                        
                        <PublicEventImage src={evt.coverImage} alt={evt.title} date={evtDate} />
                        
                        <div className="p-6 md:p-8 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-100 rounded text-[10px] font-medium uppercase tracking-widest">
                              {evt.type || 'Event'}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-medium text-[#1a365d] mb-4 leading-snug group-hover:text-[#0096a4] transition-colors line-clamp-2">
                            {evt.title}
                          </h3>
                          
                          <div className="mt-auto space-y-3 pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#0096a4]/5 transition-colors">
                                {isVirtual ? <Video className="w-3.5 h-3.5 stroke-[1.5]" /> : <MapPin className="w-3.5 h-3.5 stroke-[1.5]" />}
                              </div>
                              <span className="font-normal truncate">{isVirtual ? 'Virtual Online Event' : evt.location}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="w-full bg-white border border-slate-200/60 rounded-[2rem] p-16 md:p-24 text-center flex flex-col items-center shadow-sm"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              {timeFilter === 'PAST' ? (
                <History className="w-8 h-8 text-slate-400 stroke-[1.5]" />
              ) : (
                <CalendarDays className="w-8 h-8 text-slate-400 stroke-[1.5]" />
              )}
            </div>
            <p className="text-xl font-medium text-slate-800 mb-2">
              {timeFilter === 'PAST' ? 'No past events found' : 'No upcoming events found'}
            </p>
            <p className="text-base font-normal text-slate-500 max-w-md mx-auto">
              {timeFilter === 'PAST' 
                ? "There are no historical records matching your current filter criteria."
                : "We are currently curating our schedule. Check back soon for new workshops and conferences."}
            </p>
            {searchQuery || activeCategory !== 'ALL' ? (
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}
                className="mt-6 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Clear Filters
              </button>
            ) : null}
          </motion.div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
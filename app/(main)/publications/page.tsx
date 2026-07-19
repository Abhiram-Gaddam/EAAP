// // app/publications/page.tsx (or components/PublicationsPlaceholder.tsx)
// "use client";

// import { motion } from 'framer-motion';
// import { BookOpenText, Microscope, ArrowRight } from 'lucide-react';

// export default function PublicationsPlaceholder() {
//   return (
//     <section className="relative min-h-[80vh] bg-[#1a365d] flex items-center justify-center py-24 px-6 overflow-hidden">
      
//       {/* Background Decor */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0096a4]/10 rounded-full blur-[120px]" />
//       </div>

//       <motion.div 
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="relative z-10 max-w-3xl w-full"
//       >
//         <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-10 md:p-16 text-center flex flex-col items-center shadow-2xl">
          
//           <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-8">
//             <BookOpenText className="w-10 h-10 text-[#0096a4]" strokeWidth={1.5} />
//           </div>

//           <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest mb-4 block flex items-center gap-2">
//             <Microscope className="w-4 h-4" />
//             Research & Library
//           </span>
          
//           <h1 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
//             Scientific <span className="italic text-[#0096a4]">Publications.</span>
//           </h1>
          
//           <p className="text-white/70 font-light text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
//             Our digital repository of clinical guidelines, ART research papers, and the official EAAP journal is currently under development. A centralized hub for scientific excellence is coming soon.
//           </p>

//           <button className="bg-[#0096a4] text-white px-8 py-3.5 rounded-full font-medium text-sm hover:bg-[#007a86] transition-colors duration-300 flex items-center gap-2 group">
//             Return to Homepage
//             <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
//           </button>
          
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
  BookOpen, Search, Loader2, Sparkles, FileText, 
  ArrowRight, Clock, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { getPublicPublications } from '@/app/lib/utilities/userApis';

const PublicationCover = ({ src, alt }: { src: string, alt: string }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full sm:w-64 md:w-72 h-48 sm:h-full relative overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center border-r border-slate-100">
      <BookOpen className="absolute w-10 h-10 text-slate-200 stroke-[1] z-0" />
      
      {src && !hasError && (
        <img 
          src={src} 
          alt={alt} 
          className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-1000 group-hover:scale-105" 
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-900/10 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default function PublicPublicationsPage() {
  const [data, setData] = useState<{ tags: string[], publications: any[] }>({
    tags: [], publications: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('ALL');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    fetchPublications();
  }, []);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTag]);

  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      const res = await getPublicPublications();
      setData(res || { tags: [], publications: [] });
    } catch (err) {
      console.error("Failed to load publications", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Filter the entire list first
  const filteredPublications = data.publications.filter(pub => {
    const matchesSearch = 
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (pub.authors && pub.authors.join(' ').toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = activeTag === 'ALL' || (pub.tags && pub.tags.includes(activeTag));
    
    return matchesSearch && matchesTag;
  });

  // 2. Calculate Pagination variables
  const totalPages = Math.ceil(filteredPublications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // 3. Slice the array to get only the items for the current page
  const currentPublications = filteredPublications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] font-sans pb-32">
      
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#0096a4]/5 to-transparent blur-3xl opacity-70" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#1a365d]/5 to-transparent blur-3xl opacity-70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-[#1a365d] text-[11px] font-medium uppercase tracking-widest mb-8 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0096a4] stroke-[1.5]" /> Open Access Library
          </motion.div>
          
          {/* <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-medium text-[#1a365d] leading-[1.1] tracking-tight mb-6"
          >
            Research & <br/>
            <span className="text-slate-400 font-normal italic">Publications.</span>
          </motion.h1> */}
           <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#1a365d] leading-tight tracking-tight mb-6 max-w-4xl"
          >
            Research & <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a365d] to-[#0096a4]">Publications.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg font-normal text-slate-500 max-w-2xl leading-relaxed"
          >
            A curated directory of peer-reviewed articles, clinical methodologies, and academic papers pushing the boundaries of the field.
          </motion.p>
        </div>
      </section>

      {/* Floating Command Bar (Sticky) */}
      <div className="sticky top-20 z-40 max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-2xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col md:flex-row gap-2 relative"
        >
          <div className="flex-1 relative min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 stroke-[1.5]" />
            <input 
              type="text" 
              placeholder="Search papers, authors, or topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-transparent border-none outline-none text-sm font-medium text-slate-800 placeholder:font-normal placeholder:text-slate-400"
            />
          </div>

          {data.tags.length > 0 && (
            <>
              <div className="hidden md:block w-px bg-slate-200 my-2 shrink-0" />
              
              <div className="relative w-full md:w-[380px] shrink-0">
                <div className="flex items-center overflow-x-auto gap-1 px-2 md:px-0 pb-2 md:pb-0 scroll-smooth custom-thin-scrollbar pr-10">
                  <button
                    onClick={() => setActiveTag('ALL')}
                    className={`px-5 py-2 rounded-xl text-sm transition-colors whitespace-nowrap ${
                      activeTag === 'ALL' 
                        ? 'bg-slate-100 text-slate-800 font-medium' 
                        : 'bg-transparent text-slate-500 hover:text-slate-800 font-normal'
                    }`}
                  >
                    All
                  </button>
                  {data.tags.map((tag: string) => (
                    <button
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      className={`px-5 py-2 rounded-xl text-sm transition-colors whitespace-nowrap ${
                        activeTag === tag 
                          ? 'bg-slate-100 text-slate-800 font-medium' 
                          : 'bg-transparent text-slate-500 hover:text-slate-800 font-normal'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/95 to-transparent pointer-events-none rounded-r-2xl" />
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Publications List */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        {isLoading ? (
          <div className="w-full py-32 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-6 stroke-[1.5]" />
            <p className="text-slate-400 font-medium text-sm tracking-widest uppercase">Fetching Library</p>
          </div>
        ) : filteredPublications.length > 0 ? (
          <div className="space-y-10">
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {/* Render ONLY the sliced currentPublications */}
                {currentPublications.map((pub, index) => {
                  const pubDate = new Date(pub.publishedDate);
                  const readTime = Math.max(3, Math.ceil((pub.abstract?.length || 0) / 1000));

                  return (
                    <motion.div
                      key={pub.id}
                      layout
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Link href={`/publications/${pub.id}`} className="group block">
                        <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-[0_20px_40px_rgba(26,54,93,0.06)] hover:border-slate-300 transition-all duration-500 flex flex-col sm:flex-row h-full sm:h-64">
                          
                          <PublicationCover src={pub.coverImage} alt={pub.title} />
                          
                          <div className="p-6 sm:p-8 md:px-10 flex flex-col flex-1 min-w-0 bg-white group-hover:bg-slate-50/30 transition-colors">
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <span className="text-[10px] font-medium text-[#0096a4] uppercase tracking-widest">
                                {pubDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                <Clock className="w-3 h-3 stroke-[1.5]" /> {readTime} min read
                              </span>
                            </div>
                            
                            <h3 className="text-xl md:text-2xl font-medium text-[#1a365d] mb-3 leading-snug group-hover:text-[#0096a4] transition-colors line-clamp-2 pr-4">
                              {pub.title}
                            </h3>

                            <p className="text-sm font-normal text-slate-500 mb-6 line-clamp-2 leading-relaxed">
                              {pub.abstract}
                            </p>
                            
                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center gap-3 min-w-0 pr-4">
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                  <span className="text-[10px] font-medium">{pub.authors?.[0]?.charAt(0) || 'U'}</span>
                                </div>
                                <span className="text-sm font-medium text-slate-700 truncate">
                                  {pub.authors?.join(', ') || 'Unknown Author'}
                                </span>
                              </div>
                              
                              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-[#0096a4] group-hover:border-[#0096a4] group-hover:text-white transition-all shrink-0">
                                <ArrowRight className="w-4 h-4 stroke-[1.5]" />
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-between pt-6 border-t border-slate-200/60"
              >
                <button
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' }); // Scroll back up to results
                  }}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[1.5]" /> Previous
                </button>
                
                <span className="text-sm font-medium text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
                >
                  Next <ChevronRight className="w-4 h-4 stroke-[1.5]" />
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="w-full bg-white border border-slate-200/60 rounded-[2rem] p-16 md:p-24 text-center flex flex-col items-center shadow-sm"
          >
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
              <FileText className="w-8 h-8 text-slate-300 stroke-[1.5]" />
            </div>
            <p className="text-xl font-medium text-slate-800 mb-2">No publications found</p>
            <p className="text-base font-normal text-slate-500 max-w-md mx-auto">
              We couldn't find any research papers matching your current search or filter criteria.
            </p>
            {(searchQuery || activeTag !== 'ALL') && (
              <button 
                onClick={() => { setSearchQuery(''); setActiveTag('ALL'); }}
                className="mt-6 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-thin-scrollbar::-webkit-scrollbar { 
          height: 4px; 
        }
        .custom-thin-scrollbar::-webkit-scrollbar-track { 
          background: transparent; 
        }
        .custom-thin-scrollbar::-webkit-scrollbar-thumb { 
          background: #e2e8f0; 
          border-radius: 10px; 
        }
        .custom-thin-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: #cbd5e1; 
        }
      `}} />
    </div>
  );
}
"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Loader2, AlertCircle, 
  Download, ExternalLink, Quote, Share2
} from 'lucide-react';
import { getPublicPublicationDetails } from '@/app/lib/utilities/userApis';

export default function PublicPublicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pub, setPub] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchPublication();
  }, [id]);

  const fetchPublication = async () => {
    try {
      setIsLoading(true);
      const data = await getPublicPublicationDetails(id);
      setPub(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load publication details.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !id) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-6 stroke-[1.5]" />
        <p className="text-slate-400 font-medium text-sm tracking-widest uppercase">Loading Paper...</p>
      </div>
    );
  }

  if (error || !pub) {
    return (
      <div className="w-full min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl border border-red-100 flex flex-col items-center text-center p-10 shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-400 mb-4 stroke-[1.5]" />
          <p className="text-slate-600 font-medium mb-8 leading-relaxed">{error}</p>
          <Link href="/publications" className="px-6 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-medium transition-colors text-sm">
            Return to Library
          </Link>
        </div>
      </div>
    );
  }

  const publishDate = new Date(pub.publishedDate);

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] font-sans py-16 selection:bg-[#0096a4]/20 selection:text-[#1a365d]">
      
      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <Link href="/publications" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-[#0096a4] transition-colors">
          <ArrowLeft className="w-4 h-4 stroke-[1.5]" /> Back to Library
        </Link>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: The Paper Content (Span 8) */}
        <div className="lg:col-span-8">
          
          {/* Header Metadata */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              {pub.tags?.map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 text-[10px] font-medium uppercase tracking-widest rounded-full shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-[#1a365d] leading-[1.15] tracking-tight mb-8">
              {pub.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-4 gap-x-6 py-6 border-y border-slate-200/60">
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Authors</span>
                <span className="text-base font-medium text-slate-800">{pub.authors?.join(', ') || 'Unknown Author'}</span>
              </div>
              <div className="w-px h-10 bg-slate-200 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Published</span>
                <span className="text-base font-medium text-slate-800">
                  {publishDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Abstract Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="prose prose-slate max-w-none">
            
            <div className="relative mb-16">
              <Quote className="absolute -top-6 -left-6 w-12 h-12 text-[#0096a4]/10 stroke-[1] -rotate-12 pointer-events-none" />
              <h2 className="text-xl font-medium text-[#1a365d] mb-6 tracking-tight">Abstract</h2>
              <p className="text-lg font-normal text-slate-600 leading-relaxed whitespace-pre-wrap">
                {pub.abstract}
              </p>
            </div>

            {pub.problemStatement && (
              <div className="relative">
                <h2 className="text-xl font-medium text-[#1a365d] mb-6 tracking-tight">Problem Statement</h2>
                <div className="pl-6 border-l-2 border-[#0096a4]/30">
                  <p className="text-base font-normal text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {pub.problemStatement}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Column: Sticky Action Panel (Span 4) */}
        <div className="lg:col-span-4 relative">
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="sticky top-24"
          >
            {/* Cover Image Preview (if exists) */}
            {pub.coverImage && (
              <div className="w-full aspect-[3/4] bg-white rounded-3xl p-3 border border-slate-200 shadow-xl shadow-slate-200/50 mb-8 overflow-hidden relative group">
                <img 
                  src={pub.coverImage} 
                  alt={pub.title} 
                  className="w-full h-full object-cover rounded-2xl" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none rounded-3xl" />
              </div>
            )}

            {/* Access Widget */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
              <h3 className="text-base font-medium text-slate-800 mb-2">Access Document</h3>
              <p className="text-sm font-normal text-slate-500 mb-8">
                Read the complete peer-reviewed publication securely in PDF format.
              </p>
              
              {pub.pdfUrl ? (
                <div className="space-y-3">
                  <a 
                    href={pub.pdfUrl} 
                    download
                    className="w-full py-3.5 bg-[#1a365d] hover:bg-[#12284b] text-white rounded-xl text-sm font-medium transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    <Download className="w-4 h-4 stroke-[1.5] group-hover:-translate-y-0.5 transition-transform" /> Download PDF
                  </a>
                  <a 
                    href={pub.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#0096a4] hover:border-slate-300 rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4 stroke-[1.5]" /> View in Browser
                  </a>
                </div>
              ) : (
                <div className="w-full py-5 bg-slate-50 text-slate-400 border border-slate-200 border-dashed rounded-xl text-sm font-medium text-center">
                  Document Currently Unavailable
                </div>
              )}

              {/* Utility Actions */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex justify-center">
                <button 
                  onClick={() => navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied to clipboard!'))}
                  className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 stroke-[1.5]" /> Share this paper
                </button>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
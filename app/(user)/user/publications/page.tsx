"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, Plus, Loader2, AlertCircle, Clock, 
  CheckCircle2, XCircle, FileText, UploadCloud, X, ArrowRight
} from 'lucide-react';
import { getUserPublications, createUserPublication } from '@/app/lib/utilities/userApis';

const PublicationImage = ({ src, alt, status }: { src: string, alt: string, status: string }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full h-40 relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shrink-0 flex items-center justify-center">
      <BookOpen className="absolute w-10 h-10 text-slate-300 stroke-[1.5] z-0" />
      
      {src && !hasError && (
        <img 
          src={src} 
          alt={alt} 
          className="absolute inset-0 w-full h-full object-cover z-10 transition-transform duration-700 group-hover:scale-105" 
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent z-10 pointer-events-none"></div>

      <div className="absolute top-3 left-3 z-20">
        <span className={`px-2.5 py-1 rounded bg-white/95 backdrop-blur-sm text-[10px] font-medium uppercase tracking-widest shadow-sm ${
          status === 'APPROVED' ? 'text-emerald-700' :
          status === 'PENDING' ? 'text-amber-600' :
          status === 'REJECTED' ? 'text-red-600' :
          'text-slate-600'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default function UserPublicationsHub() {
  const router = useRouter();
  const [publications, setPublications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({ title: '', abstract: '', problemStatement: '', authors: '', tags: '' });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      const res = await getUserPublications();
      setPublications(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load publications.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !formData.title || !formData.abstract) {
      return alert("Title, abstract, and PDF file are required.");
    }
    
    try {
      setIsSubmitting(true);
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('abstract', formData.abstract);
      submitData.append('problemStatement', formData.problemStatement);
      
      const authorsArray = formData.authors.split(',').map(a => a.trim()).filter(a => a);
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      
      submitData.append('authors', JSON.stringify(authorsArray));
      submitData.append('tags', JSON.stringify(tagsArray));
      submitData.append('pdf', pdfFile);
      if (coverFile) submitData.append('coverImage', coverFile);

      const res = await createUserPublication(submitData);
      setIsCreateModalOpen(false);
      resetForm();
      // Redirect straight to the new draft
      router.push(`/publications/${res.publication.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create draft');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', abstract: '', problemStatement: '', authors: '', tags: '' });
    setPdfFile(null); setCoverFile(null);
  };

  const filteredPubs = activeTab === 'ALL' ? publications : publications.filter(p => p.status === activeTab);

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
        <p className="text-slate-500 font-medium text-sm tracking-wide">Loading publications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white min-h-[40vh] rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center p-8 shadow-sm">
        <AlertCircle className="w-10 h-10 text-red-400 mb-4 stroke-[1.5]" />
        <p className="text-slate-600 font-medium text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-2">
        <div>
          <h1 className="text-2xl font-medium text-[#1a365d] tracking-tight">Research & Publications</h1>
          <p className="text-sm font-normal text-slate-500 mt-1 max-w-xl">
            Draft, submit, and track the status of your research papers and publications.
          </p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 bg-[#1a365d] text-white rounded-xl text-sm font-medium hover:bg-[#12284b] transition-all shadow-sm flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[1.5]" /> Start New Draft
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {['ALL', 'DRAFT', 'PENDING', 'APPROVED', 'REJECTED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-white border border-slate-200 text-[#0096a4] shadow-sm font-medium' 
                : 'text-slate-500 hover:text-slate-700 font-normal border border-transparent'
            }`}
          >
            {tab === 'ALL' ? 'All Publications' : tab.charAt(0) + tab.slice(1).toLowerCase() + 's'}
          </button>
        ))}
      </div>

      {filteredPubs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPubs.map((pub: any) => (
            <Link href={`/user/publications/${pub.id}`} key={pub.id} className="group">
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,150,164,0.06)] hover:border-[#0096a4]/30 transition-all flex flex-col h-full">
                <PublicationImage src={pub.coverImage} alt={pub.title} status={pub.status} />
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-medium text-slate-800 line-clamp-2 mb-4 group-hover:text-[#0096a4] transition-colors leading-snug">
                    {pub.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                      {new Date(pub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0096a4] transition-colors stroke-[1.5]" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <BookOpen className="w-12 h-12 text-slate-200 mb-4 stroke-[1.5]" />
          <p className="text-base font-medium text-slate-700 mb-2">No publications found</p>
          <p className="text-sm font-normal text-slate-500 mb-6 max-w-md">
            You don't have any research papers or publications in this category yet.
          </p>
          <button onClick={() => setIsCreateModalOpen(true)} className="px-6 py-3 bg-slate-50 border border-slate-200 text-[#0096a4] rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm">
            Start your first draft <Plus className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      )}

      {/* Create Draft Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isSubmitting && setIsCreateModalOpen(false)} className="absolute inset-0 bg-[#0f213b]/40 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-6 md:px-8 border-b border-slate-100 bg-white sticky top-0 z-20">
                <h3 className="text-xl font-medium text-[#1a365d]">New Publication Draft</h3>
                <button disabled={isSubmitting} onClick={() => setIsCreateModalOpen(false)} className="p-2 text-slate-400 hover:text-[#1a365d] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <form id="createPubForm" onSubmit={handleCreateDraft} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Research PDF *</label>
                      <div className="border border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#0096a4]/40 hover:bg-[#0096a4]/5 transition-colors relative group bg-slate-50 h-32 flex items-center justify-center">
                        <input type="file" accept="application/pdf" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)} />
                        <div className="flex flex-col items-center pointer-events-none">
                          {pdfFile ? (
                             <div className="text-[#0096a4] flex flex-col items-center">
                               <FileText className="w-6 h-6 mb-2 stroke-[1.5]" />
                               <span className="text-xs font-medium truncate max-w-[200px]">{pdfFile.name}</span>
                             </div>
                          ) : (
                            <>
                              <UploadCloud className="w-6 h-6 text-slate-300 mb-2 group-hover:text-[#0096a4] transition-colors stroke-[1.5]" />
                              <span className="text-xs font-medium text-[#1a365d]">Upload PDF</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Cover Image (Optional)</label>
                      <div className="border border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-[#0096a4]/40 hover:bg-[#0096a4]/5 transition-colors relative group bg-slate-50 h-32 flex items-center justify-center">
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)} />
                        <div className="flex flex-col items-center pointer-events-none">
                          {coverFile ? (
                             <div className="text-[#0096a4] flex flex-col items-center">
                               <CheckCircle2 className="w-6 h-6 mb-2 stroke-[1.5]" />
                               <span className="text-xs font-medium truncate max-w-[200px]">{coverFile.name}</span>
                             </div>
                          ) : (
                            <>
                              <UploadCloud className="w-6 h-6 text-slate-300 mb-2 group-hover:text-[#0096a4] transition-colors stroke-[1.5]" />
                              <span className="text-xs font-medium text-[#1a365d]">Upload Cover</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Publication Title *</label>
                    <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Authors (Comma separated) *</label>
                    <input type="text" required value={formData.authors} onChange={(e) => setFormData({...formData, authors: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all" placeholder="e.g. Dr. John Doe, Jane Smith" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Tags / Keywords (Comma separated)</label>
                    <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all" placeholder="e.g. AI, Health, Embryology" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Problem Statement</label>
                    <textarea rows={2} value={formData.problemStatement} onChange={(e) => setFormData({...formData, problemStatement: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all resize-none" />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Abstract *</label>
                    <textarea rows={5} required value={formData.abstract} onChange={(e) => setFormData({...formData, abstract: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all resize-none" />
                  </div>

                </form>
              </div>
              
              <div className="p-6 md:px-8 border-t border-slate-100 bg-slate-50/50 sticky bottom-0 z-20 flex gap-4">
                <button type="button" disabled={isSubmitting} onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-5 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm">
                  Cancel
                </button>
                <button type="submit" form="createPubForm" disabled={isSubmitting || !pdfFile} className="flex-1 px-5 py-3.5 bg-[#1a365d] hover:bg-[#12284b] text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin stroke-[1.5]" /> Saving...</> : 'Save as Draft'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
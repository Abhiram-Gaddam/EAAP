// app/admin/publications/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, BookOpen, MoreVertical, Edit, Trash2, 
  Loader2, X, AlertCircle, UploadCloud, FileText, CheckCircle2,
  Clock, XCircle, FileIcon,
  ImageIcon
} from 'lucide-react';
import { getAllAdminPublications, adminCreatePublication, deletePublication, updatePublicationStatus } from '@/app/lib/utilities/apis';

const TABS = ['All', 'PENDING', 'APPROVED', 'REJECTED'];

export default function PublicationsPage() {
  const router = useRouter();
  const [publications, setPublications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    problemStatement: '',
    abstract: '',
    authors: '',
    tags: ''
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPublications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      const data = await getAllAdminPublications();
       setPublications(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch publications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile || !formData.title || !formData.abstract) {
      return alert('Title, abstract, and PDF file are required.');
    }
    
    try {
      setIsSubmitting(true);
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('problemStatement', formData.problemStatement);
      submitData.append('abstract', formData.abstract);
      
      const authorsArray = formData.authors.split(',').map(a => a.trim()).filter(a => a);
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      
      submitData.append('authors', JSON.stringify(authorsArray));
      submitData.append('tags', JSON.stringify(tagsArray));
      submitData.append('pdf', pdfFile);
      if (coverFile) submitData.append('coverImage', coverFile);

      await adminCreatePublication(submitData);
      
      setIsCreateModalOpen(false);
      resetForm();
      fetchPublications();
    } catch (err: any) {
      alert(err.message || 'Failed to create publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this publication and its files?")) {
      try {
        await deletePublication(id);
        setActiveDropdown(null);
        fetchPublications();
      } catch (err: any) {
        alert(err.message || 'Failed to delete publication');
      }
    }
  };

  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    try {
      await updatePublicationStatus(id, status);
      setActiveDropdown(null);
      fetchPublications();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', problemStatement: '', abstract: '', authors: '', tags: '' });
    setPdfFile(null);
    setCoverFile(null);
  };

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pub.authors?.some((a: string) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (activeTab !== 'All' && pub.status !== activeTab) return false;
    return true;
  });

  return (
    <div className="w-full bg-white min-h-full rounded-3xl p-2 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a365d]">Research & Publications</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage, review, and publish research papers and articles</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a365d] to-[#0096a4] hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Direct Publish
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-50 p-2 rounded-2xl">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-white text-[#0096a4] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {tab === 'All' ? 'All Publications' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80 px-1 pb-1 md:pb-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" placeholder="Search by title or author..." 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading publications...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-red-500 text-sm font-medium bg-red-50 rounded-2xl border border-red-100">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-80" />
          {error}
        </div>
      ) : filteredPublications.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1a365d] mb-1">No Publications Found</h3>
          <p className="text-sm text-slate-500 mb-6">There are no publications matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPublications.map((pub) => {
            const isDropdownOpen = activeDropdown === pub.id;
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={pub.id}
                className="bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,150,164,0.08)] transition-all group flex flex-col relative overflow-hidden"
              >
                <div 
                  onClick={() => router.push(`/admin/publications/${pub.id}`)}
                  className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center cursor-pointer border-b border-slate-100 shrink-0"
                >
                  {pub.coverImage ? (
                    <img src={pub.coverImage} alt={pub.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a365d] to-[#0096a4] opacity-90 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/40 group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                      pub.status === 'APPROVED' ? 'bg-emerald-500/90 text-white border-emerald-400' : 
                      pub.status === 'PENDING' ? 'bg-amber-400/90 text-white border-amber-300' :
                      'bg-red-500/90 text-white border-red-400'
                    }`}>
                      {pub.status}
                    </span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveDropdown(isDropdownOpen ? null : pub.id); }}
                    className="p-1.5 bg-white/90 backdrop-blur text-slate-600 hover:text-[#1a365d] rounded-xl shadow-sm transition-colors border border-slate-200/50"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        ref={dropdownRef}
                        initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }} transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden text-left"
                      >
                        <div className="p-1.5 space-y-0.5">
                          <button onClick={() => router.push(`/admin/publications/${pub.id}`)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0096a4] rounded-lg transition-colors">
                            <BookOpen className="w-4 h-4" /> View Details
                          </button>
                          
                          {pub.status !== 'APPROVED' && (
                            <button onClick={() => handleStatusUpdate(pub.id, 'APPROVED')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                              <CheckCircle2 className="w-4 h-4" /> Approve
                            </button>
                          )}
                          {pub.status !== 'REJECTED' && (
                            <button onClick={() => handleStatusUpdate(pub.id, 'REJECTED')} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          )}

                          <div className="h-px bg-slate-100 my-1 mx-2" />
                          <button onClick={() => handleDelete(pub.id)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div onClick={() => router.push(`/admin/publications/${pub.id}`)} className="p-5 flex flex-col flex-1 cursor-pointer">
                  <h3 className="text-base font-bold text-[#1a365d] group-hover:text-[#0096a4] transition-colors line-clamp-2 mb-2 leading-tight">
                    {pub.title}
                  </h3>
                  
                  <div className="text-xs font-semibold text-slate-500 line-clamp-1 mb-4">
                    {pub.authors?.join(', ')}
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                    {pub.abstract}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-50">
                    <div className="flex items-center gap-2">
                       <FileIcon className="w-4 h-4 text-slate-400" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PDF Available</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(pub.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1a365d]/40 backdrop-blur-sm"
              onClick={() => !isSubmitting && setIsCreateModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 md:px-8 border-b border-slate-100 bg-white sticky top-0 z-20">
                <h3 className="text-xl font-bold text-[#1a365d]">Publish Research</h3>
                <button disabled={isSubmitting} onClick={() => setIsCreateModalOpen(false)} className="p-2 text-slate-400 hover:text-[#1a365d] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <form id="createPubForm" onSubmit={handleCreate} className="space-y-6">
                  
                  {/* File Uploads */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Research PDF *</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#0096a4]/40 hover:bg-[#0096a4]/5 transition-colors relative group bg-slate-50 h-32 flex items-center justify-center">
                        <input 
                          type="file" accept="application/pdf" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => setPdfFile(e.target.files ? e.target.files[0] : null)}
                        />
                        <div className="flex flex-col items-center pointer-events-none">
                          {pdfFile ? (
                             <div className="text-[#0096a4] flex flex-col items-center">
                               <FileText className="w-6 h-6 mb-2" />
                               <span className="text-xs font-bold truncate max-w-[200px]">{pdfFile.name}</span>
                             </div>
                          ) : (
                            <>
                              <FileText className="w-6 h-6 text-slate-300 mb-2 group-hover:text-[#0096a4] transition-colors" />
                              <span className="text-xs font-bold text-[#1a365d]">Upload PDF</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cover Image (Optional)</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-[#0096a4]/40 hover:bg-[#0096a4]/5 transition-colors relative group bg-slate-50 h-32 flex items-center justify-center">
                        <input 
                          type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)}
                        />
                        <div className="flex flex-col items-center pointer-events-none">
                          {coverFile ? (
                             <div className="text-[#0096a4] flex flex-col items-center">
                               <ImageIcon className="w-6 h-6 mb-2" />
                               <span className="text-xs font-bold truncate max-w-[200px]">{coverFile.name}</span>
                             </div>
                          ) : (
                            <>
                              <UploadCloud className="w-6 h-6 text-slate-300 mb-2 group-hover:text-[#0096a4] transition-colors" />
                              <span className="text-xs font-bold text-[#1a365d]">Upload Cover</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Publication Title *</label>
                    <input 
                      type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Authors (Comma separated) *</label>
                    <input 
                      type="text" required value={formData.authors} onChange={(e) => setFormData({...formData, authors: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                      placeholder="e.g. Dr. John Doe, Jane Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tags / Keywords (Comma separated)</label>
                    <input 
                      type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                      placeholder="e.g. AI, Health, Embryology"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Problem Statement</label>
                    <textarea 
                      rows={2} value={formData.problemStatement} onChange={(e) => setFormData({...formData, problemStatement: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Abstract *</label>
                    <textarea 
                      rows={4} required value={formData.abstract} onChange={(e) => setFormData({...formData, abstract: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all resize-none"
                    />
                  </div>

                </form>
              </div>
              
              <div className="p-6 md:px-8 border-t border-slate-100 bg-slate-50/50 sticky bottom-0 z-20 flex gap-3">
                <button type="button" disabled={isSubmitting} onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-4 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm">
                  Cancel
                </button>
                <button type="submit" form="createPubForm" disabled={isSubmitting || !pdfFile} className="flex-1 px-4 py-3.5 bg-[#1a365d] hover:bg-[#0f213b] text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : 'Publish Directly'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}
"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Edit, Trash2, Loader2, Image as ImageIcon, 
  CheckCircle2, X, AlertCircle, FileText, Download, Save, Send,
  UploadCloud,
  BookOpen
} from 'lucide-react';
import { 
  getUserPublicationDetails, updateUserPublication, 
  deleteUserPublication, submitUserPublicationForReview 
} from '@/app/lib/utilities/userApis';

export default function PublicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const router = useRouter();
  
  const [pub, setPub] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ title: '', problemStatement: '', abstract: '', authors: '', tags: '' });
  const [newPdfFile, setNewPdfFile] = useState<File | null>(null);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) fetchPublication();
  }, [id]);

  const fetchPublication = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await getUserPublicationDetails(id);
      console.log(data);
      setPub(data);
      setFormData({
        title: data.title || '',
        problemStatement: data.problemStatement || '',
        abstract: data.abstract || '',
        authors: data.authors ? data.authors.join(', ') : '',
        tags: data.tags ? data.tags.join(', ') : ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load publication details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!id) return;
    if (confirm("Are you ready to submit this publication for board review?")) {
      try {
        setIsSubmitting(true);
        await submitUserPublicationForReview(id);
        await fetchPublication();
        alert("Publication successfully submitted for review!");
      } catch (err: any) {
        alert(err.message || 'Failed to submit for review');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleUpdateMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
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
      
      if (newPdfFile) submitData.append('pdf', newPdfFile);
      if (newCoverFile) submitData.append('coverImage', newCoverFile);

      await updateUserPublication(id, submitData);
      setIsEditing(false);
      setNewPdfFile(null);
      setNewCoverFile(null);
      await fetchPublication();
    } catch (err: any) {
      alert(err.message || 'Failed to update publication');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (confirm("Are you sure you want to permanently delete this publication?")) {
      try {
        await deleteUserPublication(id);
        router.push('/publications');
      } catch (err: any) {
        alert(err.message || 'Failed to delete publication');
      }
    }
  };

  if (isLoading || !id) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
        <p className="text-slate-500 font-medium tracking-wide text-sm">Loading details...</p>
      </div>
    );
  }

  if (error || !pub) {
    return (
      <div className="w-full bg-white min-h-[40vh] max-w-4xl mx-auto p-10 rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center shadow-sm">
        <AlertCircle className="w-10 h-10 text-red-400 mb-4 stroke-[1.5]" />
        <p className="text-slate-600 font-medium mb-8 text-sm">{error}</p>
        <Link href="/publications" className="px-6 py-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl font-medium transition-colors shadow-sm text-sm">
          Return to Publications
        </Link>
      </div>
    );
  }

  const isEditable = pub.status === 'DRAFT' || pub.status === 'REJECTED';

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full   pb-12 space-y-6">
      
      <Link href="/user/publications" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0096a4] transition-colors mb-2">
        <ArrowLeft className="w-4 h-4 stroke-[1.5]" /> Back to Publications
      </Link>

      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-widest border ${
              pub.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
              pub.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-200' :
              pub.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-200' :
              'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              Status: {pub.status}
            </span>
            {pub.tags && pub.tags.length > 0 && (
               <span className="px-2.5 py-1 rounded-md text-[10px] font-medium uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-100">
                 {pub.tags[0]}
               </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-medium text-[#1a365d] leading-tight mb-2 tracking-tight">
            {pub.title}
          </h1>
          <p className="text-sm font-normal text-slate-500">
            Created on {new Date(pub.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        
        {/* Action Panel */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {pub.pdfUrl && (
            <a 
              href={pub.pdfUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#0096a4] hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <FileText className="w-4 h-4 stroke-[1.5]" /> View PDF
            </a>
          )}
          
          {isEditable && (
            <>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-5 py-2.5 border rounded-xl text-sm font-medium transition-colors shadow-sm ${isEditing ? 'border-[#0096a4] text-[#0096a4] bg-[#0096a4]/5' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {isEditing ? <X className="w-4 h-4 stroke-[1.5]" /> : <Edit className="w-4 h-4 stroke-[1.5]" />}
                {isEditing ? 'Cancel Edit' : 'Edit Details'}
              </button>
              
              {!isEditing && (
                <button 
                  onClick={handleSubmitForReview} disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#0096a4] text-white hover:bg-[#007a86] rounded-xl text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin stroke-[1.5]" /> : <Send className="w-4 h-4 stroke-[1.5]" />}
                  Submit for Review
                </button>
              )}

              {!isEditing && (
                <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-xl transition-colors shadow-sm" title="Delete Draft">
                  <Trash2 className="w-4 h-4 stroke-[1.5]" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="aspect-[3/4] bg-slate-100 relative flex items-center justify-center p-6">
              {pub.coverImage ? (
                <img src={pub.coverImage} alt={pub.title} className="w-full h-full object-cover rounded-xl shadow-sm" referrerPolicy="no-referrer" />
              ) : (
                <div className="text-center flex flex-col items-center">
                  <BookOpen className="w-16 h-16 text-slate-300 mb-3 stroke-[1]" />
                  <span className="text-sm font-medium text-slate-400">No Cover Image</span>
                </div>
              )}
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
                <h3 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-3">Tags & Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {pub.tags && pub.tags.length > 0 ? pub.tags.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-medium shadow-sm">
                      {tag}
                    </span>
                  )) : (
                    <span className="text-sm font-normal text-slate-400 italic">No tags provided</span>
                  )}
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: Content / Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-8 md:p-10">
             
             {isEditing ? (
               <form onSubmit={handleUpdateMetadata} className="space-y-6">
                  <div className="pb-4 mb-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-slate-800">Edit Publication Details</h2>
                  </div>

                  {/* File Updates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 bg-slate-50 border border-slate-100 rounded-2xl mb-8">
                    <div>
                      <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">Update PDF (Optional)</label>
                      <input type="file" accept="application/pdf" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#0096a4]/10 file:text-[#0096a4] hover:file:bg-[#0096a4]/20 cursor-pointer" onChange={(e) => setNewPdfFile(e.target.files ? e.target.files[0] : null)} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2">Update Cover (Optional)</label>
                      <input type="file" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#0096a4]/10 file:text-[#0096a4] hover:file:bg-[#0096a4]/20 cursor-pointer" onChange={(e) => setNewCoverFile(e.target.files ? e.target.files[0] : null)} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-widest mb-2">Title</label>
                    <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-widest mb-2">Authors (Comma separated)</label>
                    <input type="text" required value={formData.authors} onChange={(e) => setFormData({...formData, authors: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-widest mb-2">Tags (Comma separated)</label>
                    <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-widest mb-2">Problem Statement</label>
                    <textarea rows={3} value={formData.problemStatement} onChange={(e) => setFormData({...formData, problemStatement: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 uppercase tracking-widest mb-2">Abstract</label>
                    <textarea rows={8} required value={formData.abstract} onChange={(e) => setFormData({...formData, abstract: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all resize-none" />
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 bg-[#1a365d] hover:bg-[#12284b] text-white px-8 py-3.5 rounded-xl text-sm font-medium shadow-md transition-all disabled:opacity-50">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin stroke-[1.5]" /> : <Save className="w-4 h-4 stroke-[1.5]" />} Save Updates
                    </button>
                  </div>
               </form>
             ) : (
               <div className="space-y-10">
                 <div>
                   <h3 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FileText className="w-4 h-4 text-slate-300" /> Authors</h3>
                   <p className="text-base font-medium text-slate-800">{pub.authors?.join(', ') || 'N/A'}</p>
                 </div>
                 
                 {pub.problemStatement && (
                   <div>
                     <h3 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-3">Problem Statement</h3>
                     <p className="text-sm font-normal text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">{pub.problemStatement}</p>
                   </div>
                 )}

                 <div>
                   <h3 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-3">Abstract Overview</h3>
                   <p className="text-sm font-normal text-slate-700 leading-relaxed whitespace-pre-wrap">{pub.abstract}</p>
                 </div>
               </div>
             )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
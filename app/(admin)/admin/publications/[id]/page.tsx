// app/admin/publications/[id]/page.tsx
"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Edit, Trash2, Loader2, Image as ImageIcon, 
  CheckCircle2, X, AlertCircle, FileText, XCircle, Download, Save,
  BookOpen
} from 'lucide-react';
import { 
  getAllAdminPublications, updatePublicationStatus, updatePublicationMetadata, 
  deletePublication, getSecurePublicationDownloadUrl, 
  getAdminPublicationDetails
} from '@/app/lib/utilities/apis';

export default function PublicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [pub, setPub] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', problemStatement: '', abstract: '', authors: '', tags: ''
  });

  useEffect(() => {
    fetchPublication();
  }, [id]);

  const fetchPublication = async () => {
    try {
      setIsLoading(true);
      // Fallback fetch all and filter if no specific GET [id] exists
      const currentPub = await getAdminPublicationDetails(id);
       
      console.log("Publication Data " ,currentPub);

      if (!currentPub) throw new Error("Publication not found.");
      
      setPub(currentPub);
      setFormData({
        title: currentPub.title || '',
        problemStatement: currentPub.problemStatement || '',
        abstract: currentPub.abstract || '',
        authors: currentPub.authors ? currentPub.authors.join(', ') : '',
        tags: currentPub.tags ? currentPub.tags.join(', ') : ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load publication details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    try {
      setIsSubmitting(true);
      await updatePublicationStatus(id, status);
      await fetchPublication();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const authorsArray = formData.authors.split(',').map(a => a.trim()).filter(a => a);
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
      
      await updatePublicationMetadata(id, {
        title: formData.title,
        problemStatement: formData.problemStatement,
        abstract: formData.abstract,
        authors: authorsArray,
        tags: tagsArray
      });
      setIsEditing(false);
      await fetchPublication();
    } catch (err: any) {
      alert(err.message || 'Failed to update metadata');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently delete this publication and its files?")) {
      try {
        await deletePublication(id);
        router.push('/admin/publications');
      } catch (err: any) {
        alert(err.message || 'Failed to delete publication');
      }
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const res = await getSecurePublicationDownloadUrl(id);
      if (res.downloadUrl) {
        window.open(res.downloadUrl, '_blank');
      } else {
        alert("Failed to retrieve secure URL.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#0096a4] animate-spin mb-4" />
        <p className="text-slate-500 font-semibold tracking-wide">Loading publication details...</p>
      </div>
    );
  }

  if (error || !pub) {
    return (
      <div className="w-full bg-white min-h-[50vh] max-w-4xl mx-auto p-10 rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Publication Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-md">{error}</p>
        <Link href="/admin/publications" className="px-6 py-3 bg-[#1a365d] hover:bg-[#0f213b] text-white rounded-xl font-bold transition-colors shadow-sm">
          Return to Publications
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-full   p-2 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <Link href="/admin/publications" className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-[#1a365d] rounded-2xl transition-all shrink-0 mt-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm border ${
                pub.status === 'APPROVED' ? 'bg-emerald-500 text-white border-emerald-400' : 
                pub.status === 'PENDING' ? 'bg-amber-400 text-white border-amber-300' :
                'bg-red-500 text-white border-red-400'
              }`}>
                {pub.status}
              </span>
              <span className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                {pub.tags && pub.tags.length > 0 ? pub.tags[0] : 'Research'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#1a365d] leading-tight mb-2 line-clamp-2">{pub.title}</h1>
            <p className="text-sm text-slate-500 font-semibold flex items-center gap-2">
              <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-xs font-mono">ID: {pub.id.split('-')[0]}</span>
              • Submitted on {new Date(pub.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 self-start bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-sm">
          {pub.status !== 'APPROVED' && (
            <button onClick={() => handleUpdateStatus('APPROVED')} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-xl text-sm font-bold transition-all shadow-sm">
              <CheckCircle2 className="w-4 h-4" /> <span className="hidden sm:inline">Approve</span>
            </button>
          )}
          {pub.status !== 'REJECTED' && (
             <button onClick={() => handleUpdateStatus('REJECTED')} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-xl text-sm font-bold transition-all shadow-sm">
               <XCircle className="w-4 h-4" /> <span className="hidden sm:inline">Reject</span>
             </button>
          )}
          <div className="w-px h-8 bg-slate-200 hidden sm:block mx-1"></div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-sm font-bold transition-all shadow-sm ${isEditing ? 'border-[#0096a4] text-[#0096a4] bg-[#0096a4]/5' : 'border-slate-200 text-slate-600 hover:text-[#1a73e8] hover:bg-blue-50'}`}
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            <span className="hidden sm:inline">{isEditing ? 'Cancel Edit' : 'Edit Text'}</span>
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all shadow-sm">
            <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="aspect-[3/4] bg-slate-100 relative flex items-center justify-center">
              {pub.coverImage ? (
                <img src={pub.coverImage} alt={pub.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center flex flex-col items-center opacity-50">
                  <BookOpen className="w-16 h-16 text-slate-400 mb-2" />
                  <span className="text-sm font-bold text-slate-500">No Cover Available</span>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <button 
                onClick={handleDownload} 
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 bg-[#0096a4]/10 hover:bg-[#0096a4] text-[#0096a4] hover:text-white px-5 py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
              >
                {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Download Secure PDF
              </button>
              
              <div className="mt-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tags & Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {pub.tags && pub.tags.length > 0 ? pub.tags.map((tag: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold shadow-sm">
                      {tag}
                    </span>
                  )) : (
                    <span className="text-sm font-semibold text-slate-400">No tags provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
             <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
               <h2 className="text-xl font-bold text-[#1a365d] flex items-center gap-2">
                 <FileText className="w-5 h-5 text-[#0096a4]" />
                 Publication Metadata
               </h2>
             </div>

             {isEditing ? (
               <form onSubmit={handleUpdateMetadata} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                    <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-[#0096a4]/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Authors (Comma separated)</label>
                    <input type="text" required value={formData.authors} onChange={(e) => setFormData({...formData, authors: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-[#0096a4]/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tags (Comma separated)</label>
                    <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-[#0096a4]/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Problem Statement</label>
                    <textarea rows={3} value={formData.problemStatement} onChange={(e) => setFormData({...formData, problemStatement: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-[#0096a4]/20 outline-none resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Abstract</label>
                    <textarea rows={8} required value={formData.abstract} onChange={(e) => setFormData({...formData, abstract: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-[#0096a4]/20 outline-none resize-none" />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2 bg-[#1a365d] hover:bg-[#0f213b] text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all disabled:opacity-50">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                    </button>
                  </div>
               </form>
             ) : (
               <div className="space-y-8">
                 <div>
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Authors</h3>
                   <p className="text-sm font-bold text-slate-800">{pub.authors?.join(', ') || 'N/A'}</p>
                 </div>
                 
                 {pub.problemStatement && (
                   <div>
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Problem Statement</h3>
                     <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{pub.problemStatement}</p>
                   </div>
                 )}

                 <div>
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Abstract</h3>
                   <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{pub.abstract}</p>
                 </div>
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}
// app/admin/certificates/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, LayoutGrid, List as ListIcon, MoreVertical, 
  Edit, Trash2, Loader2, Image as ImageIcon, FileText, UploadCloud, X,
  AlertCircle
} from 'lucide-react';
import { getCertificateTemplates, createCertificateTemplate, deleteCertificateTemplate } from '@/app/lib/utilities/apis';

export default function CertificatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [createData, setCreateData] = useState({ name: '' });
  const [bgFile, setBgFile] = useState<File | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await getCertificateTemplates();
      setTemplates(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bgFile || !createData.name) return alert('Name and Background Image are required');
    
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('name', createData.name);
      formData.append('template', bgFile);
      formData.append('background', bgFile);
      
      
      const defaultPlaceholders = [
        { id: `text_${Date.now()}_1`, type: 'text', key: '{{name}}', x: 600, y: 400, fontSize: '60px', fontColor: '#1a365d', align: 'center', fontFamily: 'serif' },
        { id: `text_${Date.now()}_2`, type: 'text', key: '{{eventName}}', x: 600, y: 500, fontSize: '40px', fontColor: '#555555', align: 'center', fontFamily: 'sans-serif' },
        { id: `text_${Date.now()}_3`, type: 'text', key: '{{date}}', x: 600, y: 600, fontSize: '30px', fontColor: '#555555', align: 'center', fontFamily: 'sans-serif' },
        { id: `qr_${Date.now()}_4`, type: 'qr', key: '{{id}}', x: 600, y: 800, fontSize: '150px', fontColor: '#000000', align: 'center', fontFamily: 'sans-serif' }
      ];
      
      formData.append('placeholders', JSON.stringify(defaultPlaceholders)); 

      const res = await createCertificateTemplate(formData);
      setIsCreateModalOpen(false);
      setCreateData({ name: '' });
      setBgFile(null);
      
      router.push(`/admin/certificates/${res.template?.id || res.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create template');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this template?")) {
      try {
        await deleteCertificateTemplate(id);
        setActiveDropdown(null);
        fetchTemplates();
      } catch (err: any) {
        alert(err.message || 'Failed to delete template');
      }
    }
  };

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-white min-h-full rounded-3xl p-2 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a365d]">Certificate Templates</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage designs and dynamic coordinates for event certificates</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a365d] to-[#0096a4] hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-50 p-2 rounded-2xl">
        <div className="flex items-center gap-2 p-1">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-[#0096a4] shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-[#0096a4] shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="relative w-full md:w-80 px-1 pb-1 md:pb-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading templates...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-red-500 text-sm font-medium bg-red-50 rounded-2xl border border-red-100">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-80" />
          {error}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1a365d] mb-1">No Templates Found</h3>
          <p className="text-sm text-slate-500 mb-6">Start by uploading a blank certificate background.</p>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-[#0096a4]/30 hover:bg-[#0096a4]/5 text-[#1a365d] px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create Template
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map(template => {
            const isDropdownOpen = activeDropdown === template.id;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                key={template.id}
                className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,150,164,0.08)] hover:border-[#0096a4]/20 transition-all group overflow-hidden relative"
              >
                <div onClick={() => router.push(`/admin/certificates/${template.id}`)} className="aspect-[1.414] bg-slate-100 relative cursor-pointer border-b border-slate-100">
                  {template.backgroundUrl ? (
                    <img src={template.backgroundUrl} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-300"><ImageIcon className="w-10 h-10" /></div>
                  )}
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveDropdown(isDropdownOpen ? null : template.id); }}
                    className="p-1.5 bg-white/90 backdrop-blur-sm text-slate-600 hover:text-[#1a365d] rounded-xl shadow-sm transition-colors border border-slate-200/50"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-50"
                      >
                        <div className="p-1.5 space-y-0.5">
                          <button onClick={() => router.push(`/admin/certificates/${template.id}`)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0096a4] rounded-lg transition-colors">
                            <Edit className="w-4 h-4" /> Edit Canvas
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-2" />
                          <button onClick={() => handleDelete(template.id)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div onClick={() => router.push(`/admin/certificates/${template.id}`)} className="p-5 cursor-pointer">
                  <h3 className="text-base font-bold text-[#1a365d] truncate mb-1">{template.name}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium mt-3">
                    <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{template.placeholders?.length || 0} Elements Placed</span>
                    <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Template Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Elements</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTemplates.map(template => (
                  <tr key={template.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4" onClick={() => router.push(`/admin/certificates/${template.id}`)}>
                      <div className="flex items-center gap-4 cursor-pointer">
                        <div className="w-16 h-10 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                          {template.backgroundUrl && <img src={template.backgroundUrl} className="w-full h-full object-cover" alt="thumb" />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#1a365d] group-hover:text-[#0096a4] transition-colors">{template.name}</div>
                          <div className="text-xs text-slate-400 font-mono mt-0.5">{template.id.split('-')[0]}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-bold text-slate-600">{template.placeholders?.length || 0} Placed</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {new Date(template.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button onClick={() => router.push(`/admin/certificates/${template.id}`)} className="p-2 text-slate-400 hover:text-[#0096a4] hover:bg-[#0096a4]/10 rounded-lg inline-flex transition-colors mr-2">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(template.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg inline-flex transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#1a365d]/40 backdrop-blur-sm" onClick={() => !isSubmitting && setIsCreateModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col">
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-white">
                <h3 className="text-xl font-bold text-[#1a365d]">Upload Base Certificate</h3>
                <button disabled={isSubmitting} onClick={() => setIsCreateModalOpen(false)} className="p-2 text-slate-400 hover:text-[#1a365d] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8">
                
                <div className="mb-6 p-4 bg-[#0096a4]/10 rounded-xl border border-[#0096a4]/20 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0096a4] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
                  <p className="text-sm text-[#0096a4] font-semibold leading-relaxed">
                    Upload your blank certificate background here. <br/>In the <span className="font-bold text-[#1a365d]">next step</span>, you will visually drag & drop where the names, dates, and QR codes should appear!
                  </p>
                </div>

                <form id="createTemplateForm" onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Template Name</label>
                    <input 
                      type="text" required value={createData.name} onChange={(e) => setCreateData({ name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                      placeholder="e.g. Annual Workshop Template 2026"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Blank Background Image (PNG/JPG)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#0096a4]/40 hover:bg-[#0096a4]/5 transition-colors relative group bg-slate-50">
                      <input 
                        type="file" accept="image/png, image/jpeg" required id="bgUpload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={(e) => setBgFile(e.target.files ? e.target.files[0] : null)}
                      />
                      <div className="flex flex-col items-center pointer-events-none">
                        {bgFile ? (
                           <div className="text-[#0096a4] flex flex-col items-center">
                             <ImageIcon className="w-8 h-8 mb-2" />
                             <span className="text-sm font-bold">{bgFile.name}</span>
                             <span className="text-xs font-semibold mt-1 text-slate-500">Ready to proceed</span>
                           </div>
                        ) : (
                          <>
                            <UploadCloud className="w-10 h-10 text-slate-300 mb-3 group-hover:text-[#0096a4] transition-colors" />
                            <span className="text-sm font-bold text-[#1a365d]">Upload blank certificate</span>
                            <span className="text-xs text-slate-400 font-semibold mt-2">A4 Landscape format recommended</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              
              <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                <button type="button" disabled={isSubmitting} onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-5 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm">
                  Cancel
                </button>
                <button type="submit" form="createTemplateForm" disabled={isSubmitting || !bgFile || !createData.name} className="flex-1 px-5 py-3.5 bg-[#1a365d] hover:bg-[#0f213b] text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md">
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : 'Proceed to Canvas Editor'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
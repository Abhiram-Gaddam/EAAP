// app/(admin)/inquiries/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Loader2, AlertCircle, Clock, CheckCircle2, 
  Trash2, Mail, User, X
} from 'lucide-react';
import { getAdminInquiries, updateInquiryStatus, deleteInquiry } from '@/app/lib/utilities/userApis';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [activeTab]);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminInquiries(activeTab);
      setInquiries(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load inquiries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'NEW' | 'IN_PROGRESS' | 'RESOLVED') => {
    try {
      setIsProcessing(true);
      await updateInquiryStatus(id, newStatus);
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
      await fetchInquiries();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this inquiry?")) {
      try {
        setIsProcessing(true);
        await deleteInquiry(id);
        setIsModalOpen(false);
        await fetchInquiries();
      } catch (err: any) {
        alert(err.message || 'Failed to delete inquiry');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const openInquiry = (inq: any) => {
    setSelectedInquiry(inq);
    setIsModalOpen(true);
  };

  const StatusPill = ({ status }: { status: string }) => {
    if (status === 'NEW') return <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-medium uppercase tracking-widest">New</span>;
    if (status === 'IN_PROGRESS') return <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-medium uppercase tracking-widest">In Progress</span>;
    if (status === 'RESOLVED') return <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-medium uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
    return null;
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-12">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-2xl font-medium text-[#1a365d] tracking-tight">Support Inquiries</h1>
          <p className="text-sm font-normal text-slate-500 mt-1 max-w-xl">
            Manage and respond to messages submitted through the public contact form.
          </p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar border-b border-slate-200 pb-px">
        {['ALL', 'NEW', 'IN_PROGRESS', 'RESOLVED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm transition-all whitespace-nowrap border-b-2 ${
              activeTab === tab 
                ? 'border-[#0096a4] text-[#0096a4] font-medium' 
                : 'border-transparent text-slate-500 hover:text-slate-800 font-normal'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="w-full h-[40vh] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
          <p className="text-slate-500 font-medium text-sm tracking-wide">Loading inquiries...</p>
        </div>
      ) : error ? (
        <div className="w-full bg-white min-h-[30vh] rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center p-8 shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-400 mb-4 stroke-[1.5]" />
          <p className="text-slate-600 font-medium text-sm">{error}</p>
        </div>
      ) : inquiries.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap">Sender</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap">Subject</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inquiries.map((inq: any) => (
                  <tr key={inq.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => openInquiry(inq)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0096a4]/10 text-[#0096a4] flex items-center justify-center shrink-0 font-medium">
                          {inq.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1a365d]">{inq.name}</p>
                          <p className="text-xs font-normal text-slate-500">{inq.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800 line-clamp-1">{inq.subject}</p>
                      <p className="text-xs font-normal text-slate-500 line-clamp-1 mt-0.5">{inq.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={inq.status} />
                    </td>
                    <td className="px-6 py-4 text-sm font-normal text-slate-600">
                      {new Date(inq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm font-medium text-[#0096a4] hover:text-[#007a86] transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-16 text-center flex flex-col items-center">
          <MessageSquare className="w-12 h-12 text-slate-200 mb-4 stroke-[1.5]" />
          <p className="text-base font-medium text-[#1a365d] mb-2">No inquiries found</p>
          <p className="text-sm font-normal text-slate-500">There are no messages matching this status filter.</p>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isProcessing && setIsModalOpen(false)} className="absolute inset-0 bg-[#0f213b]/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
              
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium text-[#1a365d]">Inquiry Details</h3>
                  <StatusPill status={selectedInquiry.status} />
                </div>
                <button disabled={isProcessing} onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-8">
                
                <div className="flex items-start gap-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <User className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <div>
                    <p className="text-base font-medium text-slate-800">{selectedInquiry.name}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-1 text-sm font-normal text-slate-500">
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedInquiry.email}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(selectedInquiry.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Subject</h4>
                  <p className="text-base font-medium text-[#1a365d]">{selectedInquiry.subject}</p>
                </div>

                <div>
                  <h4 className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Message</h4>
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 text-sm font-normal text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>
                
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <button 
                  onClick={() => handleDelete(selectedInquiry.id)} 
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4 stroke-[1.5]" /> Delete
                </button>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {selectedInquiry.status !== 'IN_PROGRESS' && (
                    <button 
                      onClick={() => handleStatusUpdate(selectedInquiry.id, 'IN_PROGRESS')}
                      disabled={isProcessing}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {selectedInquiry.status !== 'RESOLVED' && (
                    <button 
                      onClick={() => handleStatusUpdate(selectedInquiry.id, 'RESOLVED')}
                      disabled={isProcessing}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 shadow-sm"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
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
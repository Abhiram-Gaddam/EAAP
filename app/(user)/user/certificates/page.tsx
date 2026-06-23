// app/(user)/certificates/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Download, Loader2, AlertCircle, CalendarDays, 
  ShieldCheck, FileBadge, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { getUserCertificates, renderEventCertificate } from '@/app/lib/utilities/userApis';
import CertificatePreviewModal from '@/app/(admin)/components/certificateModel';
 
export default function UserCertificatesPage() {
  const [data, setData] = useState<{ membership: any, events: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Rendering State
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [renderData, setRenderData] = useState<any>(null);
  const [activeRenderId, setActiveRenderId] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setIsLoading(true);
      const res = await getUserCertificates();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load certificates.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCertificate = async (eventId: string, title: string) => {
    try {
      setActiveRenderId(eventId);
      const res = await renderEventCertificate(eventId);
      setRenderData(res);
      setPreviewTitle(`${title} Certificate`);
      setIsRenderModalOpen(true);
    } catch (err: any) {
      alert(err.message || "Failed to load certificate rendering data.");
    } finally {
      setActiveRenderId(null);
    }
  };

  // For the membership certificate (assuming it uses the same render logic, 
  // or a static URL if provided. If static, you'd just window.open it)
  const handleDownloadMembership = () => {
    // If you have a specific endpoint for rendering the membership cert, call it here.
    alert("Membership certificate generation logic goes here.");
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
        <p className="text-slate-500 font-medium text-sm tracking-wide">Loading your achievements...</p>
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

  const hasMembershipCert = data?.membership && data.membership.status === 'APPROVED';
  const hasEventCerts = data?.events && data.events.length > 0;

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-10 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-2">
        <div>
          <h1 className="text-2xl font-medium text-slate-800 tracking-tight">My Certificates</h1>
          <p className="text-sm font-normal text-slate-500 mt-1 max-w-2xl">
            Access and download your official membership credentials and event participation certificates.
          </p>
        </div>
      </div>

      {!hasMembershipCert && !hasEventCerts ? (
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-16 text-center flex flex-col items-center shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
          <FileBadge className="w-12 h-12 text-slate-300 mb-4 stroke-[1.5]" />
          <p className="text-base font-medium text-slate-700 mb-2">No certificates earned yet</p>
          <p className="text-sm font-normal text-slate-500 max-w-md">
            Attend upcoming events, workshops, or activate your membership to start earning official certificates.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Membership Certificate Section (Premium Look) */}
          {hasMembershipCert && (
            <section>
              <h2 className="text-lg font-medium text-slate-800 mb-5 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500 stroke-[1.5]" /> Official Membership
              </h2>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl bg-gradient-to-br from-[#1a365d] to-[#12284b] rounded-[2rem] p-1 relative overflow-hidden shadow-[0_8px_30px_rgba(26,54,93,0.15)]"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#0096a4]/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                <div className="bg-[#1a365d]/40 backdrop-blur-sm rounded-[1.8rem] p-6 sm:p-8 border border-white/10 relative z-10 flex flex-col sm:flex-row items-center gap-8">
                  
                  {/* Left Icon Area */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0096a4] to-teal-500 flex items-center justify-center shrink-0 shadow-inner border border-white/20">
                    <Award className="w-10 h-10 text-white stroke-[1.5]" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <p className="text-[10px] font-medium text-[#0096a4] uppercase tracking-widest mb-1.5">Active Member</p>
                    <h3 className="text-2xl font-medium text-white tracking-tight truncate mb-2">
                      {data.membership.memberName}
                    </h3>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-normal text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-400"></span> ID: {data.membership.memberId}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-slate-400"></span> Issued: {new Date(data.membership.issueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 w-full sm:w-auto">
                    <button 
                      onClick={handleDownloadMembership}
                      className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#1a365d] hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Download className="w-4 h-4 stroke-[1.5]" /> Get Certificate
                    </button>
                  </div>

                </div>
              </motion.div>
            </section>
          )}

          {/* Event Certificates Section */}
          {hasEventCerts && (
            <section>
              <h2 className="text-lg font-medium text-slate-800 mb-5 flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-[#0096a4] stroke-[1.5]" /> Event Participations
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.events.map((evt: any, index: number) => {
                  const isRendering = activeRenderId === evt.eventId;
                  
                  return (
                    <motion.div 
                      key={evt.eventId}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,150,164,0.06)] hover:border-[#0096a4]/20 transition-all flex flex-col group"
                    >
                      {/* Top Info */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#0096a4] group-hover:bg-[#0096a4]/5 transition-colors shrink-0">
                          <CalendarDays className="w-6 h-6 stroke-[1.5]" />
                        </div>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 text-[10px] font-medium uppercase tracking-widest border border-emerald-100/50">
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" /> Issued
                        </span>
                      </div>
                      
                      {/* Title & Details */}
                      <h3 className="text-lg font-medium text-slate-800 mb-4 line-clamp-2 leading-snug group-hover:text-[#0096a4] transition-colors">
                        {evt.eventTitle}
                      </h3>
                      
                      <div className="mt-auto space-y-5">
                        <p className="text-sm font-normal text-slate-500">
                          Awarded on {new Date(evt.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        
                        <div className="pt-5 border-t border-slate-100">
                          <button 
                            onClick={() => handleDownloadCertificate(evt.eventId, evt.eventTitle)}
                            disabled={isRendering || !!activeRenderId}
                            className="w-full py-2.5 flex items-center justify-center gap-2 bg-slate-50 hover:bg-[#0096a4] text-[#0096a4] hover:text-white border border-slate-100 hover:border-transparent rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                          >
                            {isRendering ? (
                              <><Loader2 className="w-4 h-4 stroke-[1.5] animate-spin" /> Preparing...</>
                            ) : (
                              <><Download className="w-4 h-4 stroke-[1.5]" /> View & Download</>
                            )}
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  )
                })}
              </div>
            </section>
          )}

        </div>
      )}

      {/* Render Modal */}
      <AnimatePresence>
        {isRenderModalOpen && (
          <CertificatePreviewModal 
            isOpen={isRenderModalOpen}
            onClose={() => { setIsRenderModalOpen(false); setRenderData(null); }}
            previewData={renderData}
            isLoading={false} // Loading is handled on the button before opening
            title={previewTitle}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
// app/admin/applications/[id]/page.tsx
"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Check, X, Download, ExternalLink, User, Phone, Mail, 
  MapPin, Briefcase, GraduationCap, Building2, Clock, FileText, Image as ImageIcon, Loader2
} from 'lucide-react';
import { getApplicationDetails, updateApplicationStatus } from '@/app/lib/utilities/apis';
 
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: 'numeric', hour12: true
  }).format(date);
};

const getDocumentInfo = (type: string) => {
  switch (type) {
    case 'HIGHEST_EDU_CERTIFICATE': return { title: 'Degree Certificate', icon: FileText };
    case 'EXPERIENCE_CERTIFICATE': return { title: 'Experience Letter', icon: FileText };
    case 'PHOTO': return { title: 'Passport Photograph', icon: ImageIcon };
    case 'GOV_ID': return { title: 'Government ID Proof', icon: FileText };
    default: return { title: 'Document', icon: FileText };
  }
};

export default function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      setIsLoading(true);
      const res = await getApplicationDetails(id);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load application details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: 'APPROVED' | 'REJECTED') => {
    try {
      setIsUpdating(true);
      await updateApplicationStatus(id, newStatus);
      await fetchApplication();
    } catch (err: any) {
      alert(err.message || `Failed to update status to ${newStatus}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading application details...</p>
      </div>
    );
  }

  if (error || !data?.application) {
    return (
      <div className="w-full bg-white min-h-full max-w-6xl mx-auto p-8 rounded-3xl border border-red-100 flex flex-col items-center text-center">
        <X className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Application Not Found</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link href="/admin/applications" className="px-4 py-2 bg-[#1a365d] text-white rounded-lg font-medium">
          Back to Applications
        </Link>
      </div>
    );
  }

  const { application, documents } = data;
  const { User: user } = application;
  const status = application.status;

  return (
    <div className="w-full bg-white min-h-full p-4">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <Link href="/admin/applications" className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors shrink-0 self-start md:self-auto">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-[#1a365d]">Applicant: {user.fullName}</h1>
            <span className={`inline-flex px-3 py-1 rounded-lg border text-xs font-semibold ${
              status === 'PENDING_APPROVAL' ? 'text-amber-700 bg-amber-50 border-amber-200/60' : 
              status === 'APPROVED' ? 'text-emerald-700 bg-emerald-50 border-emerald-200/60' : 
              'text-red-700 bg-red-50 border-red-200/60'
            }`}>
              {status}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1.5 flex items-center gap-2">
            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">ID: {application.id}</span>
            Submitted on {formatDate(application.created_at)}
          </p>
        </div>
        
        <div className="md:ml-auto flex items-center gap-3 mt-4 md:mt-0">
          {status === 'PENDING_APPROVAL' && (
            <>
              <button 
                onClick={() => handleStatusUpdate('REJECTED')}
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 bg-white hover:bg-red-50 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                Reject
              </button>
              <button 
                onClick={() => handleStatusUpdate('APPROVED')}
                disabled={isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0096a4] hover:bg-[#00828f] text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Approve
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-white">
              <h2 className="text-base font-semibold text-[#1a365d]">Personal Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-2 uppercase tracking-wide"><User className="w-4 h-4 text-[#0096a4]" /> Full Name</p>
                <p className="text-sm text-slate-800 font-medium pl-6">{user.fullName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-2 uppercase tracking-wide"><Mail className="w-4 h-4 text-[#0096a4]" /> Email Address</p>
                <p className="text-sm text-slate-800 font-medium pl-6">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-2 uppercase tracking-wide"><Phone className="w-4 h-4 text-[#0096a4]" /> Phone Number</p>
                <p className="text-sm text-slate-800 font-medium pl-6">{application.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-2 uppercase tracking-wide"><MapPin className="w-4 h-4 text-[#0096a4]" /> City / District</p>
                <p className="text-sm text-slate-800 font-medium pl-6">{application.cityDistrict || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-white">
              <h2 className="text-base font-semibold text-[#1a365d]">Professional Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-2 uppercase tracking-wide"><GraduationCap className="w-4 h-4 text-[#0096a4]" /> Highest Qualification</p>
                <p className="text-sm text-slate-800 font-medium pl-6">{application.highestQualification}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-2 uppercase tracking-wide"><Briefcase className="w-4 h-4 text-[#0096a4]" /> Current Designation</p>
                <p className="text-sm text-slate-800 font-medium pl-6">{application.currentDesignation}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-2 uppercase tracking-wide"><Building2 className="w-4 h-4 text-[#0096a4]" /> Current Hospital / Clinic</p>
                <p className="text-sm text-slate-800 font-medium pl-6">{application.currentHospital}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-2 uppercase tracking-wide"><Clock className="w-4 h-4 text-[#0096a4]" /> Clinical Experience</p>
                <p className="text-sm text-slate-800 font-medium pl-6">{application.clinicalEmbryologyExpYrs} Years</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Documents */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-white">
              <h2 className="text-base font-semibold text-[#1a365d]">Uploaded Documents</h2>
            </div>
            <div className="p-6 space-y-4">
              
              {documents && documents.length > 0 ? (
                documents.map((doc: any) => {
                  const info = getDocumentInfo(doc.documentType);
                  const isImage = doc.fileUrl.match(/\.(jpeg|jpg|gif|png)$/i);
                  
                  return (
                    <div key={doc.id} className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:border-[#0096a4]/30 hover:bg-[#0096a4]/5 transition-colors group">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 group-hover:text-[#0096a4] group-hover:bg-white border border-slate-100 flex items-center justify-center shrink-0 transition-colors shadow-sm">
                        <info.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1a365d] group-hover:text-[#0096a4] truncate transition-colors">{info.title}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{isImage ? 'IMAGE' : 'FILE'}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a 
                          href={doc.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-[#0096a4] rounded-lg hover:bg-white transition-colors border border-transparent hover:border-[#0096a4]/20 shadow-sm"
                          title="View Document"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-medium">No documents uploaded.</p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
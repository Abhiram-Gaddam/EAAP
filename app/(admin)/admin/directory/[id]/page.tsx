// app/admin/directory/[id]/page.tsx
"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Mail, Phone, MapPin, Building2, Briefcase, 
  GraduationCap, Clock, ShieldCheck, Loader2, Calendar, FileText
} from 'lucide-react';
import { getMemberProfile } from '@/app/lib/utilities/apis';

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(date);
};

export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [member, setMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getMemberProfile(id);
      setMember(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load member profile.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading member profile...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="w-full bg-white min-h-full max-w-4xl mx-auto p-8 rounded-3xl border border-red-100 flex flex-col items-center text-center">
        <ShieldCheck className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Profile Not Found</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link href="/admin/directory" className="px-4 py-2 bg-[#1a365d] text-white rounded-lg font-medium">
          Back to Directory
        </Link>
      </div>
    );
  }

  const details = member.MembershipDetails?.[0] || {};
  const initials = member.fullName?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="w-full bg-white min-h-full max-w-5xl mx-auto p-2">
      
      <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden mb-8 relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-[#1a365d] to-[#0096a4] opacity-90" />
        
        <div className="px-6 pb-6 pt-16 relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="w-28 h-28 rounded-2xl bg-white p-1.5 shadow-lg shrink-0 z-10">
            <div className="w-full h-full rounded-xl bg-slate-50 flex items-center justify-center text-[#1a365d] text-3xl font-bold border border-slate-100">
              {initials}
            </div>
          </div>
          
          <div className="flex-1 text-center sm:text-left mb-2 z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a365d] flex items-center justify-center sm:justify-start gap-2">
              {member.fullName}
              {member.role === 'ACTIVE_MEMBER' && <ShieldCheck className="w-6 h-6 text-emerald-500" />}
            </h1>
            <p className="text-slate-500 font-medium mt-1">{details.currentDesignation || 'Member'}</p>
          </div>
          
          <div className="flex gap-3 z-10">
            <Link href="/admin/directory" className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
              Directory
            </Link>
            <button className="px-4 py-2 bg-[#1a365d] text-white rounded-xl text-sm font-semibold hover:bg-[#0f213b] transition-colors shadow-sm">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
            <h2 className="text-base font-semibold text-[#1a365d] mb-6">Contact Information</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#0096a4] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-sm font-medium text-slate-800 break-all">{member.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#0096a4] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
                  <p className="text-sm font-medium text-slate-800">{details.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#0096a4] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-sm font-medium text-slate-800">{details.cityDistrict || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
            <h2 className="text-base font-semibold text-[#1a365d] mb-6">Membership Status</h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Account Role</span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/50">
                  {member.role.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Board Status</span>
                <span className="text-sm font-semibold text-slate-800">{details.status || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Member Since</span>
                <span className="text-sm font-semibold text-slate-800">{formatDate(details.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 bg-white">
              <h2 className="text-base font-semibold text-[#1a365d]">Professional Profile</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
              <div>
                <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-wider"><Building2 className="w-4 h-4 text-slate-400" /> Current Workplace</p>
                <p className="text-sm text-slate-800 font-medium pl-6">{details.currentHospital || 'Not Specified'}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-wider"><Briefcase className="w-4 h-4 text-slate-400" /> Designation</p>
                <p className="text-sm text-slate-800 font-medium pl-6">{details.currentDesignation || 'Not Specified'}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-wider"><GraduationCap className="w-4 h-4 text-slate-400" /> Qualification</p>
                <p className="text-sm text-slate-800 font-medium pl-6">{details.highestQualification || 'Not Specified'}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-wider"><Clock className="w-4 h-4 text-slate-400" /> Experience</p>
                <p className="text-sm text-slate-800 font-medium pl-6">{details.clinicalEmbryologyExpYrs ? `${details.clinicalEmbryologyExpYrs} Years` : 'Not Specified'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-[#1a365d]">Related Documents</h2>
                <button className="text-sm font-medium text-[#0096a4] hover:text-[#1a365d] transition-colors">View All</button>
             </div>
             <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 border-dashed">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Membership Certificate</p>
                  <p className="text-xs text-slate-400 mt-0.5">Auto-generated on approval</p>
                </div>
                <button className="text-sm font-medium text-[#0096a4] hover:underline px-2">Download</button>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
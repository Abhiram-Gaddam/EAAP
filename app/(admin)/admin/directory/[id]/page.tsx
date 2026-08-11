// // app/admin/directory/[id]/page.tsx
// "use client";

// import { useState, useEffect, use } from 'react';
// import Link from 'next/link';
// import { 
//   ArrowLeft, Mail, Phone, MapPin, Building2, Briefcase, 
//   GraduationCap, Clock, ShieldCheck, Loader2, Calendar, FileText
// } from 'lucide-react';
// import { getMemberProfile } from '@/app/lib/utilities/apis';

// const formatDate = (dateString: string) => {
//   if (!dateString) return 'N/A';
//   const date = new Date(dateString);
//   return new Intl.DateTimeFormat('en-US', {
//     month: 'short', day: 'numeric', year: 'numeric'
//   }).format(date);
// };

// export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = use(params);
  
//   const [member, setMember] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchProfile();
//   }, [id]);

//   const fetchProfile = async () => {
//     try {
//       setIsLoading(true);
//       const data = await getMemberProfile(id);
//       setMember(data);
//     } catch (err: any) {
//       setError(err.message || 'Failed to load member profile.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="w-full h-[60vh] flex flex-col items-center justify-center">
//         <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4" />
//         <p className="text-slate-500 font-medium">Loading member profile...</p>
//       </div>
//     );
//   }

//   if (error || !member) {
//     return (
//       <div className="w-full bg-white min-h-full max-w-4xl mx-auto p-8 rounded-3xl border border-red-100 flex flex-col items-center text-center">
//         <ShieldCheck className="w-12 h-12 text-red-400 mb-4" />
//         <h2 className="text-xl font-semibold text-slate-800 mb-2">Profile Not Found</h2>
//         <p className="text-slate-500 mb-6">{error}</p>
//         <Link href="/admin/directory" className="px-4 py-2 bg-[#1a365d] text-white rounded-lg font-medium">
//           Back to Directory
//         </Link>
//       </div>
//     );
//   }

//   const details = member.MembershipDetails?.[0] || {};
//   const initials = member.fullName?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

//   return (
//     <div className="w-full bg-white min-h-full max-w-5xl mx-auto p-2">
      
//       <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden mb-8 relative">
//         <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-[#1a365d] to-[#0096a4] opacity-90" />
        
//         <div className="px-6 pb-6 pt-16 relative flex flex-col sm:flex-row items-center sm:items-end gap-6">
//           <div className="w-28 h-28 rounded-2xl bg-white p-1.5 shadow-lg shrink-0 z-10">
//             <div className="w-full h-full rounded-xl bg-slate-50 flex items-center justify-center text-[#1a365d] text-3xl font-bold border border-slate-100">
//               {initials}
//             </div>
//           </div>
          
//           <div className="flex-1 text-center sm:text-left mb-2 z-10">
//             <h1 className="text-2xl sm:text-3xl font-bold text-[#1a365d] flex items-center justify-center sm:justify-start gap-2">
//               {member.fullName}
//               {member.role === 'ACTIVE_MEMBER' && <ShieldCheck className="w-6 h-6 text-emerald-500" />}
//             </h1>
//             <p className="text-slate-500 font-medium mt-1">{details.currentDesignation || 'Member'}</p>
//           </div>
          
//           <div className="flex gap-3 z-10">
//             <Link href="/admin/directory" className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
//               Directory
//             </Link>
//             <button className="px-4 py-2 bg-[#1a365d] text-white rounded-xl text-sm font-semibold hover:bg-[#0f213b] transition-colors shadow-sm">
//               Edit Profile
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
//         <div className="lg:col-span-1 space-y-6">
//           <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
//             <h2 className="text-base font-semibold text-[#1a365d] mb-6">Contact Information</h2>
//             <div className="space-y-5">
//               <div className="flex items-start gap-3">
//                 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#0096a4] shrink-0">
//                   <Mail className="w-4 h-4" />
//                 </div>
//                 <div>
//                   <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
//                   <p className="text-sm font-medium text-slate-800 break-all">{member.email}</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#0096a4] shrink-0">
//                   <Phone className="w-4 h-4" />
//                 </div>
//                 <div>
//                   <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
//                   <p className="text-sm font-medium text-slate-800">{details.phone || 'N/A'}</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#0096a4] shrink-0">
//                   <MapPin className="w-4 h-4" />
//                 </div>
//                 <div>
//                   <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
//                   <p className="text-sm font-medium text-slate-800">{details.cityDistrict || 'N/A'}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
//             <h2 className="text-base font-semibold text-[#1a365d] mb-6">Membership Status</h2>
//             <div className="space-y-5">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-500">Account Role</span>
//                 <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200/50">
//                   {member.role.replace('_', ' ')}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-500">Board Status</span>
//                 <span className="text-sm font-semibold text-slate-800">{details.status || 'N/A'}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm font-medium text-slate-500">Member Since</span>
//                 <span className="text-sm font-semibold text-slate-800">{formatDate(details.created_at)}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
//             <div className="px-6 py-5 border-b border-slate-50 bg-white">
//               <h2 className="text-base font-semibold text-[#1a365d]">Professional Profile</h2>
//             </div>
//             <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-8">
//               <div>
//                 <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-wider"><Building2 className="w-4 h-4 text-slate-400" /> Current Workplace</p>
//                 <p className="text-sm text-slate-800 font-medium pl-6">{details.currentHospital || 'Not Specified'}</p>
//               </div>
//               <div>
//                 <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-wider"><Briefcase className="w-4 h-4 text-slate-400" /> Designation</p>
//                 <p className="text-sm text-slate-800 font-medium pl-6">{details.currentDesignation || 'Not Specified'}</p>
//               </div>
//               <div>
//                 <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-wider"><GraduationCap className="w-4 h-4 text-slate-400" /> Qualification</p>
//                 <p className="text-sm text-slate-800 font-medium pl-6">{details.highestQualification || 'Not Specified'}</p>
//               </div>
//               <div>
//                 <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-wider"><Clock className="w-4 h-4 text-slate-400" /> Experience</p>
//                 <p className="text-sm text-slate-800 font-medium pl-6">{details.clinicalEmbryologyExpYrs ? `${details.clinicalEmbryologyExpYrs} Years` : 'Not Specified'}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6">
//              <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-base font-semibold text-[#1a365d]">Related Documents</h2>
//                 <button className="text-sm font-medium text-[#0096a4] hover:text-[#1a365d] transition-colors">View All</button>
//              </div>
//              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 border-dashed">
//                 <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400">
//                   <FileText className="w-5 h-5" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium text-slate-700">Membership Certificate</p>
//                   <p className="text-xs text-slate-400 mt-0.5">Auto-generated on approval</p>
//                 </div>
//                 <button className="text-sm font-medium text-[#0096a4] hover:underline px-2">Download</button>
//              </div>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Phone, MapPin, Building2,
  GraduationCap, Clock, ShieldCheck, Loader2, FileText,
  CheckCircle2, Edit3, ShieldAlert, Award
} from 'lucide-react';
import { getMemberProfile } from '@/app/lib/utilities/apis';

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
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
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f4f7f9] to-white">
        <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
        <p className="text-[#1a365d] font-medium text-xs tracking-[0.2em] uppercase">Loading profile record</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#f4f7f9] to-white p-6">
        <div className="max-w-sm w-full bg-white/80 backdrop-blur-sm p-10 rounded-2xl border border-slate-200/70 flex flex-col items-center text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.15)]">
          <ShieldAlert className="w-10 h-10 text-red-400 stroke-[1.5] mb-5" />
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Profile not found</h2>
          <p className="text-sm font-normal text-slate-500 mb-8 leading-relaxed">{error}</p>
          <Link href="/admin/directory" className="w-full py-3 bg-gradient-to-r from-[#1a365d] to-[#234a7a] hover:from-[#12284b] hover:to-[#1a365d] text-white rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" /> Return to directory
          </Link>
        </div>
      </div>
    );
  }

  const details = member.MembershipDetails?.[0] || {};
  const initials = member.fullName?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
  const isActive = details.status === 'APPROVED' || member.role === 'ACTIVE_MEMBER';

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#f4f7f9] via-[#f4f7f9] to-white relative">

      {/* Ambient tint, no solid fills */}
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[420px] bg-gradient-to-b from-[#0096a4]/[0.06] via-transparent to-transparent" />

      <div className="relative   px-6 md:px-10 py-8 md:py-12">

        <Link href="/admin/directory" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-[#0096a4] transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2]" /> Directory
        </Link>

        {/* Identity header — translucent glass, gradient wash instead of solid navy */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="relative rounded-2xl overflow-hidden mb-8 border border-slate-200/70 bg-white/70 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d]/[0.04] via-transparent to-[#0096a4]/[0.06]" />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a365d] to-[#0096a4] flex items-center justify-center shrink-0 shadow-[0_8px_20px_-8px_rgba(0,150,164,0.5)]">
                <span className="text-lg font-semibold text-white tracking-tight">{initials}</span>
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-semibold text-[#1a365d] tracking-tight">{member.fullName}</h1>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1 border ${isActive ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/60 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {isActive && <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />}
                    {member.MembershipDetails.status || 'Pending'}
                  </span>
                </div>
                <p className="text-sm font-normal text-slate-500 mt-1">
                  {member.MembershipDetails.currentDesignation || 'Registered Member'} &nbsp;&middot;&nbsp; {member.role.replace('_', ' ')}
                </p>
              </div>
            </div>

            <button className="px-5 py-2.5 bg-gradient-to-r from-[#0096a4] to-[#00b3c4] hover:from-[#007a86] hover:to-[#0096a4] text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 shrink-0 self-start md:self-auto shadow-[0_8px_20px_-10px_rgba(0,150,164,0.6)]">
              <Edit3 className="w-3.5 h-3.5 stroke-[2]" /> Edit profile
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* Left rail */}
          <motion.aside
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
            className="space-y-4"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/70 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4">Contact</p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0096a4]/10 to-[#0096a4]/[0.03] flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5 text-[#0096a4] stroke-[1.5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{member.email}</p>
                    <p className="text-[11px] text-slate-400">Email</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0096a4]/10 to-[#0096a4]/[0.03] flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-[#0096a4] stroke-[1.5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{member.MembershipDetails.phone || 'Not provided'}</p>
                    <p className="text-[11px] text-slate-400">Phone</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0096a4]/10 to-[#0096a4]/[0.03] flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#0096a4] stroke-[1.5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{member.MembershipDetails.cityDistrict || 'Not provided'}</p>
                    <p className="text-[11px] text-slate-400">Location</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/70 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <Clock className="w-4 h-4 text-[#0096a4] stroke-[1.5] mb-2" />
                <p className="text-lg font-semibold bg-gradient-to-br from-[#1a365d] to-[#0096a4] bg-clip-text text-transparent leading-tight">
                  {member.MembershipDetails.clinicalEmbryologyExpYrs ? `${member.MembershipDetails.clinicalEmbryologyExpYrs}y` : '0y'}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Experience</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/70 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                <Award className="w-4 h-4 text-[#1a365d] stroke-[1.5] mb-2" />
                <p className="text-sm font-semibold text-[#1a365d] leading-tight">
                  {formatDate(member.MembershipDetails.createdAt)}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Member since</p>
              </div>
            </div>
          </motion.aside>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/70 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-gradient-to-r from-slate-50/60 to-transparent">
                <Building2 className="w-4 h-4 text-[#0096a4] stroke-[1.5]" />
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Professional Affiliation</h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Current workplace</p>
                  <p className="text-sm font-medium text-slate-800">{member.MembershipDetails.currentHospital || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Current designation</p>
                  <p className="text-sm font-medium text-slate-800">{member.MembershipDetails.currentDesignation || 'Not specified'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Highest academic qualification</p>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100">
                    <GraduationCap className="w-4 h-4 text-[#0096a4] stroke-[1.5] shrink-0" />
                    <p className="text-sm font-medium text-slate-800">{member.MembershipDetails.highestQualification || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/70 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-gradient-to-r from-slate-50/60 to-transparent">
                <FileText className="w-4 h-4 text-[#0096a4] stroke-[1.5]" />
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Document Vault</h3>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/80 bg-gradient-to-br from-[#0096a4]/[0.04] to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0096a4]/15 to-[#0096a4]/5 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-[#0096a4] stroke-[1.5]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Official Membership Certificate</p>
                      <p className="text-xs font-normal text-slate-500 mt-0.5">System-generated credential</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-[#1a365d] rounded-lg text-sm font-medium hover:border-[#0096a4]/40 hover:bg-[#0096a4]/[0.03] transition-colors shrink-0">
                    View document
                  </button>
                </div>
              </div>
            </section>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
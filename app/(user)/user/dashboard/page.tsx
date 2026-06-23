"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarDays, Award, FileText, CreditCard, 
  Loader2, AlertCircle, ArrowRight, BookOpen, Clock, XCircle, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { getUserDashboard } from '@/app/lib/utilities/userApis';

export default function UserDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await getUserDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1a365d] animate-spin mb-4" />
        <p className="text-slate-500 font-medium text-sm tracking-wide">Loading overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white min-h-[40vh] rounded-xl border border-red-100 flex flex-col items-center justify-center text-center p-8 shadow-sm">
        <AlertCircle className="w-10 h-10 text-red-400 mb-4 stroke-[1.5]" />
        <p className="text-slate-600 font-medium text-sm">{error}</p>
      </div>
    );
  }

  const user = data?.user || {};
  const metrics = data?.metrics || {
    events: { total: 0, upcoming: 0, past: 0 },
    certificates: { earned: 0 },
    publications: { total: 0, pending: 0, approved: 0, rejected: 0 }
  };

  const isMembershipActive = user.membershipStatus === 'ACTIVE';

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="mb-2">
          <h1 className="text-3xl font-medium text-slate-800 tracking-tight"> <p className=" text-slate-800 mt-1">
            Welcome back, <span className="  text-[#00a040] " >{user.fullName?.split(' ')[0] || 'User'}. </span> 
          </p></h1>
          {/* <p className="text-base font-normal text-slate-800 mt-1">
            Welcome back, <span className="text-base font-normal text-[#00a040] " >{user.fullName?.split(' ')[0] || 'User'}. </span> 
          </p> */}
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/user/profile" 
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            Manage Profile
          </Link>
          <Link 
            href="/user/events" 
            className="px-4 py-2 bg-[#1a365d] text-white rounded-lg text-sm font-medium hover:bg-[#12284b] transition-colors shadow-sm"
          >
            Browse Events
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Membership Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-slate-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-slate-500">Membership Status</span>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isMembershipActive ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>
              <CreditCard className="w-5 h-5 stroke-[1.5]" />
            </div>
          </div>
          <h3 className="text-3xl font-medium text-slate-800 mb-3 tracking-tight">
            {isMembershipActive ? 'Active' : 'Pending'}
          </h3>
          <div className="mt-auto">
            <span className={`inline-flex px-2.5 py-1 rounded bg-slate-50 text-xs font-medium ${isMembershipActive ? 'text-emerald-600 bg-emerald-50/50' : 'text-amber-600 bg-amber-50/50'}`}>
              {isMembershipActive ? 'All privileges unlocked' : 'Requires attention'}
            </span>
          </div>
        </motion.div>

        {/* Upcoming Events Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-slate-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-slate-500">Upcoming Events</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <CalendarDays className="w-5 h-5 stroke-[1.5]" />
            </div>
          </div>
          <h3 className="text-3xl font-medium text-slate-800 mb-3 tracking-tight">
            {metrics.events.upcoming}
          </h3>
          <div className="mt-auto">
            <span className="inline-flex px-2.5 py-1 rounded bg-blue-50/50 text-blue-600 text-xs font-medium">
              Out of {metrics.events.total} total registered
            </span>
          </div>
        </motion.div>

        {/* Certificates Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-slate-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-slate-500">Certificates Earned</span>
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Award className="w-5 h-5 stroke-[1.5]" />
            </div>
          </div>
          <h3 className="text-3xl font-medium text-slate-800 mb-3 tracking-tight">
            {metrics.certificates.earned}
          </h3>
          <div className="mt-auto">
            <span className="inline-flex px-2.5 py-1 rounded bg-purple-50/50 text-purple-600 text-xs font-medium">
              Ready to download
            </span>
          </div>
        </motion.div>

        {/* Publications Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl border border-slate-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-slate-500">Publications</span>
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
              <BookOpen className="w-5 h-5 stroke-[1.5]" />
            </div>
          </div>
          <h3 className="text-3xl font-medium text-slate-800 mb-3 tracking-tight">
            {metrics.publications.total}
          </h3>
          <div className="mt-auto">
            <span className="inline-flex px-2.5 py-1 rounded bg-teal-50/50 text-teal-600 text-xs font-medium">
              {metrics.publications.approved} approved so far
            </span>
          </div>
        </motion.div>

      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pt-2">
        
        {/* Left Col (Span 2) - Research / Applications List */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="xl:col-span-2 bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-medium text-slate-800">Research & Publications</h2>
              <p className="text-sm font-normal text-slate-500 mt-0.5">Status of your submitted abstracts and papers</p>
            </div>
            <Link href="/publications" className="text-sm font-medium text-[#0096a4] hover:text-[#007a86] flex items-center gap-1 transition-colors px-3 py-1.5 bg-[#0096a4]/5 rounded-md">
              View all <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </Link>
          </div>
          
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap">Category</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap">Total Count</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap">Status Indicator</th>
                  <th className="px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                
                {/* Approved Row */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Approved Research</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-normal text-slate-500">{metrics.publications.approved} Papers</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" /> Published
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <span className="text-slate-400">...</span>
                  </td>
                </tr>

                {/* Pending Row */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Pending Review</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-normal text-slate-500">{metrics.publications.pending} Papers</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-amber-200 bg-amber-50 text-amber-700 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 stroke-[2]" /> In Queue
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <span className="text-slate-400">...</span>
                  </td>
                </tr>

                {/* Rejected Row */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                        <XCircle className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">Needs Revision</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-normal text-slate-500">{metrics.publications.rejected} Papers</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-red-200 bg-red-50 text-red-700 text-xs font-medium">
                      <XCircle className="w-3.5 h-3.5 stroke-[2]" /> Rejected
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <span className="text-slate-400">...</span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right Col (Span 1) - Event Schedule & Quick Links */}
        <div className="xl:col-span-1 space-y-6 flex flex-col">
          
          {/* Event Schedule Box */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-medium text-slate-800">Event Overview</h2>
              <Link href="/events" className="text-slate-400 hover:text-[#0096a4] transition-colors">
                <ArrowRight className="w-4 h-4 stroke-[1.5]" />
              </Link>
            </div>

            <div className="space-y-5">
              
              {/* Event Item */}
              <div className="flex gap-4">
                <div className="w-12 h-14 rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-none mb-1">Total</span>
                  <span className="text-lg font-medium text-[#1a365d] leading-none">{metrics.events.total}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-medium text-slate-700">All Registered Events</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">History</span>
                    <span className="text-[11px] font-normal text-slate-400">Since joining</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-14 rounded-lg border border-blue-100 bg-blue-50 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-medium text-blue-400 uppercase tracking-widest leading-none mb-1">Up</span>
                  <span className="text-lg font-medium text-blue-700 leading-none">{metrics.events.upcoming}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-medium text-slate-700">Upcoming Schedule</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">Pending</span>
                    <span className="text-[11px] font-normal text-slate-400">Awaiting attendance</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-14 rounded-lg border border-emerald-100 bg-emerald-50 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-widest leading-none mb-1">Past</span>
                  <span className="text-lg font-medium text-emerald-700 leading-none">{metrics.events.past}</span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-medium text-slate-700">Attended Events</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-medium">Completed</span>
                    <span className="text-[11px] font-normal text-slate-400">Successfully marked</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Quick Links Box */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6">
            <h2 className="text-base font-medium text-slate-800 mb-1">Quick Links</h2>
            <p className="text-xs font-normal text-slate-500 mb-4">Access portals and configurations</p>
            
            <div className="flex flex-col space-y-2">
              <Link href="/certificates" className="text-sm font-medium text-slate-600 hover:text-[#0096a4] py-1.5 transition-colors">
                Download my latest certificates
              </Link>
              <Link href="/membership" className="text-sm font-medium text-slate-600 hover:text-[#0096a4] py-1.5 transition-colors">
                Renew or check membership status
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
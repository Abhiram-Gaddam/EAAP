// app/admin/applications/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  Download, 
  Filter, 
  Hash, 
  User as UserIcon, 
  GraduationCap, 
  Calendar, 
  Activity,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2
} from 'lucide-react';
import { getAllApplications, updateApplicationStatus ,deleteApplication} from '@/app/lib/utilities/apis';

const TABS = ['All', 'PENDING', 'APPROVED', 'REJECTED'];

export default function ApplicationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All');
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await getAllApplications();
      setApplications(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this application?")) {
      try {
        await deleteApplication(id);
        setActiveDropdown(null);
        fetchData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete application');
      }
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    console.log("Attempting to update status for ID:", id); // Check this value!
    try {
        await updateApplicationStatus(id, newStatus);
        setActiveDropdown(null);
        fetchData(); // Refresh the list
      } catch (err: any) {
        alert(err.message || `Failed to update status`);
      }
  };

   

  // Filter logic
  const filteredApplications = applications.filter(app => {
    if (activeTab === 'All') return true;
    return app.status === activeTab;
  });

  // Dynamic Metrics
  const totalApps = applications.length;
  const pendingApps = applications.filter(a => a.status === 'PENDING_APPROVAL').length;
  const approvedApps = applications.filter(a => a.status === 'APPROVED').length;
  const rejectedApps = applications.filter(a => a.status === 'REJECTED').length;

  const METRICS = [
    { title: 'Total Applications', count: totalApps, trend: 'All time', trendColor: 'text-blue-500', bg: 'bg-[#f4f7fa]' },
    { title: 'Pending Verification', count: pendingApps, trend: 'Requires attention', trendColor: 'text-amber-500', bg: 'bg-[#fffbf0]' },
    { title: 'Approved', count: approvedApps, trend: 'Verified members', trendColor: 'text-emerald-500', bg: 'bg-[#f4fcf7]' },
    { title: 'Rejected', count: rejectedApps, trend: 'Declined', trendColor: 'text-red-500', bg: 'bg-[#fff5f5]' },
  ];

  return (
    <div className="  bg-white min-h-full p-4">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-medium text-[#1a365d]">Applications</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and verify membership applications</p>
        </div>
        <button  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a365d] to-[#0096a4] hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shrink-0"   >
          <Plus className="w-4 h-4" />
          Add New Application
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {METRICS.map((metric, idx) => (
          <div key={idx} className={`${metric.bg} rounded-xl p-5 border border-slate-100/50 flex flex-col justify-between min-h-[115px]`}>
            <div className="flex items-start justify-between">
              <span className="text-[13px] text-slate-600 font-medium">{metric.title}</span>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-end justify-between mt-4">
              <span className="text-3xl font-medium text-slate-800 leading-none tracking-tight">
                {isLoading ? '-' : metric.count}
              </span>
              <span className={`text-[11px] font-medium ${metric.trendColor}`}>{metric.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs and Actions Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 mb-6 gap-4">
        <div className="flex gap-6 overflow-x-auto hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab ? 'text-[#1a73e8]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
              {activeTab === tab && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#1a73e8]" />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-5 pb-3">
          <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-5 py-4 w-12">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#1a73e8] focus:ring-[#1a73e8]" />
                </th>
                <th className="px-5 py-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-2"><Hash className="w-3.5 h-3.5" /> App ID</div>
                </th>
                <th className="px-5 py-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-2"><UserIcon className="w-3.5 h-3.5" /> Applicant Name</div>
                </th>
                <th className="px-5 py-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5" /> Email</div>
                </th>
                <th className="px-5 py-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Qualification</div>
                </th>
                <th className="px-5 py-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Date</div>
                </th>
                <th className="px-5 py-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-2"><Activity className="w-3.5 h-3.5" /> Status</div>
                </th>
                <th className="px-5 py-4 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 relative">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-24 text-center">
                    <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">Loading applications...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-red-500 text-sm font-medium">
                    {error}
                  </td>
                </tr>
              ) : filteredApplications.length > 0 ? (
                filteredApplications.map((app) => {
                  const isDropdownOpen = activeDropdown === app.id;
                  
                  return (
                    <tr 
                      key={app.id} 
                      onClick={() => router.push(`/admin/applications/${app.id}`)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#1a73e8] focus:ring-[#1a73e8]" />
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500 font-medium">
                        {app.id.split('-')[0].substring(0,8)}...
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-800 font-medium">{app.User?.fullName || 'N/A'}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{app.User?.email || 'N/A'}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        { app.highestQualification }
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full border text-[11px] font-medium ${
                           app.status === 'PENDING_APPROVAL' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                           app.status === 'APPROVED' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                           'text-red-600 bg-red-50 border-red-200'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right relative" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => setActiveDropdown(isDropdownOpen ? null : app.id)}
                          className={`p-1.5 rounded-lg transition-colors ${isDropdownOpen ? 'bg-slate-100 text-[#1a73e8]' : 'text-slate-400 hover:text-[#1a73e8] hover:bg-blue-50'}`}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Interactive Dropdown Menu */}
                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div 
                              ref={dropdownRef}
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-8 top-10 w-48 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 overflow-hidden text-left"
                            >
                              <div className="p-1.5 space-y-0.5">
                                <button 
                                  onClick={() => { router.push(`/admin/applications/${app.id}`); setActiveDropdown(null); }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#1a73e8] rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" /> View Details
                                </button>
                                
                                {app.status === 'PENDING' && (
                                  <>
                                    <button 
                                      onClick={() => handleStatusUpdate(app.id, 'APPROVED')}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                    >
                                      <CheckCircle2 className="w-4 h-4" /> Approve
                                    </button>
                                    <button 
                                      onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                    >
                                      <XCircle className="w-4 h-4" /> Reject
                                    </button>
                                  </>
                                )}

                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                
                                <button 
                                  onClick={() => handleDelete(app.id)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-500 text-sm font-medium">
                    <Activity className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    No applications found for "{activeTab}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
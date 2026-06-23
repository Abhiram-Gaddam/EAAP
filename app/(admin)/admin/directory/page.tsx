// app/admin/directory/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  User as UserIcon, 
  Mail, 
  Building2, 
  MapPin, 
  Loader2,
  ShieldCheck,
  Eye,
  Trash2,
  Clock
} from 'lucide-react';
import { getDirectoryMembers } from '@/app/lib/utilities/apis';

export default function DirectoryPage() {
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMembers();
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

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const data = await getDirectoryMembers();
      setMembers(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch directory members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm("Are you sure you want to remove this member? This action cannot be undone.")) {
      // NOTE: Add a delete API call here if supported by your backend
      alert("Delete functionality pending backend integration.");
      setActiveDropdown(null);
    }
  };

  const filteredMembers = members.filter(member => {
    const searchLower = searchQuery.toLowerCase();
    const hospital = member.MembershipDetails?.currentHospital || '';
    const designation = member.MembershipDetails?.currentDesignation || '';
    
    return (
      member.fullName?.toLowerCase().includes(searchLower) ||
      member.email?.toLowerCase().includes(searchLower) ||
      hospital.toLowerCase().includes(searchLower) ||
      designation.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="w-full bg-white min-h-full rounded-3xl p-2">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-medium text-[#1a365d]">Member Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and view all active association members</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-4 py-2.5 rounded-xl transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, or hospital..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#1a365d] bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><UserIcon className="w-3.5 h-3.5" /> Member</div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Contact</div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> Practice</div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Experience</div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Location</div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 relative">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">Loading directory...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-red-500 text-sm font-medium">
                    {error}
                  </td>
                </tr>
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => {
                  const details = member.MembershipDetails || {};
                  const isDropdownOpen = activeDropdown === member.id;
                  
                  return (
                    <tr 
                      key={member.id} 
                      
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td onClick={() => router.push(`/admin/directory/${member.id}`)} className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#0096a4]/10 flex items-center justify-center text-[#0096a4] font-semibold text-sm border border-[#0096a4]/20 shrink-0">
                            {member.fullName?.split(' ')[1]?.[0] || member.fullName?.[0] || 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-[#1a365d] flex items-center gap-1.5 truncate">
                              {member.fullName}
                              {member.role === 'ACTIVE_MEMBER' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                            </div>
                            <div className="text-xs text-slate-400 font-medium mt-0.5 truncate">{details.currentDesignation || 'Member'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 font-medium truncate max-w-[180px]">{member.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 font-medium truncate max-w-[180px]">{details.currentHospital || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 font-medium">
                          {details.clinicalEmbryologyExpYrs !== undefined ? `${details.clinicalEmbryologyExpYrs} Yrs` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-500 font-medium truncate max-w-[150px]">{details.cityDistrict || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => setActiveDropdown(isDropdownOpen ? null : member.id)}
                          className={`p-1.5 rounded-lg transition-colors ${isDropdownOpen ? 'bg-slate-100 text-[#1a73e8]' : 'text-slate-400 hover:text-[#1a73e8] hover:bg-blue-50'}`}
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

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
                                  onClick={() => { router.push(`/admin/directory/${member.id}`); setActiveDropdown(null); }}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0096a4] rounded-lg transition-colors"
                                >
                                  <Eye className="w-4 h-4" /> View Profile
                                </button>
                                
                                <div className="h-px bg-slate-100 my-1 mx-2" />
                                
                                <button 
                                  onClick={() => handleDeleteMember(member.id)}
                                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" /> Remove
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
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-500 text-sm font-medium">
                    <UserIcon className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    No members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
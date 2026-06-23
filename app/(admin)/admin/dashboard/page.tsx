// app/admin/page.tsx
"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Users, 
  FileText, 
  CalendarDays, 
  IndianRupee, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MoreHorizontal,
  ExternalLink,
  Settings
} from 'lucide-react';

const STATS = [
  { label: 'Active Members', value: '1,248', trend: '+12 this month', icon: Users, iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
  { label: 'Pending Reviews', value: '24', trend: 'Requires attention', icon: FileText, iconColor: 'text-amber-600', iconBg: 'bg-amber-100' },
  { label: 'Upcoming Events', value: '3', trend: 'Next: Jun 28', icon: CalendarDays, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100' },
  { label: 'Monthly Revenue', value: '₹42,500', trend: '+8% vs last month', icon: IndianRupee, iconColor: 'text-[#0096a4]', iconBg: 'bg-[#0096a4]/10' },
];

const RECENT_APPLICATIONS = [
  { id: 'APP-802', name: 'Dr. Sarah Reddy', qualification: 'M.Sc Clinical Embryology', date: '2 hours ago', status: 'Pending' },
  { id: 'APP-801', name: 'Dr. Vikram Kumar', qualification: 'Ph.D Reproductive Med.', date: '5 hours ago', status: 'Pending' },
  { id: 'APP-800', name: 'Dr. Ananya Rao', qualification: 'B.Sc Clinical Embryology', date: '1 day ago', status: 'Approved' },
  { id: 'APP-799', name: 'Dr. Rajesh Sharma', qualification: 'MD (OBG)', date: '2 days ago', status: 'Rejected' },
];

const UPCOMING_EVENTS = [
  { id: 1, title: 'Annual ART Conference 2026', date: 'June 28, 2026', type: 'Conference', attendees: 142 },
  { id: 2, title: 'Advanced ICSI Workshop', date: 'July 15, 2026', type: 'Workshop', attendees: 30 },
  { id: 3, title: 'Q3 Board Meeting', date: 'August 02, 2026', type: 'Internal', attendees: 12 },
];

export default function AdminOverview() {
  return (
    <div className="space-y-8 px-4 bg-white py-8">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-semibold text-[#1a365d] tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Monitor association metrics and recent application activity.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            Download Report
          </button>
          <Link href="/admin/applications" className="px-5 py-2.5 bg-[#1a365d] text-white rounded-xl text-sm font-semibold hover:bg-[#0f213b] hover:shadow-md hover:shadow-[#1a365d]/20 transition-all">
            Review Queue
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-semibold text-[#1a365d] tracking-tight">{stat.value}</h3>
                <p className="text-xs text-slate-400 mt-2 font-medium bg-slate-50 inline-block px-2 py-1 rounded-md">{stat.trend}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-lg font-semibold text-[#1a365d]">Recent Applications</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Awaiting board verification</p>
              </div>
              <Link href="/admin/applications" className="text-sm font-semibold text-[#0096a4] hover:text-[#1a365d] flex items-center gap-1.5 transition-colors bg-[#0096a4]/5 px-3 py-1.5 rounded-lg hover:bg-slate-50">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Applicant</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Qualification</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {RECENT_APPLICATIONS.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1a365d]/5 flex items-center justify-center text-[#1a365d] font-bold text-sm border border-[#1a365d]/10">
                            {app.name.split(' ')[1]?.[0] || app.name[0]}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#1a365d]">{app.name}</div>
                            <div className="text-xs text-slate-400 font-medium mt-0.5">{app.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{app.qualification}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{app.date}</td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${
                          app.status === 'Pending' ? 'bg-amber-50 border-amber-200/60 text-amber-700' : 
                          app.status === 'Approved' ? 'bg-emerald-50 border-emerald-200/60 text-emerald-700' : 
                          'bg-red-50 border-red-200/60 text-red-700'
                        }`}>
                          {app.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                          {app.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {app.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                          <span className="text-xs font-semibold">
                            {app.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/applications/${app.id}`} className="p-2 text-slate-400 hover:text-[#1a365d] hover:bg-slate-100 rounded-xl inline-flex transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-6 lg:col-span-1"
        >
          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1a365d]">Event Schedule</h2>
              <Link href="/admin/events" className="p-2 text-slate-400 hover:text-[#0096a4] hover:bg-[#0096a4]/5 rounded-xl transition-colors">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 space-y-5">
              {UPCOMING_EVENTS.map((event) => (
                <div key={event.id} className="flex gap-4 group cursor-pointer items-start">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 shrink-0 group-hover:border-[#0096a4]/40 group-hover:bg-[#0096a4]/10 transition-all shadow-sm">
                    <span className="text-[10px] font-bold text-slate-500 uppercase leading-none mb-1.5 group-hover:text-[#0096a4]">Jun</span>
                    <span className="text-sm font-bold text-[#1a365d] leading-none group-hover:text-[#0096a4]">{event.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className="text-sm font-semibold text-[#1a365d] group-hover:text-[#0096a4] transition-colors line-clamp-1">{event.title}</h4>
                    <div className="flex items-center gap-2.5 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">{event.type}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{event.attendees} Registered</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6">
            <h2 className="text-lg font-semibold text-[#1a365d] mb-1">Quick Links</h2>
            <p className="text-sm text-slate-500 font-medium mb-6">Access portals and configurations.</p>
            
            <div className="space-y-3">
              <Link href="/" target="_blank" className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 hover:border-[#0096a4]/30 hover:bg-[#0096a4]/5 hover:shadow-md hover:shadow-[#0096a4]/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[#0096a4] group-hover:border-[#0096a4]/30 group-hover:bg-white transition-colors shadow-sm">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-[#1a365d] transition-colors">Public Site</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0096a4] transition-colors mr-1" />
              </Link>
              
              <Link href="/admin/settings" className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 hover:border-[#0096a4]/30 hover:bg-[#0096a4]/5 hover:shadow-md hover:shadow-[#0096a4]/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-[#0096a4] group-hover:border-[#0096a4]/30 group-hover:bg-white transition-colors shadow-sm">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-[#1a365d] transition-colors">System Settings</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0096a4] transition-colors mr-1" />
              </Link>
            </div>
          </div>

        </motion.div>
      </div>
      
    </div>
  );
}
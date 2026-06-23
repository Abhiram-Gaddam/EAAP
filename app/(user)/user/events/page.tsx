// app/(user)/events/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  CalendarDays, MapPin, Video, Clock, Loader2, 
  AlertCircle, ArrowRight, Compass, CheckCircle2, ChevronRight
} from 'lucide-react';
import { getUserEvents } from '@/app/lib/utilities/userApis';

export default function UserEventsHub() {
  const [data, setData] = useState<any>({ registeredUpcoming: [], pastEvents: [], exploreEvents: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'schedule' | 'explore'>('schedule');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await getUserEvents();
      setData(res);
      
      if (res.registeredUpcoming?.length === 0 && res.exploreEvents?.length > 0) {
        setActiveTab('explore');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load events.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4" />
        <p className="text-slate-500 font-medium text-sm tracking-wide">Loading your events...</p>
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

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-4">
        <div>
          <h1 className="text-2xl font-medium text-slate-800 tracking-tight">Events Hub</h1>
          <p className="text-sm font-normal text-slate-500 mt-1 max-w-2xl">
            Manage your upcoming schedule, access past materials, or discover new workshops and conferences.
          </p>
        </div>

        <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'schedule' ? 'bg-[#0096a4]/10 text-[#0096a4]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
          >
            <CalendarDays className="w-4 h-4 stroke-[1.5]" /> My Schedule
          </button>
          <button 
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'explore' ? 'bg-[#0096a4]/10 text-[#0096a4]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
          >
            <Compass className="w-4 h-4 stroke-[1.5]" /> Explore New
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {activeTab === 'schedule' && (
          <motion.div key="schedule" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
            
            <section>
              <h2 className="text-lg font-medium text-slate-800 mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Upcoming Registrations
              </h2>
              
              {data.registeredUpcoming?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.registeredUpcoming.map((reg: any) => {
                    const evt = reg.Events || {};
                    const evtDate = new Date(evt.date);
                    const isVirtual = evt.location?.toLowerCase() === 'virtual' || !evt.location;
                    
                    return (
                      <Link href={`/user/events/${evt.id}`} key={reg.id} className="group flex h-full">
                        <div className="bg-white border border-slate-100 hover:border-[#0096a4]/30 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all flex flex-col w-full overflow-hidden">
                          
                          <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center shrink-0">
                            {evt.coverImage ? (
                              <img src={evt.coverImage} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-[#1a365d] to-[#0096a4] opacity-90 flex items-center justify-center">
                                <CalendarDays className="w-10 h-10 text-white/30 stroke-[1.5]" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
                            
                            <div className="absolute top-3 right-3">
                              <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-700 bg-emerald-400/90 px-2.5 py-1 rounded-md shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" /> Registered
                              </span>
                            </div>
                            <div className="absolute bottom-3 left-3">
                              <span className="px-2.5 py-1 rounded bg-white/90 backdrop-blur-sm text-[#1a365d] text-[10px] font-medium uppercase tracking-widest shadow-sm">
                                {evt.type || 'Event'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-base font-medium text-slate-800 mb-4 line-clamp-2 group-hover:text-[#0096a4] transition-colors">
                              {evt.title}
                            </h3>
                            
                            <div className="mt-auto space-y-3">
                              <div className="flex items-center gap-2.5 text-sm text-slate-500">
                                <Clock className="w-4 h-4 stroke-[1.5] text-[#0096a4]" />
                                <span className="font-normal">{evtDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {evtDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                              </div>
                              <div className="flex items-center gap-2.5 text-sm text-slate-500">
                                {isVirtual ? <Video className="w-4 h-4 stroke-[1.5] text-[#0096a4]" /> : <MapPin className="w-4 h-4 stroke-[1.5] text-[#0096a4]" />}
                                <span className="font-normal truncate">{isVirtual ? 'Virtual Event' : evt.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="w-full bg-white border border-slate-100 rounded-2xl p-10 text-center flex flex-col items-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <CalendarDays className="w-10 h-10 text-slate-300 mb-3 stroke-[1.5]" />
                  <p className="text-sm font-medium text-slate-600 mb-4">You have no upcoming events scheduled.</p>
                  <button onClick={() => setActiveTab('explore')} className="px-5 py-2.5 bg-slate-50 border border-slate-200 text-[#0096a4] rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-sm">
                    Explore available events <ArrowRight className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-lg font-medium text-slate-800 mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span> Past Attended Events
              </h2>
              {data.pastEvents?.length > 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap">Event Details</th>
                          <th className="px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap">Date</th>
                          <th className="px-6 py-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {data.pastEvents.map((reg: any) => {
                          const evt = reg.Events || {};
                          return (
                            <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <Link href={`/user/events/${reg.eventId}`} className="group flex items-center gap-4">
                                  <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
                                    {evt.coverImage ? (
                                      <img src={evt.coverImage} alt="thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                    ) : (
                                      <CalendarDays className="w-5 h-5 text-slate-300 stroke-[1.5]" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-slate-800 group-hover:text-[#0096a4] transition-colors line-clamp-1">{evt.title}</p>
                                    <p className="text-xs font-normal text-slate-500 mt-0.5">{evt.type || 'Event'}</p>
                                  </div>
                                </Link>
                              </td>
                              <td className="px-6 py-4 text-sm font-normal text-slate-600">
                                {new Date(evt.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Link href={`/user/events/${reg.eventId}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors">
                                  View Details <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 rounded-2xl p-8 text-center">
                  <p className="text-sm font-normal text-slate-500">No past events found in your history.</p>
                </div>
              )}
            </section>

          </motion.div>
        )}

        {activeTab === 'explore' && (
          <motion.div key="explore" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            {data.exploreEvents?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.exploreEvents.map((evt: any) => {
                  const evtDate = new Date(evt.date);
                  const isVirtual = evt.location?.toLowerCase() === 'virtual' || !evt.location;
                  return (
                    <div key={evt.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-[0_2px_15px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all group flex flex-col hover:border-[#0096a4]/30">
                      
                      <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center shrink-0">
                        {evt.coverImage ? (
                          <img src={evt.coverImage} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#1a365d] to-[#0096a4] opacity-90 flex items-center justify-center">
                            <CalendarDays className="w-10 h-10 text-white/30 stroke-[1.5]" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none"></div>
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded bg-white/90 backdrop-blur-sm text-[#1a365d] text-[10px] font-medium uppercase tracking-widest shadow-sm">
                            {evt.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-base font-medium text-slate-800 line-clamp-2 mb-4 group-hover:text-[#0096a4] transition-colors">
                          {evt.title}
                        </h3>
                        
                        <div className="space-y-2 mt-auto mb-5">
                          <div className="flex items-center gap-2.5 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5 stroke-[1.5]" />
                            <span className="font-normal">{evtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {evtDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-xs text-slate-500">
                            {isVirtual ? <Video className="w-3.5 h-3.5 stroke-[1.5]" /> : <MapPin className="w-3.5 h-3.5 stroke-[1.5]" />}
                            <span className="font-normal truncate">{isVirtual ? 'Virtual' : evt.location}</span>
                          </div>
                        </div>

                        <Link href={`/user/events/${evt.id}`} className="w-full py-2.5 flex items-center justify-center gap-2 hover:bg-slate-50 border border-slate-100 hover:text-[#0096a4]  bg-[#0096a4]  text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
                          View & Register
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="w-full bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-16 text-center">
                <Compass className="w-12 h-12 text-slate-300 mx-auto mb-4 stroke-[1.5]" />
                <p className="text-sm font-medium text-slate-600 mb-2">You're all caught up!</p>
                <p className="text-sm font-normal text-slate-400">There are no new events to explore at the moment. Check back later.</p>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, CalendarDays, MapPin, Loader2, AlertCircle, 
  CheckCircle2, Video, Clock, Info, ShieldCheck, X, Image as ImageIcon,
  Lock, ExternalLink, Ticket
} from 'lucide-react';
import { getUserEventDetails, registerForEvent, cancelEventRegistration } from '@/app/lib/utilities/userApis';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      const data = await getUserEventDetails(id);
      setEvent(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load event details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!id) return;
    try {
      setIsProcessing(true);
      await registerForEvent(id);
      await fetchEvent();
    } catch (err: any) {
      alert(err.message || 'Registration failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!id) return;
    if (confirm('Are you sure you want to cancel your registration?')) {
      try {
        setIsProcessing(true);
        await cancelEventRegistration(id);
        await fetchEvent();
      } catch (err: any) {
        alert(err.message || 'Failed to cancel registration');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (isLoading || !id) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
        <p className="text-slate-500 font-medium text-sm tracking-wide">Fetching event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="w-full bg-white min-h-[40vh] rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center p-8 shadow-sm">
        <AlertCircle className="w-10 h-10 text-red-400 mb-4 stroke-[1.5]" />
        <p className="text-slate-600 font-medium mb-6">{error}</p>
        <Link href="/events" className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-medium transition-colors text-sm">
          Return to Events
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isVirtual = !!event.eventLink && (!event.location || event.location.toLowerCase() === 'virtual');
  const isPast = eventDate < new Date();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full pb-12 space-y-6"
    >
      
      {/* Navigation & Breadcrumb */}
      <Link href="/user/events" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0096a4] transition-colors">
        <ArrowLeft className="w-4 h-4 stroke-[1.5]" /> Back to Events Hub
      </Link>

      {/* Main Hero Banner */}
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden relative">
        <div className="h-64 md:h-[400px] w-full relative flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 shrink-0">
          
          <CalendarDays className="absolute w-24 h-24 text-slate-300 stroke-[1.5] z-0" />
          
          {event.coverImage && (
             <img 
               src={event.coverImage} 
               alt={event.title} 
               className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700" 
               referrerPolicy="no-referrer"
               onError={(e) => { e.currentTarget.style.opacity = '0'; }}
             />
          )}

          {/* Elegant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f213b]/90 via-[#0f213b]/30 to-transparent z-10 pointer-events-none" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium uppercase tracking-widest shadow-sm">
                {event.type}
              </span>
              {event.isRegistered && (
                <span className="px-3 py-1.5 rounded-lg bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-medium uppercase tracking-widest flex items-center gap-1.5 shadow-sm border border-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" /> Registered
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-medium text-white tracking-tight leading-tight max-w-4xl drop-shadow-sm">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Content Area (Span 2) */}
        <div className="lg:col-span-2 space-y-10 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
          
          {/* About Section */}
          <section>
            <h2 className="text-xl font-medium text-slate-800 mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#0096a4] stroke-[1.5]" /> About the Event
            </h2>
            {event.description ? (
              <p className="text-base font-normal text-slate-600 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            ) : (
              <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                <p className="text-sm font-normal text-slate-400 italic">No detailed description has been provided for this event.</p>
              </div>
            )}
          </section>

          {/* Media Gallery Section */}
          {event.gallery && event.gallery.length > 0 && (
            <section className="pt-6 border-t border-slate-100">
              <h2 className="text-xl font-medium text-slate-800 mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#0096a4] stroke-[1.5]" /> Event Media
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {event.gallery.map((imgUrl: string, idx: number) => (
                  <div key={idx} className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative group cursor-pointer shadow-sm hover:shadow-md transition-all">
                     <ImageIcon className="absolute inset-0 m-auto w-6 h-6 text-slate-300 stroke-[1.5] z-0" />
                     <img 
                       src={imgUrl} 
                       alt={`Gallery Image ${idx + 1}`} 
                       className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-500" 
                       referrerPolicy="no-referrer"
                       onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                     />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sticky Action Card (Span 1) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 md:p-8 flex flex-col relative overflow-hidden">
            
            {/* Elegant Accent Top Border */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1a365d] to-[#0096a4]" />

            <div className="space-y-8 flex-1 mt-2">
              
              {/* Date & Time Block */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-[#0096a4] shadow-sm">
                  <Clock className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5">Date & Time</p>
                  <p className="text-base font-medium text-slate-800 leading-tight mb-1">{eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-sm font-normal text-slate-500">{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                </div>
              </div>

              {/* Location & Link Block */}
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-[#0096a4] shadow-sm">
                  {isVirtual ? <Video className="w-5 h-5 stroke-[1.5]" /> : <MapPin className="w-5 h-5 stroke-[1.5]" />}
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5">{isVirtual ? 'Virtual Meeting' : 'Location'}</p>
                  
                  {isVirtual ? (
                    /* Beautiful conditional render for the link */
                    event.isRegistered ? (
                      <a href={event.eventLink} target="_blank" rel="noopener noreferrer" className="mt-1 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 hover:bg-emerald-100 transition-colors group shadow-sm">
                        <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm group-hover:scale-105 transition-transform"><Video className="w-4 h-4 stroke-[1.5]" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-emerald-800 truncate">Meeting Unlocked</p>
                          <p className="text-[10px] font-normal text-emerald-600 mt-0.5">Click here to join</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-emerald-500 shrink-0 mr-1" />
                      </a>
                    ) : (
                      <div className="mt-1 p-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-slate-100/50 rounded-lg text-slate-400"><Lock className="w-4 h-4 stroke-[1.5]" /></div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-700">Link Locked</p>
                          <p className="text-[10px] font-normal text-slate-500 mt-0.5">Register to access</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <p className="text-base font-medium text-slate-800 break-words leading-snug">{event.location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Registration Actions Panel */}
            <div className="pt-8 mt-8 border-t border-slate-100">
              {isPast ? (
                <div className="w-full py-4 bg-slate-50 text-slate-400 rounded-xl text-sm font-medium text-center border border-slate-200/50 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 stroke-[1.5]" /> This event has concluded
                </div>
              ) : event.isRegistered ? (
                <div className="space-y-3">
                  <div className="w-full py-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 stroke-[1.5]" /> Registration Confirmed
                  </div>
                  <button 
                    onClick={handleCancel} disabled={isProcessing}
                    className="w-full py-3 bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin stroke-[1.5]" /> : <X className="w-4 h-4 stroke-[1.5]" />}
                    Cancel Reservation
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleRegister} disabled={isProcessing}
                  className="w-full py-4 bg-[#1a365d] hover:bg-[#12284b] text-white rounded-xl text-base font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 group"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin stroke-[1.5]" />
                  ) : (
                    <Ticket className="w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform" />
                  )}
                  Secure Your Spot
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
}
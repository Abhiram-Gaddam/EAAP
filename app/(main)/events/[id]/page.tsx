"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, CalendarDays, MapPin, Loader2, AlertCircle, 
  CheckCircle2, Video, Clock, Info, Image as ImageIcon,
  LogIn, Ticket, X, ExternalLink, ShieldAlert
} from 'lucide-react';
import { 
  getPublicEventDetails, 
  getUserEventDetails, 
  registerForEvent, 
  getCurrentUser
} from '@/app/lib/utilities/userApis';

const GalleryImage = ({ src }: { src: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-slate-400">
        <ImageIcon className="w-8 h-8 stroke-[1.5] mb-2" />
        <span className="text-[10px] font-medium uppercase tracking-widest">Unavailable</span>
      </div>
    );
  }

  return (
    <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative group cursor-pointer shadow-sm hover:shadow-md transition-all">
      <div className="absolute inset-0 bg-slate-100 animate-pulse z-0" />
      <img 
        src={src} 
        alt="Event Gallery" 
        className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-500" 
        onError={() => setHasError(true)}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default function PublicEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal & Processing States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [coverImgError, setCoverImgError] = useState(false);

  useEffect(() => {
    if (id) fetchEventData();
  }, [id]);

  const fetchEventData = async () => {
    try {
      setIsLoading(true);
      
      let currentUser = null;
      try {
        const userData = await getCurrentUser();
        currentUser = userData.user;
        setUser(currentUser);
      } catch (e) {
        // User not logged in, ignore
      }

      if (currentUser) {
        // Fetch detailed version for logged-in users (includes isRegistered flag)
        const data = await getUserEventDetails(id);
        setEvent(data);
        setIsRegistered(data.isRegistered);
      } else {
        // Fetch public version
        const data = await getPublicEventDetails(id);
        setEvent(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load event details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmRegistration = async () => {
    if (!user || !id) return;

    try {
      setIsProcessing(true);
      await registerForEvent(id);
      setIsRegistered(true);
      setIsModalOpen(false);
    } catch (err: any) {
      if (err.message.includes('Already registered')) {
        setIsRegistered(true);
        setIsModalOpen(false);
      } else {
        alert(err.message || 'Registration failed');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRegisterClick = () => {
    if (!user) {
      router.push(`/login?redirect=/events/${id}`);
      return;
    }
    setIsModalOpen(true);
  };

  if (isLoading || !id) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
        <p className="text-slate-500 font-medium text-sm tracking-wide">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-3xl border border-red-100 flex flex-col items-center text-center p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <AlertCircle className="w-10 h-10 text-red-400 mb-4 stroke-[1.5]" />
          <p className="text-slate-600 font-medium mb-6">{error}</p>
          <Link href="/events" className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-medium transition-colors text-sm">
            Browse All Events
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isVirtual = !!event.eventLink && (!event.location || event.location.toLowerCase() === 'virtual');
  const isPast = eventDate < new Date();

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans py-14 relative">
      
      {/* Top Banner / Hero */}
      <div className="w-full bg-white border-b border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a365d]/5 to-[#0096a4]/5 z-0" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8 pb-12 lg:pt-12 lg:pb-16">
          <Link href="/events" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0096a4] transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" /> Back to Events
          </Link>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Cover Image */}
            <div className="w-full lg:w-1/2 aspect-video bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/60 shadow-md relative flex items-center justify-center shrink-0 group">
              <CalendarDays className="absolute w-12 h-12 text-slate-300 stroke-[1.5] z-0" />
              {event.coverImage && !coverImgError && (
                <img 
                  src={event.coverImage} 
                  alt={event.title} 
                  className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                  onError={() => setCoverImgError(true)}
                />
              )}
            </div>

            {/* Title & Quick Info */}
            <div className="flex-1 flex flex-col justify-center py-4">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-medium uppercase tracking-widest rounded-lg shadow-sm">
                  {event.type || 'Event'}
                </span>
                {isRegistered && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium uppercase tracking-widest flex items-center gap-1.5 rounded-lg shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" /> Registration Confirmed
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#1a365d] leading-tight tracking-tight mb-6">
                {event.title}
              </h1>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-[#0096a4] stroke-[1.5]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-xs font-normal text-slate-500">{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-600">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {isVirtual ? <Video className="w-4 h-4 text-[#0096a4] stroke-[1.5]" /> : <MapPin className="w-4 h-4 text-[#0096a4] stroke-[1.5]" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{isVirtual ? 'Virtual Meeting' : 'Location'}</p>
                    <p className="text-xs font-normal text-slate-500">{isVirtual ? 'Link provided upon registration' : event.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-medium text-[#1a365d] mb-6 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#0096a4] stroke-[1.5]" /> About the Event
            </h2>
            {event.description ? (
              <p className="text-base font-normal text-slate-600 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            ) : (
              <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center">
                <p className="text-sm font-normal text-slate-400 italic">No detailed description has been provided.</p>
              </div>
            )}
          </div>

          {event.gallery && event.gallery.length > 0 && (
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
              <h2 className="text-xl font-medium text-[#1a365d] mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#0096a4] stroke-[1.5]" /> Event Media
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {event.gallery.map((imgUrl: string, idx: number) => (
                  <GalleryImage key={idx} src={imgUrl} />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Sticky Action Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-[#1a365d] to-[#0096a4]" />
            
            <div className="p-8">
              <h3 className="text-lg font-medium text-slate-800 mb-6">Registration</h3>
              
              <AnimatePresence mode="wait">
                {isPast ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full py-4 bg-slate-50 text-slate-500 rounded-xl text-sm font-medium text-center border border-slate-200 flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 stroke-[1.5]" /> Registrations Closed
                  </motion.div>
                ) : !user ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <p className="text-sm font-normal text-slate-500 mb-4">Please log in to your account to secure your spot for this event.</p>
                    <button 
                      onClick={handleRegisterClick} 
                      className="w-full py-3.5 bg-[#1a365d] hover:bg-[#12284b] text-white rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-4 h-4 stroke-[1.5]" /> Log in to Register
                    </button>
                  </motion.div>
                ) : isRegistered ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="w-full py-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-sm font-medium flex items-center justify-center gap-2 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 stroke-[1.5]" /> You're Attending
                    </div>
                    <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl text-center flex flex-col items-center">
                      <p className="text-xs font-normal text-slate-500 mb-3">
                        Need to cancel or review your ticket? Head over to your personal dashboard.
                      </p>
                      {/* Assuming user dashboard events page is at /dashboard or /events */}
                      <Link href="/user/events" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-[#0096a4] hover:bg-slate-50 rounded-lg transition-colors shadow-sm">
                        Manage in Dashboard <ExternalLink className="w-3.5 h-3.5 stroke-[1.5]" />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <button 
                      onClick={handleRegisterClick} 
                      className="w-full py-4 bg-[#0096a4] hover:bg-[#007a86] text-white rounded-xl text-base font-medium transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                    >
                      <Ticket className="w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform" />
                      Secure Your Spot
                    </button>
                    <p className="text-xs font-normal text-slate-400 text-center mt-4">
                      By registering, you agree to the event terms and conditions.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================== */}
      {/* REGISTRATION CONFIRMATION MODAL */}
      {/* ============================================== */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => !isProcessing && setIsModalOpen(false)} 
              className="absolute inset-0 bg-[#0f213b]/60 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col border border-white/20"
            >
              <div className="p-6 md:p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5 shadow-sm">
                  <Ticket className="w-8 h-8 stroke-[1.5]" />
                </div>
                
                <h3 className="text-2xl font-medium text-slate-800 mb-2 tracking-tight">Confirm Registration</h3>
                <p className="text-sm font-normal text-slate-500 mb-6">
                  You are about to register for the following event.
                </p>

                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8 text-left">
                  <p className="text-sm font-medium text-[#1a365d] mb-3 line-clamp-2 leading-snug">{event.title}</p>
                  
                  <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                    <Clock className="w-4 h-4 text-slate-400 stroke-[1.5] shrink-0" />
                    <span className="font-normal">{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <MapPin className="w-4 h-4 text-slate-400 stroke-[1.5] shrink-0" />
                    <span className="font-normal truncate">{isVirtual ? 'Virtual Online Event' : event.location}</span>
                  </div>
                </div>

                <div className="w-full flex gap-3">
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    disabled={isProcessing}
                    className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmRegistration} 
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0096a4] hover:bg-[#007a86] text-white py-3.5 rounded-xl text-sm font-medium transition-all shadow-sm disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin stroke-[1.5]" /> : <CheckCircle2 className="w-4 h-4 stroke-[1.5]" />}
                    {isProcessing ? 'Processing...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
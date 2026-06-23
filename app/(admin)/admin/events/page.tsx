// app/admin/events/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, CalendarDays, MapPin, Users, Loader2, Image as ImageIcon, 
  X, AlertCircle, UploadCloud, Search, Filter, MoreVertical, Eye, 
  Edit, Trash2, CheckCircle2, Video, FileText, Download
} from 'lucide-react';
import { 
  getAllEvents, createEvent, updateEvent, deleteEvent, 
  uploadEventPhotos, getCertificateTemplates, previewCertificateTemplate 
} from '@/app/lib/utilities/apis';
import CertificatePreviewModal from '../../components/certificateModel';

const TABS = ['All Events', 'Upcoming', 'Past', 'Drafts'];

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Events');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Replace your old handlePreviewTemplate function with this one:
  const handlePreviewTemplate = async (templateId: string) => {
    if (!templateId) return;
    setIsPreviewModalOpen(true);
    try {
      setIsPreviewLoading(true);
      const res = await previewCertificateTemplate(templateId);
      setPreviewData(res);
    } catch (err: any) {
      alert(err.message || "Failed to generate preview.");
      setIsPreviewModalOpen(false);
    } finally {
      setIsPreviewLoading(false);
    }
  };


  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CONFERENCE',
    customType: '',
    format: 'offline', 
    date: '',
    location: '',
    eventLink: '',
    certificateTemplateId: '',
    isPublished: false,
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchTemplates();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const data = await getAllEvents();
      console.log("Admin Events :",data)
      setEvents(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await getCertificateTemplates();
      setTemplates(data || []);
    } catch (err: any) {
      console.error("Failed to load templates:", err);
    }
  };



  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const finalType = formData.type === 'OTHERS' ? formData.customType : formData.type;
      
      const submissionData = {
        title: formData.title,
        description: formData.description,
        type: finalType,
        date: new Date(formData.date).toISOString(),
        location: formData.format === 'offline' ? formData.location : '',
        eventLink: formData.format === 'virtual' ? formData.eventLink : '',
        certificateTemplateId: formData.certificateTemplateId || null,
        isPublished: formData.isPublished,
      };
      
      const newEvent = await createEvent(submissionData);

      if (coverFile && newEvent && newEvent.id) {
        const photoData = new FormData();
        photoData.append('coverImage', coverFile);
        await uploadEventPhotos(newEvent.id, photoData);
      }

      setIsCreateModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEventId) return;
    try {
      setIsSubmitting(true);
      const finalType = formData.type === 'OTHERS' ? formData.customType : formData.type;

      const submissionData = {
        title: formData.title,
        description: formData.description,
        type: finalType,
        date: new Date(formData.date).toISOString(),
        location: formData.format === 'offline' ? formData.location : '',
        eventLink: formData.format === 'virtual' ? formData.eventLink : '',
        certificateTemplateId: formData.certificateTemplateId || null,
        isPublished: formData.isPublished,
      };
      
      await updateEvent(currentEventId, submissionData);
      setIsEditModalOpen(false);
      resetForm();
      fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure you want to completely remove this event?")) {
      try {
        await deleteEvent(id);
        setActiveDropdown(null);
        fetchEvents();
      } catch (err: any) {
        alert(err.message || 'Failed to delete event');
      }
    }
  };

  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateEvent(id, { isPublished: !currentStatus });
      setActiveDropdown(null);
      fetchEvents();
    } catch (err: any) {
      alert('Failed to update publish status');
    }
  };

  const openEditModal = (event: any) => {
    setCurrentEventId(event.id);
    const isStandardType = ['CONFERENCE', 'WORKSHOP', 'MEETING', 'SEMINAR'].includes(event.type);
    const isVirtual = !!event.eventLink && (!event.location || event.location === '');
    
    setFormData({
      title: event.title,
      description: event.description || '',
      type: isStandardType ? event.type : 'OTHERS',
      customType: isStandardType ? '' : event.type,
      format: isVirtual ? 'virtual' : 'offline',
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location || '',
      eventLink: event.eventLink || '',
      certificateTemplateId: event.certificateTemplateId || '',
      isPublished: event.isPublished,
    });
    setActiveDropdown(null);
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ 
      title: '', description: '', type: 'CONFERENCE', customType: '', 
      format: 'offline', date: '', location: '', eventLink: '', certificateTemplateId: '', isPublished: false 
    });
    setCoverFile(null);
    setCurrentEventId(null);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    const eventDate = new Date(event.date);
    const now = new Date();

    if (activeTab === 'Upcoming') return eventDate > now && event.isPublished;
    if (activeTab === 'Past') return eventDate <= now && event.isPublished;
    if (activeTab === 'Drafts') return !event.isPublished;
    
    return true;
  });

  return (
    <div className="w-full bg-white min-h-full rounded-3xl p-2">
      {/* HEADER & FILTERS (Same as before) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a365d]">Events & Conferences</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage association events, workshops, and registrations</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsCreateModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a365d] to-[#0096a4] hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-slate-50 p-2 rounded-2xl">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar p-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-white text-[#0096a4] shadow-[0_2px_10px_rgba(0,0,0,0.04)]' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto px-1 pb-1 md:pb-0">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">Loading events...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-red-500 text-sm font-medium bg-red-50 rounded-2xl border border-red-100">
          <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-80" />
          {error}
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const eventDate = new Date(event.date);
            const isDropdownOpen = activeDropdown === event.id;
            const isVirtual = !!event.eventLink && (!event.location || event.location === '');
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={event.id}
                className="bg-white border border-slate-100 rounded-3xl overflow-visible shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,150,164,0.08)] hover:border-[#0096a4]/20 transition-all group flex flex-col relative"
              >
                <div 
                  onClick={() => router.push(`/admin/events/${event.id}`)}
                  className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center rounded-t-3xl cursor-pointer"
                >
                  {event.coverImage ? (
                    <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <ImageIcon className="w-10 h-10 mb-2 group-hover:scale-110 transition-transform duration-500" />
                      <span className="text-xs font-medium">No Cover Image</span>
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                      event.isPublished ? 'bg-emerald-500/90 text-white' : 'bg-slate-800/80 text-white'
                    }`}>
                      {event.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveDropdown(isDropdownOpen ? null : event.id); }}
                    className="p-1.5 bg-white/90 backdrop-blur text-slate-600 hover:text-[#1a365d] rounded-xl shadow-sm transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        ref={dropdownRef}
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden text-left"
                      >
                        <div className="p-1.5 space-y-0.5">
                          <button 
                            onClick={() => router.push(`/admin/events/${event.id}`)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0096a4] rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" /> View Details
                          </button>
                          <button 
                            onClick={() => openEditModal(event)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#1a73e8] rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" /> Edit Event
                          </button>
                          <button 
                            onClick={() => togglePublishStatus(event.id, event.isPublished)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-600 rounded-lg transition-colors"
                          >
                            {event.isPublished ? <X className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} 
                            {event.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-2" />
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Delete Event
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div 
                  onClick={() => router.push(`/admin/events/${event.id}`)}
                  className="p-6 flex flex-col flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#0096a4]">
                      {event.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1a365d] group-hover:text-[#0096a4] transition-colors line-clamp-2 mb-4">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-2 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-blue-50/50 flex items-center justify-center shrink-0 border border-blue-100/50">
                        <CalendarDays className="w-4 h-4 text-[#1a73e8]" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-800 truncate">{eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-xs text-slate-500 font-medium">{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50/50 p-2 rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50/50 flex items-center justify-center shrink-0 border border-emerald-100/50">
                        {isVirtual ? <Video className="w-4 h-4 text-emerald-600" /> : <MapPin className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-800 truncate">{isVirtual ? event.eventLink : event.location}</span>
                        <span className="text-xs text-slate-500 font-medium truncate">{isVirtual ? 'Virtual Link' : 'Location'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                         <div className="flex -space-x-2">
                            {[...Array(Math.min(3, event.registrationCount || 0))].map((_, i) => (
                              <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">U</div>
                            ))}
                            {(event.registrationCount || 0) > 3 && (
                              <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-600">
                                +{(event.registrationCount || 0) - 3}
                              </div>
                            )}
                         </div>
                         <span className="text-xs font-semibold text-slate-500">{event.registrationCount} Attendees</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1a365d] mb-1">No Events Found</h3>
          <p className="text-sm text-slate-500 mb-6">Try adjusting your filters or create a new event.</p>
        </div>
      )}

      {/* CREATE Event Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1a365d]/40 backdrop-blur-sm"
              onClick={() => !isSubmitting && setIsCreateModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-white sticky top-0 z-20">
                <h3 className="text-xl font-bold text-[#1a365d]">Create New Event</h3>
                <button disabled={isSubmitting} onClick={() => setIsCreateModalOpen(false)} className="p-2 text-slate-400 hover:text-[#1a365d] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <form id="createEventForm" onSubmit={handleCreateEvent} className="space-y-6">
                  {/* ... (Cover Image Upload logic stays same) ... */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
                    <input 
                      type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
                      <select 
                        value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all appearance-none"
                      >
                        <option value="CONFERENCE">Conference</option>
                        <option value="WORKSHOP">Workshop</option>
                        <option value="MEETING">Board Meeting</option>
                        <option value="SEMINAR">Seminar</option>
                        <option value="OTHERS">Others (Specify)</option>
                      </select>
                      {formData.type === 'OTHERS' && (
                        <input 
                          type="text" required value={formData.customType} onChange={(e) => setFormData({...formData, customType: e.target.value})}
                          className="w-full mt-3 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                          placeholder="Specify custom event type"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date & Time</label>
                      <input 
                        type="datetime-local" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Event Format</label>
                    <div className="flex gap-6 mb-4">
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="createFormat" value="offline" checked={formData.format === 'offline'} onChange={() => setFormData({...formData, format: 'offline'})} className="w-4 h-4 text-[#0096a4] focus:ring-[#0096a4]" />
                          <span className="text-sm font-semibold text-slate-700">Offline (Venue)</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="createFormat" value="virtual" checked={formData.format === 'virtual'} onChange={() => setFormData({...formData, format: 'virtual'})} className="w-4 h-4 text-[#0096a4] focus:ring-[#0096a4]" />
                          <span className="text-sm font-semibold text-slate-700">Virtual (Online)</span>
                       </label>
                    </div>

                    {formData.format === 'offline' ? (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Location / Address</label>
                        <input 
                          type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Event Link</label>
                        <input 
                          type="url" required value={formData.eventLink} onChange={(e) => setFormData({...formData, eventLink: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Certificate Template Selection */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0096a4]" /> Assign Certificate Template
                    </label>
                    <div className="flex gap-3 mt-3">
                      <select 
                        value={formData.certificateTemplateId} 
                        onChange={(e) => setFormData({...formData, certificateTemplateId: e.target.value})}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none appearance-none"
                      >
                        <option value="">-- No Certificate (Optional) --</option>
                        {templates.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      
                      {formData.certificateTemplateId && (
                        <button 
                          type="button"
                          onClick={() => handlePreviewTemplate(formData.certificateTemplateId)}
                          disabled={isPreviewing}
                          className="px-4 py-2.5 bg-white border border-slate-200 text-[#0096a4] rounded-xl hover:bg-[#0096a4]/5 hover:border-[#0096a4]/30 transition-all text-sm font-semibold flex items-center gap-2 whitespace-nowrap shadow-sm disabled:opacity-50"
                        >
                          {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                          Preview
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                    <textarea 
                      rows={4} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all resize-none"
                    />
                  </div>

                </form>
              </div>
              
              <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50 sticky bottom-0 z-20 flex gap-3">
                <button type="button" disabled={isSubmitting} onClick={() => setIsCreateModalOpen(false)} className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm">
                  Cancel
                </button>
                <button type="submit" form="createEventForm" disabled={isSubmitting} className="flex-1 px-4 py-3 bg-[#1a365d] hover:bg-[#0f213b] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Create Event'}
                </button>
              </div>

            </motion.div>
            <AnimatePresence>
        {isPreviewModalOpen && (
          <CertificatePreviewModal 
            isOpen={isPreviewModalOpen}
            onClose={() => { setIsPreviewModalOpen(false); setPreviewData(null); }}
            previewData={previewData}
            isLoading={isPreviewLoading}
            title="Template Rendering Preview"
          />
        )}
      </AnimatePresence>
     
          </div>
        )}
      </AnimatePresence>

      {/* EDIT Event Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1a365d]/40 backdrop-blur-sm"
              onClick={() => !isSubmitting && setIsEditModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-white sticky top-0 z-20">
                <h3 className="text-2xl font-bold text-[#1a365d]">Edit Event Details</h3>
                <button disabled={isSubmitting} onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:text-[#1a365d] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <form id="editEventForm" onSubmit={handleUpdateEvent} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
                    <input 
                      type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
                      <select 
                        value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all appearance-none"
                      >
                        <option value="CONFERENCE">Conference</option>
                        <option value="WORKSHOP">Workshop</option>
                        <option value="MEETING">Board Meeting</option>
                        <option value="SEMINAR">Seminar</option>
                        <option value="OTHERS">Others (Specify)</option>
                      </select>
                      {formData.type === 'OTHERS' && (
                        <input 
                          type="text" required value={formData.customType} onChange={(e) => setFormData({...formData, customType: e.target.value})}
                          className="w-full mt-3 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                          placeholder="Specify custom event type"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date & Time</label>
                      <input 
                        type="datetime-local" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Event Format</label>
                    <div className="flex gap-6 mb-4">
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="editFormatDetails" value="offline" checked={formData.format === 'offline'} onChange={() => setFormData({...formData, format: 'offline'})} className="w-4 h-4 text-[#0096a4] focus:ring-[#0096a4]" />
                          <span className="text-sm font-semibold text-slate-700">Offline (Venue)</span>
                       </label>
                       <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="editFormatDetails" value="virtual" checked={formData.format === 'virtual'} onChange={() => setFormData({...formData, format: 'virtual'})} className="w-4 h-4 text-[#0096a4] focus:ring-[#0096a4]" />
                          <span className="text-sm font-semibold text-slate-700">Virtual (Online)</span>
                       </label>
                    </div>

                    {formData.format === 'offline' ? (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Location / Address</label>
                        <input 
                          type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Event Link</label>
                        <input 
                          type="url" required value={formData.eventLink} onChange={(e) => setFormData({...formData, eventLink: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
                        />
                      </div>
                    )}
                  </div>

                  {/* Certificate Template Selection */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0096a4]" /> Assign Certificate Template
                    </label>
                    <div className="flex gap-3 mt-3">
                      <select 
                        value={formData.certificateTemplateId} 
                        onChange={(e) => setFormData({...formData, certificateTemplateId: e.target.value})}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none appearance-none"
                      >
                        <option value="">-- No Certificate (Optional) --</option>
                        {templates.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      
                      {formData.certificateTemplateId && (
                        <button 
                          type="button"
                          onClick={() => handlePreviewTemplate(formData.certificateTemplateId)}
                          disabled={isPreviewing}
                          className="px-4 py-2.5 bg-white border border-slate-200 text-[#0096a4] rounded-xl hover:bg-[#0096a4]/5 hover:border-[#0096a4]/30 transition-all text-sm font-semibold flex items-center gap-2 whitespace-nowrap shadow-sm disabled:opacity-50"
                        >
                          {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                          Preview
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detailed Description</label>
                    <textarea 
                      rows={6} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all resize-none"
                    />
                  </div>
                </form>
              </div>
              
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 sticky bottom-0 z-20 flex gap-4">
                <button type="button" disabled={isSubmitting} onClick={() => setIsEditModalOpen(false)} className="flex-1 px-5 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm">
                  Cancel
                </button>
                <button type="submit" form="editEventForm" disabled={isSubmitting} className="flex-1 px-5 py-3.5 bg-[#1a365d] hover:bg-[#0f213b] text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md">
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : 'Save Changes'}
                </button>
              </div>

            </motion.div>
          </div>
          
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}
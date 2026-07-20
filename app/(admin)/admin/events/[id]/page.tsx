// // app/admin/events/[id]/page.tsx
// "use client";

// import { useState, useEffect, use } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   ArrowLeft, Edit, Trash2, CalendarDays, MapPin, Users, Loader2, 
//   Image as ImageIcon, CheckCircle2, X, UploadCloud, Award, FileText,
//   Clock, AlertCircle, LayoutGrid, Video, Eye, Download
// } from 'lucide-react';
// import { 
//   getEventDetails, updateEvent, deleteEvent, 
//   uploadEventPhotos, generateEventCertificates,
//   getCertificateTemplates, previewCertificateTemplate,
//   getUserCertificateData
// } from '@/app/lib/utilities/apis';
// import CertificatePreviewModal from '@/app/(admin)/components/certificateModel'; // Adjust path if needed

// export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = use(params);
//   const router = useRouter();
  
//   const [event, setEvent] = useState<any>(null);
//   const [templates, setTemplates] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
  
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
//   const [isGeneratingCerts, setIsGeneratingCerts] = useState(false);
  
//   // Certificate Preview States
//   const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
//   const [renderData, setRenderData] = useState<any>(null);
//   const [isRenderLoading, setIsRenderLoading] = useState(false);
//   const [previewTitle, setPreviewTitle] = useState("");
  
//   const [formData, setFormData] = useState<any>(null);
//   const [coverFile, setCoverFile] = useState<File | null>(null);
//   const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

//   useEffect(() => {
//     fetchEvent();
//     fetchTemplates();
//   }, [id]);

//   const fetchEvent = async () => {
//     try {
//       setIsLoading(true);
//       const data = await getEventDetails(id);
//       setEvent(data);
      
//       const isStandardType = ['CONFERENCE', 'WORKSHOP', 'MEETING', 'SEMINAR'].includes(data.type);
//       const isVirtual = !!data.eventLink && (!data.location || data.location === '');

//       setFormData({
//         title: data.title,
//         description: data.description || '',
//         type: isStandardType ? data.type : 'OTHERS',
//         customType: isStandardType ? '' : data.type,
//         format: isVirtual ? 'virtual' : 'offline',
//         date: new Date(data.date).toISOString().slice(0, 16),
//         location: data.location || '',
//         eventLink: data.eventLink || '',
//         certificateTemplateId: data.certificateTemplateId || '',
//         isPublished: data.isPublished,
//       });
//     } catch (err: any) {
//       setError(err.message || 'Failed to load event details.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchTemplates = async () => {
//     try {
//       const data = await getCertificateTemplates();
//       setTemplates(data || []);
//     } catch (err: any) {
//       console.error("Failed to load templates:", err);
//     }
//   };

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setIsSubmitting(true);
//       const finalType = formData.type === 'OTHERS' ? formData.customType : formData.type;
      
//       const submissionData = {
//         title: formData.title,
//         description: formData.description,
//         type: finalType,
//         date: new Date(formData.date).toISOString(),
//         location: formData.format === 'offline' ? formData.location : '',
//         eventLink: formData.format === 'virtual' ? formData.eventLink : '',
//         certificateTemplateId: formData.certificateTemplateId || null,
//         isPublished: formData.isPublished,
//       };

//       await updateEvent(id, submissionData);
//       setIsEditModalOpen(false);
//       fetchEvent();
//     } catch (err: any) {
//       alert(err.message || 'Failed to update event');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (confirm("Are you sure you want to completely remove this event? This action is permanent.")) {
//       try {
//         await deleteEvent(id);
//         router.push('/admin/events');
//       } catch (err: any) {
//         alert(err.message || 'Failed to delete event');
//       }
//     }
//   };

//   const togglePublishStatus = async () => {
//     try {
//       await updateEvent(id, { isPublished: !event.isPublished });
//       fetchEvent();
//     } catch (err: any) {
//       alert('Failed to update status');
//     }
//   };

//   const handlePhotoUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!coverFile && galleryFiles.length === 0) return;

//     try {
//       setIsUploadingPhotos(true);
//       const photoData = new FormData();
//       if (coverFile) photoData.append('coverImage', coverFile);
//       galleryFiles.forEach(file => photoData.append('gallery', file));

//       await uploadEventPhotos(id, photoData);
      
//       setIsPhotoModalOpen(false);
//       setCoverFile(null);
//       setGalleryFiles([]);
//       fetchEvent();
//     } catch (err: any) {
//       alert(err.message || 'Failed to upload photos');
//     } finally {
//       setIsUploadingPhotos(false);
//     }
//   };

//   const handleGenerateCertificates = async () => {
//     try {
//       setIsGeneratingCerts(true);
//       const res = await generateEventCertificates(id);
//       alert(res.message);
//       fetchEvent(); 
//     } catch (err: any) {
//       alert(err.message || 'Failed to generate certificates. Please ensure a template is assigned.');
//     } finally {
//       setIsGeneratingCerts(false);
//     }
//   };

//   // Previews the generic template during Editing
//   const handlePreviewTemplate = async (templateId: string) => {
//     if (!templateId) return;
//     setIsRenderModalOpen(true);
//     setPreviewTitle("Template Preview");
//     try {
//       setIsRenderLoading(true);
//       const res = await previewCertificateTemplate(templateId);
//       setRenderData(res);
//     } catch (err: any) {
//       alert(err.message || "Failed to generate preview.");
//       setIsRenderModalOpen(false);
//     } finally {
//       setIsRenderLoading(false);
//     }
//   };

//   // Previews/Downloads a specific user's generated certificate
//   const handleDownloadUserCert = async (userId: string, userName: string) => {
//     setIsRenderModalOpen(true);
//     setPreviewTitle(`${userName}'s Certificate`);
//     try {
//       setIsRenderLoading(true);
//       const res = await getUserCertificateData(id, userId);
//       setRenderData(res);
//     } catch (err: any) {
//       alert(err.message || "Failed to load certificate data.");
//       setIsRenderModalOpen(false);
//     } finally {
//       setIsRenderLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="w-full h-[70vh] flex flex-col items-center justify-center">
//         <Loader2 className="w-10 h-10 text-[#0096a4] animate-spin mb-4" />
//         <p className="text-slate-500 font-semibold tracking-wide">Loading event details...</p>
//       </div>
//     );
//   }

//   if (error || !event) {
//     return (
//       <div className="w-full bg-white min-h-[50vh] max-w-4xl mx-auto p-10 rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center shadow-sm">
//         <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
//           <AlertCircle className="w-10 h-10 text-red-400" />
//         </div>
//         <h2 className="text-2xl font-bold text-slate-800 mb-3">Event Not Found</h2>
//         <p className="text-slate-500 mb-8 max-w-md">{error}</p>
//         <Link href="/admin/events" className="px-6 py-3 bg-[#1a365d] hover:bg-[#0f213b] text-white rounded-xl font-semibold transition-colors shadow-sm">
//           Return to Events
//         </Link>
//       </div>
//     );
//   }

//   const eventDate = new Date(event.date);
//   const isVirtualEvent = !!event.eventLink && (!event.location || event.location === '');

//   return (
//     <div className="w-full bg-white min-h-full   p-2 pb-12">
      
//       <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
//         <div className="flex items-start gap-4 flex-1 min-w-0">
//           <Link href="/admin/events" className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-[#1a365d] rounded-2xl transition-all shrink-0 mt-1">
//             <ArrowLeft className="w-5 h-5" />
//           </Link>
//           <div className="flex-1 min-w-0">
//             <div className="flex flex-wrap items-center gap-3 mb-2">
//               <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm ${
//                 event.isPublished ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
//               }`}>
//                 {event.isPublished ? 'Published' : 'Draft'}
//               </span>
//               <span className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[#0096a4]/10 text-[#0096a4]">
//                 {event.type}
//               </span>
//             </div>
//             <h1 className="text-3xl font-bold text-[#1a365d] leading-tight mb-2">{event.title}</h1>
//             <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
//               <span className="bg-slate-100 px-2 py-0.5 rounded-md text-xs font-mono">ID: {event.id.split('-')[0]}</span>
//               • Created on {new Date(event.createdAt || event.date).toLocaleDateString()}
//             </p>
//           </div>
//         </div>
        
//         <div className="flex flex-wrap items-center gap-3 self-start bg-slate-50 p-2 rounded-2xl border border-slate-100">
//           <button 
//             onClick={togglePublishStatus}
//             className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
//               event.isPublished 
//                 ? 'bg-white text-amber-600 hover:bg-amber-50 border border-amber-200/50' 
//                 : 'bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200/50'
//             }`}
//           >
//             {event.isPublished ? <X className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
//             {event.isPublished ? 'Unpublish' : 'Publish'}
//           </button>
          
//           <div className="w-px h-8 bg-slate-200 hidden sm:block mx-1"></div>

//           <button 
//             onClick={() => setIsPhotoModalOpen(true)}
//             className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-[#0096a4] hover:border-[#0096a4]/30 hover:bg-[#0096a4]/5 rounded-xl transition-all shadow-sm"
//           >
//             <ImageIcon className="w-4 h-4" />
//             <span className="hidden sm:inline">Media</span>
//           </button>
//           <button 
//             onClick={() => setIsEditModalOpen(true)}
//             className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-[#1a73e8] hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
//           >
//             <Edit className="w-4 h-4" />
//             <span className="hidden sm:inline">Edit</span>
//           </button>
//           <button 
//             onClick={handleDelete}
//             className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 rounded-xl transition-all shadow-sm"
//           >
//             <Trash2 className="w-4 h-4" />
//             <span className="hidden sm:inline">Delete</span>
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
//         <div className="xl:col-span-1 space-y-8">
//           <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden group">
//             <div className="h-56 bg-slate-100 relative flex items-center justify-center">
//               {event.coverImage ? (
//                 <>
//                   <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
//                   <div className="absolute inset-0 bg-[#1a365d]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
//                     <button onClick={() => setIsPhotoModalOpen(true)} className="px-5 py-2.5 bg-white text-[#1a365d] rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
//                       <UploadCloud className="w-4 h-4" /> Update Cover
//                     </button>
//                   </div>
//                 </>
//               ) : (
//                 <div className="text-center flex flex-col items-center">
//                   <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3">
//                     <ImageIcon className="w-8 h-8 text-slate-300" />
//                   </div>
//                   <button onClick={() => setIsPhotoModalOpen(true)} className="text-sm font-bold text-[#0096a4] hover:underline">Upload Cover Image</button>
//                 </div>
//               )}
//             </div>
            
//             <div className="p-6 space-y-4">
//               <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
//                 <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#1a73e8] shrink-0">
//                   <CalendarDays className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date & Time</p>
//                   <p className="text-sm font-bold text-slate-800">{eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
//                   <p className="text-sm text-slate-500 font-semibold">{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
//                 <div className={`w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 ${isVirtualEvent ? 'text-indigo-600' : 'text-emerald-600'}`}>
//                   {isVirtualEvent ? <Video className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
//                     {isVirtualEvent ? 'Virtual Link' : 'Location'}
//                   </p>
//                   {isVirtualEvent ? (
//                     <a href={event.eventLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#0096a4] hover:underline truncate block w-[160px]">
//                       {event.eventLink}
//                     </a>
//                   ) : (
//                     <p className="text-sm font-bold text-slate-800 break-words">{event.location}</p>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
//                 <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#0096a4] shrink-0">
//                   <Users className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registrations</p>
//                   <p className="text-sm font-bold text-slate-800">{event.registrationCount} <span className="font-medium text-slate-500">Attendees</span></p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
//              <h2 className="text-lg font-bold text-[#1a365d] mb-4 flex items-center gap-2">
//                <FileText className="w-5 h-5 text-[#0096a4]" />
//                About Event
//              </h2>
//              {event.description ? (
//                 <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
//              ) : (
//                 <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
//                   <p className="text-sm text-slate-400 font-medium">No description provided.</p>
//                   <button onClick={() => setIsEditModalOpen(true)} className="text-[#0096a4] text-xs font-bold mt-2 hover:underline">Add Description</button>
//                 </div>
//              )}
//           </div>
//         </div>

//         <div className="xl:col-span-2 space-y-8">
          
//           <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-[500px]">
//             <div className="px-8 py-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
//               <div>
//                 <h2 className="text-xl font-bold text-[#1a365d] flex items-center gap-3">
//                   Registered Attendees
//                   <span className="px-3 py-1 bg-blue-50 text-[#1a73e8] text-xs font-bold rounded-lg">{event.registrationCount} Total</span>
//                 </h2>
//               </div>
              
//               <button 
//                 onClick={handleGenerateCertificates}
//                 disabled={isGeneratingCerts || event.registrationCount === 0 || !event.certificateTemplateId}
//                 className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1a365d] to-[#0096a4] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-50 disabled:shadow-none"
//                 title={!event.certificateTemplateId ? 'Assign a template in Edit first' : ''}
//               >
//                 {isGeneratingCerts ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
//                 Issue Certificates
//               </button>
//             </div>
            
//             <div className="overflow-auto flex-1 p-2 custom-scrollbar">
//               <table className="w-full text-left border-collapse">
//                 <thead>
//                   <tr>
//                     <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white z-10 border-b border-slate-100">Attendee</th>
//                     <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white z-10 border-b border-slate-100">Date</th>
//                     <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white z-10 border-b border-slate-100">Status</th>
//                     <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right sticky top-0 bg-white z-10 border-b border-slate-100">Certificate</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-50">
//                   {event.EventRegistrations && event.EventRegistrations.length > 0 ? (
//                     event.EventRegistrations.map((reg: any) => (
//                       <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors group">
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#1a365d] font-bold text-sm border border-slate-200 shrink-0 group-hover:bg-[#0096a4]/10 group-hover:text-[#0096a4] group-hover:border-[#0096a4]/20 transition-colors">
//                               {reg.User?.fullName?.charAt(0) || 'U'}
//                             </div>
//                             <div>
//                               <div className="text-sm font-bold text-[#1a365d]">{reg.User?.fullName}</div>
//                               <div className="text-xs text-slate-500 font-medium">{reg.User?.email}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
//                             <Clock className="w-3.5 h-3.5 text-slate-400" />
//                             {new Date(reg.createdAt).toLocaleDateString()}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${
//                             reg.attended ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
//                           }`}>
//                             {reg.attended && <CheckCircle2 className="w-3.5 h-3.5" />}
//                             {reg.attended ? 'Attended' : 'Registered'}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-right">
//                           <div className="flex items-center justify-end gap-2">
//                             {reg.certificateUrl || reg.attended ? (
//                               <>
//                                 {reg.certificateUrl && (
//                                   <a href={reg.certificateUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-[#0096a4] bg-[#0096a4]/10 hover:bg-[#0096a4] hover:text-white rounded-xl transition-all shadow-sm" title="View PDF">
//                                     <Eye className="w-4 h-4" />
//                                   </a>
//                                 )}
//                                 <button 
//                                   onClick={() => handleDownloadUserCert(reg.User?.id, reg.User?.fullName)} 
//                                   className="p-2 text-[#1a73e8] bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm" 
//                                   title="Render & Download"
//                                 >
//                                   <Download className="w-4 h-4" />
//                                 </button>
//                               </>
//                             ) : (
//                               <span className="inline-flex items-center justify-center px-3 py-2 text-xs font-bold text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
//                                 Pending
//                               </span>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={4} className="px-6 py-20 text-center">
//                         <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
//                         <p className="text-slate-500 text-sm font-semibold">No registrations found yet.</p>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-[#1a365d] flex items-center gap-2">
//                 <LayoutGrid className="w-5 h-5 text-[#0096a4]" />
//                 Event Gallery
//                 <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg ml-2">{event.gallery?.length || 0}</span>
//               </h2>
//               <button onClick={() => setIsPhotoModalOpen(true)} className="text-sm font-bold text-[#0096a4] hover:bg-[#0096a4]/10 px-4 py-2 rounded-xl transition-colors">
//                 Manage Media
//               </button>
//             </div>
            
//             {event.gallery && event.gallery.length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//                 {event.gallery.map((imgUrl: string, idx: number) => (
//                   <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group relative">
//                     <img src={imgUrl} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
//                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
//                 <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
//                 <p className="text-sm text-slate-500 font-medium mb-4">No gallery photos uploaded yet.</p>
//                 <button onClick={() => setIsPhotoModalOpen(true)} className="px-5 py-2.5 bg-white border border-slate-200 hover:border-[#0096a4]/30 hover:bg-[#0096a4]/5 text-[#1a365d] text-sm font-bold rounded-xl transition-all shadow-sm">
//                   Upload Photos
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//       </div>

//       <AnimatePresence>
//         {isPhotoModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <motion.div 
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               className="absolute inset-0 bg-[#1a365d]/40 backdrop-blur-sm"
//               onClick={() => !isUploadingPhotos && setIsPhotoModalOpen(false)}
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden z-10"
//             >
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                   <h3 className="text-2xl font-bold text-[#1a365d]">Manage Media</h3>
//                   <p className="text-sm text-slate-500 mt-1 font-medium">Upload cover and gallery images</p>
//                 </div>
//                 <button disabled={isUploadingPhotos} onClick={() => setIsPhotoModalOpen(false)} className="p-2 text-slate-400 hover:text-[#1a365d] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <form onSubmit={handlePhotoUpload} className="space-y-8">
//                 <div>
//                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Update Cover Image</label>
//                   <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#0096a4]/40 hover:bg-[#0096a4]/5 transition-colors relative group bg-slate-50">
//                     <input 
//                       type="file" accept="image/*" id="coverUpload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                       onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)}
//                     />
//                     <div className="flex flex-col items-center pointer-events-none">
//                       {coverFile ? (
//                         <div className="text-[#0096a4] flex flex-col items-center">
//                           <CheckCircle2 className="w-10 h-10 mb-2" />
//                           <span className="text-sm font-bold">{coverFile.name}</span>
//                           <span className="text-xs font-semibold mt-1 text-slate-500">Ready to upload</span>
//                         </div>
//                       ) : (
//                         <>
//                           <UploadCloud className="w-10 h-10 text-slate-300 mb-3 group-hover:text-[#0096a4] transition-colors" />
//                           <span className="text-sm font-bold text-[#1a365d]">Drag & drop or click to upload</span>
//                           <span className="text-xs text-slate-400 font-semibold mt-2">Recommended size: 1200 x 600px</span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Add to Gallery (Multiple)</label>
//                   <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#0096a4]/40 hover:bg-[#0096a4]/5 transition-colors relative group bg-slate-50">
//                     <input 
//                       type="file" accept="image/*" multiple id="galleryUpload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                       onChange={(e) => { if (e.target.files) setGalleryFiles(Array.from(e.target.files)); }}
//                     />
//                     <div className="flex flex-col items-center pointer-events-none">
//                       {galleryFiles.length > 0 ? (
//                         <div className="text-[#0096a4] flex flex-col items-center">
//                           <LayoutGrid className="w-10 h-10 mb-2" />
//                           <span className="text-sm font-bold">{galleryFiles.length} files selected</span>
//                           <span className="text-xs font-semibold mt-1 text-slate-500">Ready to upload</span>
//                         </div>
//                       ) : (
//                         <>
//                           <ImageIcon className="w-10 h-10 text-slate-300 mb-3 group-hover:text-[#0096a4] transition-colors" />
//                           <span className="text-sm font-bold text-[#1a365d]">Click to select multiple files</span>
//                           <span className="text-xs text-slate-400 font-semibold mt-2">Hold Shift or Ctrl to select multiple</span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex gap-4 pt-4 border-t border-slate-100">
//                   <button type="button" disabled={isUploadingPhotos} onClick={() => setIsPhotoModalOpen(false)} className="flex-1 px-5 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50">
//                     Cancel
//                   </button>
//                   <button type="submit" disabled={isUploadingPhotos || (!coverFile && galleryFiles.length === 0)} className="flex-1 px-5 py-3.5 bg-[#1a365d] hover:bg-[#0f213b] text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md">
//                     {isUploadingPhotos ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : 'Upload Media'}
//                   </button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {isEditModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <motion.div 
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               className="absolute inset-0 bg-[#1a365d]/40 backdrop-blur-sm"
//               onClick={() => !isSubmitting && setIsEditModalOpen(false)}
//             />
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
//             >
//               <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-white sticky top-0 z-20">
//                 <h3 className="text-2xl font-bold text-[#1a365d]">Edit Event Details</h3>
//                 <button disabled={isSubmitting} onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:text-[#1a365d] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="overflow-y-auto p-8 custom-scrollbar">
//                 <form id="editEventForm" onSubmit={handleUpdate} className="space-y-6">
//                   <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
//                     <input 
//                       type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
//                     />
//                   </div>
                  
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
//                       <select 
//                         value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
//                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all appearance-none"
//                       >
//                         <option value="CONFERENCE">Conference</option>
//                         <option value="WORKSHOP">Workshop</option>
//                         <option value="MEETING">Board Meeting</option>
//                         <option value="SEMINAR">Seminar</option>
//                         <option value="OTHERS">Others (Specify)</option>
//                       </select>
//                       {formData.type === 'OTHERS' && (
//                         <input 
//                           type="text" required value={formData.customType} onChange={(e) => setFormData({...formData, customType: e.target.value})}
//                           className="w-full mt-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
//                           placeholder="Specify custom event type"
//                         />
//                       )}
//                     </div>
//                     <div>
//                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date & Time</label>
//                       <input 
//                         type="datetime-local" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
//                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Event Format</label>
//                     <div className="flex gap-6 mb-4">
//                        <label className="flex items-center gap-2 cursor-pointer">
//                           <input type="radio" name="editFormatDetails" value="offline" checked={formData.format === 'offline'} onChange={() => setFormData({...formData, format: 'offline'})} className="w-4 h-4 text-[#0096a4] focus:ring-[#0096a4]" />
//                           <span className="text-sm font-semibold text-slate-700">Offline (Venue)</span>
//                        </label>
//                        <label className="flex items-center gap-2 cursor-pointer">
//                           <input type="radio" name="editFormatDetails" value="virtual" checked={formData.format === 'virtual'} onChange={() => setFormData({...formData, format: 'virtual'})} className="w-4 h-4 text-[#0096a4] focus:ring-[#0096a4]" />
//                           <span className="text-sm font-semibold text-slate-700">Virtual (Online)</span>
//                        </label>
//                     </div>

//                     {formData.format === 'offline' ? (
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Location / Address</label>
//                         <input 
//                           type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
//                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
//                         />
//                       </div>
//                     ) : (
//                       <div>
//                         <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Event Link</label>
//                         <input 
//                           type="url" required value={formData.eventLink} onChange={(e) => setFormData({...formData, eventLink: e.target.value})}
//                           className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
//                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
//                       <FileText className="w-4 h-4 text-[#0096a4]" /> Assign Certificate Template
//                     </label>
//                     <div className="flex gap-3 mt-3">
//                       <select 
//                         value={formData.certificateTemplateId} 
//                         onChange={(e) => setFormData({...formData, certificateTemplateId: e.target.value})}
//                         className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none appearance-none"
//                       >
//                         <option value="">-- No Certificate (Optional) --</option>
//                         {templates.map(t => (
//                           <option key={t.id} value={t.id}>{t.name}</option>
//                         ))}
//                       </select>
                      
//                       {formData.certificateTemplateId && (
//                         <button 
//                           type="button"
//                           onClick={() => handlePreviewTemplate(formData.certificateTemplateId)}
//                           className="px-4 py-2.5 bg-white border border-slate-200 text-[#0096a4] rounded-xl hover:bg-[#0096a4]/5 hover:border-[#0096a4]/30 transition-all text-sm font-semibold flex items-center gap-2 shadow-sm"
//                         >
//                           <Eye className="w-4 h-4" /> Preview
//                         </button>
//                       )}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Detailed Description</label>
//                     <textarea 
//                       rows={6} required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
//                       className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all resize-none"
//                     />
//                   </div>
//                 </form>
//               </div>
              
//               <div className="p-8 border-t border-slate-100 bg-slate-50/50 sticky bottom-0 z-20 flex gap-4">
//                 <button type="button" disabled={isSubmitting} onClick={() => setIsEditModalOpen(false)} className="flex-1 px-5 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm">
//                   Cancel
//                 </button>
//                 <button type="submit" form="editEventForm" disabled={isSubmitting} className="flex-1 px-5 py-3.5 bg-[#1a365d] hover:bg-[#0f213b] text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md">
//                   {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : 'Save Changes'}
//                 </button>
//               </div>

//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {isRenderModalOpen && (
//           <CertificatePreviewModal 
//             isOpen={isRenderModalOpen}
//             onClose={() => { setIsRenderModalOpen(false); setRenderData(null); }}
//             previewData={renderData}
//             isLoading={isRenderLoading}
//             title={previewTitle}
//           />
//         )}
//       </AnimatePresence>

//       <style dangerouslySetInnerHTML={{__html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
//       `}} />
//     </div>
//   );
// }
// app/admin/events/[id]/page.tsx

"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Edit, Trash2, CalendarDays, MapPin, Users, Loader2, 
  Image as ImageIcon, CheckCircle2, X, UploadCloud, Award, FileText,
  Clock, AlertCircle, LayoutGrid, Video, Eye, Download
} from 'lucide-react';
import { 
  getEventDetails, updateEvent, deleteEvent, 
  uploadEventPhotos, getCertificateTemplates, previewCertificateTemplate,
  getUserCertificateData, issueCertificates,markUserAttendance
} from '@/app/lib/utilities/apis';
import CertificatePreviewModal from '@/app/(admin)/components/certificateModel';

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [event, setEvent] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [isGeneratingCerts, setIsGeneratingCerts] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  const [formData, setFormData] = useState<any>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [renderData, setRenderData] = useState<any>(null);
  const [isRenderLoading, setIsRenderLoading] = useState(false);
  const [currentUserCertName, setCurrentUserCertName] = useState("");

  useEffect(() => {
    fetchEvent();
    fetchTemplates();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const data = await getEventDetails(id);
      setEvent(data);
      
      const isStandardType = ['CONFERENCE', 'WORKSHOP', 'MEETING', 'SEMINAR'].includes(data.type);
      const isVirtual = !!data.eventLink && (!data.location || data.location === '');

      setFormData({
        title: data.title,
        description: data.description || '',
        type: isStandardType ? data.type : 'OTHERS',
        customType: isStandardType ? '' : data.type,
        format: isVirtual ? 'virtual' : 'offline',
        date: new Date(data.date).toISOString().slice(0, 16),
        location: data.location || '',
        eventLink: data.eventLink || '',
        certificateTemplateId: data.certificateTemplateId || '',
        isPublished: data.isPublished,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load event details.');
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

  const handleUpdate = async (e: React.FormEvent) => {
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

      await updateEvent(id, submissionData);
      setIsEditModalOpen(false);
      fetchEvent();
    } catch (err: any) {
      alert(err.message || 'Failed to update event');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleToggleAttendance = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // 1. Optimistic UI Update: Instantly flip the checkbox on the screen
    setEvent((prevEvent: any) => {
      if (!prevEvent) return prevEvent;
      return {
        ...prevEvent,
        EventRegistrations: prevEvent.EventRegistrations.map((reg: any) => {
          const regUserId = reg.userId || reg.User?.id;
          if (regUserId === userId) {
            return { ...reg, attended: newStatus };
          }
          return reg;
        })
      };
    });

    // 2. Call the API asynchronously in the background
    try {
      await markUserAttendance(id as string, userId, newStatus);
      // We don't need to await fetchEvent() anymore since the UI is already updated,
      // making it feel lightning fast!
    } catch (err: any) {
      // 3. If the API fails, alert the user and fetch the real data to revert the UI
      alert(err.message || 'Failed to update attendance');
      fetchEvent(); 
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to completely remove this event? This action is permanent.")) {
      try {
        await deleteEvent(id);
        router.push('/admin/events');
      } catch (err: any) {
        alert(err.message || 'Failed to delete event');
      }
    }
  };

  const togglePublishStatus = async () => {
    try {
      await updateEvent(id, { isPublished: !event.isPublished });
      fetchEvent();
    } catch (err: any) {
      alert('Failed to update status');
    }
  };

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverFile && galleryFiles.length === 0) return;

    try {
      setIsUploadingPhotos(true);
      const photoData = new FormData();
      if (coverFile) photoData.append('coverImage', coverFile);
      galleryFiles.forEach(file => photoData.append('gallery', file));

      await uploadEventPhotos(id, photoData);
      
      setIsPhotoModalOpen(false);
      setCoverFile(null);
      setGalleryFiles([]);
      fetchEvent();
    } catch (err: any) {
      alert(err.message || 'Failed to upload photos');
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const handleIssueCertificates = async () => {
    try {
      setIsGeneratingCerts(true);
      const res = await issueCertificates(id);
      alert(`${res.message}. Issued for ${res.issuedCount} attendees.`);
      fetchEvent(); 
    } catch (err: any) {
      alert(err.message || 'Failed to issue certificates. Please ensure a template is assigned.');
    } finally {
      setIsGeneratingCerts(false);
    }
  };

  const handlePreviewTemplate = async (templateId: string) => {
    if (!templateId) return;
    setIsRenderModalOpen(true);
    setCurrentUserCertName("Template Preview");
    try {
      setIsRenderLoading(true);
      const res = await previewCertificateTemplate(templateId);
 
      setRenderData(res);
    } catch (err: any) {
      alert(err.message || "Failed to generate preview.");
      setIsRenderModalOpen(false);
    } finally {
      setIsRenderLoading(false);
    }
  };

  const handleDownloadUserCert = async (userId: string, userName: string) => {
    setIsRenderModalOpen(true);
    setCurrentUserCertName(userName);
    try {
      setIsRenderLoading(true);
      const res = await getUserCertificateData(id, userId);
       setRenderData(res);
    } catch (err: any) {
      alert(err.message || "Failed to load certificate data.");
      setIsRenderModalOpen(false);
    } finally {
      setIsRenderLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#0096a4] animate-spin mb-4" />
        <p className="text-slate-500 font-semibold tracking-wide">Loading event details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="w-full bg-white min-h-[50vh] max-w-4xl mx-auto p-10 rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-3">Event Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-md">{error}</p>
        <Link href="/admin/events" className="px-6 py-3 bg-[#1a365d] hover:bg-[#0f213b] text-white rounded-xl font-semibold transition-colors shadow-sm">
          Return to Events
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isVirtualEvent = !!event.eventLink && (!event.location || event.location === '');

  return (
    <div className="w-full bg-white min-h-full  p-2 pb-12">
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <Link href="/admin/events" className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-[#1a365d] rounded-2xl transition-all shrink-0 mt-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                event.isPublished ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {event.isPublished ? 'Published' : 'Draft'}
              </span>
              <span className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[#0096a4]/10 text-[#0096a4]">
                {event.type}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#1a365d] leading-tight mb-2">{event.title}</h1>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
              <span className="bg-slate-100 px-2 py-0.5 rounded-md text-xs font-mono">ID: {event.id.split('-')[0]}</span>
              • Created on {new Date(event.createdAt || event.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 self-start bg-slate-50 p-2 rounded-2xl border border-slate-100">
          <button 
            onClick={togglePublishStatus}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              event.isPublished 
                ? 'bg-white text-amber-600 hover:bg-amber-50 border border-amber-200/50' 
                : 'bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200/50'
            }`}
          >
            {event.isPublished ? <X className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {event.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          
          <div className="w-px h-8 bg-slate-200 hidden sm:block mx-1"></div>
          <button 
              type="button"
            onClick={() => handlePreviewTemplate(formData.certificateTemplateId)}
                          disabled={isPreviewing}
                          className="px-4 py-2.5 bg-white border border-slate-200 text-[#0096a4] rounded-xl hover:bg-[#0096a4]/5 hover:border-[#0096a4]/30 transition-all text-sm font-semibold flex items-center gap-2 whitespace-nowrap shadow-sm disabled:opacity-50"
                        >
                          {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                          Preview
                        </button>
          <button 
            onClick={() => setIsPhotoModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-[#0096a4] hover:border-[#0096a4]/30 hover:bg-[#0096a4]/5 rounded-xl transition-all shadow-sm"
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Media</span>
          </button>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-[#1a73e8] hover:border-blue-300 hover:bg-blue-50 rounded-xl transition-all shadow-sm"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-300 hover:bg-red-50 rounded-xl transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div className="xl:col-span-1 space-y-8">
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden group">
            <div className="h-56 bg-slate-100 relative flex items-center justify-center">
              {event.coverImage ? (
                <>
                  <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#1a365d]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button onClick={() => setIsPhotoModalOpen(true)} className="px-5 py-2.5 bg-white text-[#1a365d] rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                      <UploadCloud className="w-4 h-4" /> Update Cover
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3">
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  </div>
                  <button onClick={() => setIsPhotoModalOpen(true)} className="text-sm font-bold text-[#0096a4] hover:underline">Upload Cover Image</button>
                </div>
              )}
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#1a73e8] shrink-0">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date & Time</p>
                  <p className="text-sm font-bold text-slate-800">{eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  <p className="text-sm text-slate-500 font-semibold">{eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                <div className={`w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 ${isVirtualEvent ? 'text-indigo-600' : 'text-emerald-600'}`}>
                  {isVirtualEvent ? <Video className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {isVirtualEvent ? 'Virtual Link' : 'Location'}
                  </p>
                  {isVirtualEvent ? (
                    <a href={event.eventLink} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#0096a4] hover:underline truncate block w-[160px]">
                      {event.eventLink}
                    </a>
                  ) : (
                    <p className="text-sm font-bold text-slate-800 break-words">{event.location}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#0096a4] shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Registrations</p>
                  <p className="text-sm font-bold text-slate-800">{event.registrationCount} <span className="font-medium text-slate-500">Attendees</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
             <h2 className="text-lg font-bold text-[#1a365d] mb-4 flex items-center gap-2">
               <FileText className="w-5 h-5 text-[#0096a4]" />
               About Event
             </h2>
             {event.description ? (
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
             ) : (
                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400 font-medium">No description provided.</p>
                  <button onClick={() => setIsEditModalOpen(true)} className="text-[#0096a4] text-xs font-bold mt-2 hover:underline">Add Description</button>
                </div>
             )}
          </div>
        </div>

        <div className="xl:col-span-2 space-y-8">
          
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-[500px]">
            <div className="px-8 py-6 border-b border-slate-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-[#1a365d] flex items-center gap-3">
                  Registered Attendees
                  <span className="px-3 py-1 bg-blue-50 text-[#1a73e8] text-xs font-bold rounded-lg">{event.registrationCount} Total</span>
                </h2>
              </div>
              
              <button 
                onClick={handleIssueCertificates}
                disabled={isGeneratingCerts || event.registrationCount === 0 || !event.certificateTemplateId || event.certificatesIssued}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold shadow-md transition-all disabled:opacity-50 disabled:shadow-none ${event.certificatesIssued ? 'bg-emerald-100 text-emerald-700' : 'bg-gradient-to-r from-[#1a365d] to-[#0096a4] text-white hover:shadow-lg hover:opacity-95'}`}
                title={!event.certificateTemplateId ? 'Assign a template in Edit first' : ''}
              >
                {isGeneratingCerts ? <Loader2 className="w-4 h-4 animate-spin" /> : (event.certificatesIssued ? <CheckCircle2 className="w-4 h-4" /> : <Award className="w-4 h-4" />)}
                {event.certificatesIssued ? 'Certificates Issued' : 'Issue Certificates'}
              </button>
            </div>
            
            <div className="overflow-auto flex-1 p-2 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white z-10 border-b border-slate-100">Attendee</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white z-10 border-b border-slate-100">Date</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-white z-10 border-b border-slate-100">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right sticky top-0 bg-white z-10 border-b border-slate-100">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {event.EventRegistrations && event.EventRegistrations.length > 0 ? (
                    event.EventRegistrations.map((reg: any) => (
                      <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#1a365d] font-bold text-sm border border-slate-200 shrink-0 group-hover:bg-[#0096a4]/10 group-hover:text-[#0096a4] group-hover:border-[#0096a4]/20 transition-colors">
                              {reg.User?.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-[#1a365d]">{reg.User?.fullName}</div>
                              <div className="text-xs text-slate-500 font-medium">{reg.User?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(reg.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
  <label className={`flex items-center gap-3 w-max  cursor-pointer group'}`}>
    
    {/* Custom Styled Checkbox */}
    <div className="relative flex items-center justify-center">
      <input 
        type="checkbox" 
        checked={reg.attended || false}
         
        onChange={() => handleToggleAttendance(reg.userId || reg.User?.id, reg.attended)}
        className="peer sr-only"
      />
      <div className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${
        reg.attended 
          ? 'bg-[#0096a4] border-[#0096a4]' 
          : 'bg-white border-slate-300 group-hover:border-[#0096a4]'
      }`}>
        <CheckCircle2 className={`w-3.5 h-3.5 text-white transition-opacity ${reg.attended ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
      </div>
    </div>

    {/* Status Pill */}
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
      reg.attended ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
    }`}>
      {reg.attended ? 'Attended' : 'Registered'}
    </div>
    
  </label>
</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {event.certificatesIssued && reg.attended ? (
                              <>
                                {reg.certificateUrl && (
                                  <a href={reg.certificateUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-[#0096a4] bg-[#0096a4]/10 hover:bg-[#0096a4] hover:text-white rounded-xl transition-all shadow-sm" title="View PDF">
                                    <Eye className="w-4 h-4" />
                                  </a>
                                )}
                                <button 
                                  onClick={() => handleDownloadUserCert(reg.User?.id, reg.User?.fullName)} 
                                  className="p-2 text-[#1a73e8] bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm" 
                                  title="Render & Download"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <span className="inline-flex items-center justify-center px-3 py-2 text-xs font-bold text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                                Pending
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center">
                        <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm font-semibold">No registrations found yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1a365d] flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-[#0096a4]" />
                Event Gallery
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg ml-2">{event.gallery?.length || 0}</span>
              </h2>
              <button onClick={() => setIsPhotoModalOpen(true)} className="text-sm font-bold text-[#0096a4] hover:bg-[#0096a4]/10 px-4 py-2 rounded-xl transition-colors">
                Manage Media
              </button>
            </div>
            
            {event.gallery && event.gallery.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {event.gallery.map((imgUrl: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group relative">
                    <img src={imgUrl} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium mb-4">No gallery photos uploaded yet.</p>
                <button onClick={() => setIsPhotoModalOpen(true)} className="px-5 py-2.5 bg-white border border-slate-200 hover:border-[#0096a4]/30 hover:bg-[#0096a4]/5 text-[#1a365d] text-sm font-bold rounded-xl transition-all shadow-sm">
                  Upload Photos
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {isPhotoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1a365d]/40 backdrop-blur-sm"
              onClick={() => !isUploadingPhotos && setIsPhotoModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden z-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-[#1a365d]">Manage Media</h3>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Upload cover and gallery images</p>
                </div>
                <button disabled={isUploadingPhotos} onClick={() => setIsPhotoModalOpen(false)} className="p-2 text-slate-400 hover:text-[#1a365d] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePhotoUpload} className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Update Cover Image</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#0096a4]/40 hover:bg-[#0096a4]/5 transition-colors relative group bg-slate-50">
                    <input 
                      type="file" accept="image/*" id="coverUpload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)}
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      {coverFile ? (
                        <div className="text-[#0096a4] flex flex-col items-center">
                          <CheckCircle2 className="w-10 h-10 mb-2" />
                          <span className="text-sm font-bold">{coverFile.name}</span>
                          <span className="text-xs font-semibold mt-1 text-slate-500">Ready to upload</span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-10 h-10 text-slate-300 mb-3 group-hover:text-[#0096a4] transition-colors" />
                          <span className="text-sm font-bold text-[#1a365d]">Drag & drop or click to upload</span>
                          <span className="text-xs text-slate-400 font-semibold mt-2">Recommended size: 1200 x 600px</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Add to Gallery (Multiple)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#0096a4]/40 hover:bg-[#0096a4]/5 transition-colors relative group bg-slate-50">
                    <input 
                      type="file" accept="image/*" multiple id="galleryUpload" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => { if (e.target.files) setGalleryFiles(Array.from(e.target.files)); }}
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      {galleryFiles.length > 0 ? (
                        <div className="text-[#0096a4] flex flex-col items-center">
                          <LayoutGrid className="w-10 h-10 mb-2" />
                          <span className="text-sm font-bold">{galleryFiles.length} files selected</span>
                          <span className="text-xs font-semibold mt-1 text-slate-500">Ready to upload</span>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-10 h-10 text-slate-300 mb-3 group-hover:text-[#0096a4] transition-colors" />
                          <span className="text-sm font-bold text-[#1a365d]">Click to select multiple files</span>
                          <span className="text-xs text-slate-400 font-semibold mt-2">Hold Shift or Ctrl to select multiple</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button type="button" disabled={isUploadingPhotos} onClick={() => setIsPhotoModalOpen(false)} className="flex-1 px-5 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={isUploadingPhotos || (!coverFile && galleryFiles.length === 0)} className="flex-1 px-5 py-3.5 bg-[#1a365d] hover:bg-[#0f213b] text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md">
                    {isUploadingPhotos ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : 'Upload Media'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-8 border-b border-slate-100 bg-white sticky top-0 z-20">
                <h3 className="text-2xl font-bold text-[#1a365d]">Edit Event Details</h3>
                <button disabled={isSubmitting} onClick={() => setIsEditModalOpen(false)} className="p-2 text-slate-400 hover:text-[#1a365d] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-8 custom-scrollbar">
                <form id="editEventForm" onSubmit={handleUpdate} className="space-y-6">
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
                          className="w-full mt-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all"
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

      <AnimatePresence>
        {isRenderModalOpen && (
          <CertificatePreviewModal 
            isOpen={isRenderModalOpen}
            onClose={() => { setIsRenderModalOpen(false); setRenderData(null); }}
            previewData={renderData}
            isLoading={isRenderLoading}
            title={currentUserCertName === "Template Preview" ? "Template-Preview" : `${currentUserCertName}'s Certificate`}
          />
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}
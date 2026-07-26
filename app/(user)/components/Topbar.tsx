// "use client";

// import { useState, useEffect } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Menu, X, ChevronRight, Bell, LogOut, User, CreditCard } from 'lucide-react';
// import UserSidebar from './Sidebar';
// import { getCurrentUser, logoutUser } from '@/app/lib/utilities/apis';

// export default function UserTopbar() {
//   const pathname = usePathname();
//   const router = useRouter();
  
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [user, setUser] = useState<{ name?: string; fullName?: string; role?: string; email?: string } | null>(null);

//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const data = await getCurrentUser();
//         setUser(data.user);
//       } catch (error) {
//         router.push('/login');
//       }
//     }
//     fetchUser();
//   }, [router]);

//   const handleLogout = async () => {
//     try {
//       await logoutUser();
//       window.location.href = '/login'; 
//     } catch (error) {
//       console.error("Failed to log out", error);
//     }
//   };

//   const generateBreadcrumbs = () => {
//     const segments = pathname.split('/').filter((v) => v.length > 0);
//     return segments.map((segment, index) => {
//       const href = '/' + segments.slice(0, index + 1).join('/');
//       const isLast = index === segments.length - 1;
//       const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

//       return (
//         <div key={href} className="flex items-center">
//           <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1.5 shrink-0" />
//           {isLast ? (
//             <span className="text-sm font-semibold text-[#1a365d]">{title}</span>
//           ) : (
//             <Link href={href} className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
//               {title}
//             </Link>
//           )}
//         </div>
//       );
//     });
//   };

//   const displayName = user?.fullName || user?.name || 'Loading...';
//   const displayRole = user?.role?.replace('_', ' ') || 'MEMBER';
//   const initials = displayName !== 'Loading...' 
//     ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
//     : 'U';

//   return (
//     <>
//       <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-emerald-100/50 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shrink-0">
        
//         {/* Left Side: Mobile Menu Toggle & Breadcrumbs */}
//         <div className="flex items-center gap-4">
//           <button 
//             onClick={() => setIsMobileMenuOpen(true)}
//             className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-[#1a365d] rounded-lg hover:bg-emerald-50 transition-colors"
//           >
//             <Menu className="w-5 h-5" />
//           </button>
          
//           <div className="hidden sm:flex items-center">
//             <Link href="/dashboard" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
//               Portal
//             </Link>
//             {pathname !== '/dashboard' && generateBreadcrumbs()}
//           </div>
//         </div>

//         {/* Right Side: Actions & Profile */}
//         <div className="flex items-center gap-4">
//           <button className="relative p-2 text-slate-400 hover:text-[#0096a4] transition-colors rounded-full hover:bg-emerald-50">
//             <Bell className="w-5 h-5" strokeWidth={1.5} />
//             <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white" />
//           </button>
          
//           <div className="h-6 w-px bg-emerald-100/50 hidden sm:block" />
          
//           {/* Profile Dropdown Container */}
//           <div className="relative">
//             <button 
//               onClick={() => setIsProfileOpen(!isProfileOpen)}
//               className="flex items-center gap-3 cursor-pointer group rounded-full focus:outline-none"
//             >
//               <div className="hidden sm:block text-right">
//                 <p className="text-xs font-bold text-[#1a365d] leading-none mb-0.5">
//                   {displayName}
//                 </p>
//                 <p className="text-[10px] text-emerald-600 font-semibold tracking-widest leading-none uppercase">
//                   {displayRole}
//                 </p>
//               </div>
//               <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-700 text-xs font-bold border border-emerald-200/50 shadow-inner group-hover:shadow-md transition-all">
//                 {initials}
//               </div>
//             </button>

//             {/* Dropdown Menu */}
//             <AnimatePresence>
//               {isProfileOpen && (
//                 <>
//                   <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  
//                   <motion.div
//                     initial={{ opacity: 0, y: 10, scale: 0.95 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: 10, scale: 0.95 }}
//                     transition={{ duration: 0.15, ease: "easeOut" }}
//                     className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,150,164,0.08)] border border-emerald-50 z-50 overflow-hidden origin-top-right"
//                   >
//                     <div className="p-4 border-b border-emerald-50/50 bg-emerald-50/30">
//                       <p className="text-sm font-bold text-[#1a365d] truncate">{displayName}</p>
//                       <p className="text-xs font-medium text-slate-500 truncate mt-0.5">{user?.email || 'Loading...'}</p>
//                     </div>

//                     <div className="p-2 space-y-1">
//                       <Link 
//                         href="/profile" 
//                         onClick={() => setIsProfileOpen(false)}
//                         className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition-colors"
//                       >
//                         <User className="w-4 h-4" /> My Profile
//                       </Link>
//                       <Link 
//                         href="/membership" 
//                         onClick={() => setIsProfileOpen(false)}
//                         className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition-colors"
//                       >
//                         <CreditCard className="w-4 h-4" /> Billing & Membership
//                       </Link>
                      
//                       <div className="h-px bg-emerald-50/50 w-full my-1" />
                      
//                       <button 
//                         onClick={handleLogout}
//                         className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
//                       >
//                         <LogOut className="w-4 h-4" /> Sign Out
//                       </button>
//                     </div>
//                   </motion.div>
//                 </>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Menu Overlay */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={() => setIsMobileMenuOpen(false)}
//               className="fixed inset-0 bg-[#0f213b]/40 backdrop-blur-sm z-40 lg:hidden"
//             />
//             <motion.div
//               initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//               className="fixed top-0 left-0 bottom-0 bg-white z-50 lg:hidden shadow-2xl"
//             >
//               <UserSidebar closeMobileMenu={() => setIsMobileMenuOpen(false)} />
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ChevronRight, Bell, LogOut, User, Edit2, 
  Mail, Phone, Camera, Loader2, CheckCircle2 
} from 'lucide-react';
import UserSidebar from './Sidebar';
import { getCurrentUser, logoutUser, getUserProfile, updateUserProfile } from '@/app/lib/utilities/userApis';

export default function UserTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Base Topbar State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; fullName?: string; role?: string; email?: string } | null>(null);

  // Profile Popup State
  const [detailedProfile, setDetailedProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Edit Form State
  const [editName, setEditName] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBasicUser();
  }, [router]);

  // Fetch data when dropdown opens
  useEffect(() => {
    if (isProfileOpen) {
      fetchDetailedProfile();
    } else {
      // Reset states when closed
      setIsEditing(false);
      setSelectedImage(null);
      setPreviewImage(null);
    }
  }, [isProfileOpen]);

  const fetchBasicUser = async () => {
    try {
      const data = await getCurrentUser();
      setUser(data.user);
    } catch (error) {
      router.push('/login');
    }
  };

  const fetchDetailedProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const data = await getUserProfile();
      setDetailedProfile(data);
      setEditName(data.fullName || '');
    } catch (error) {
      console.error("Failed to load detailed profile");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const submitData = new FormData();
      
      if (editName !== detailedProfile.fullName) {
        submitData.append('fullName', editName);
      }
      if (selectedImage) {
        submitData.append('profilePicture', selectedImage);
      }

      if (!submitData.has('fullName') && !submitData.has('profilePicture')) {
        setIsEditing(false);
        return;
      }

      await updateUserProfile(submitData);
      await fetchDetailedProfile(); 
      await fetchBasicUser(); 
      
      setIsEditing(false);
      setSelectedImage(null);
      setPreviewImage(null);
    } catch (error: any) {
      alert(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter((v) => v.length > 0);
    return segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const isLast = index === segments.length - 1;
      const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

      return (
        <div key={href} className="flex items-center">
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1.5 shrink-0" />
          {isLast ? (
            <span className="text-sm font-medium text-[#1a365d]">{title}</span>
          ) : (
            <Link href={href} className="text-sm font-normal text-slate-500 hover:text-emerald-600 transition-colors">
              {title}
            </Link>
          )}
        </div>
      );
    });
  };

  const displayName = user?.fullName || user?.name || 'Loading...';
  const displayRole = user?.role?.replace('_', ' ') || 'MEMBER';
  const initials = displayName !== 'Loading...' 
    ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : 'U';

  const avatarSrc = previewImage || detailedProfile?.profilePicture ;

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-emerald-100/50 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shrink-0">
        
        {/* Left Side: Mobile Menu Toggle & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-[#1a365d] rounded-lg hover:bg-emerald-50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:flex items-center">
            <Link href="/user/dashboard" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">
              Portal
            </Link>
            {pathname !== '/dashboard' && generateBreadcrumbs()}
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-[#0096a4] transition-colors rounded-full hover:bg-emerald-50">
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white" />
          </button>
          
          <div className="h-6 w-px bg-emerald-100/50 hidden sm:block" />
          
          {/* Rich Profile Dropdown Container */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-3 cursor-pointer group rounded-full focus:outline-none pr-1 pl-3 py-1 transition-colors ${isProfileOpen ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
            >
              <div className="hidden sm:block text-right">
                <p className="text-xs font-medium text-[#1a365d] leading-none mb-0.5">
                  {displayName}
                </p>
                <p className="text-[10px] text-emerald-600 font-medium tracking-widest leading-none uppercase">
                  {displayRole}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-700 text-xs font-medium border border-emerald-200/50 shadow-inner group-hover:shadow-md transition-all overflow-hidden">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  initials
                )}
              </div>
            </button>

            {/* The Rich Popup Card */}
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-3 w-[340px] bg-white rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-slate-100 z-50 overflow-hidden origin-top-right flex flex-col"
                  >
                    
                    {/* Header Area */}
                    <div className="p-6 pb-5 flex items-start justify-between border-b border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-emerald-700 text-lg font-medium overflow-hidden border border-slate-200 shrink-0 relative group">
                          {avatarSrc ? (
                            <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            detailedProfile?.initials || initials
                          )}
                          
                          {/* Quick camera icon if editing */}
                          {isEditing && (
                            <label className="absolute inset-0 bg-slate-900/40 flex items-center justify-center cursor-pointer transition-colors hover:bg-slate-900/50">
                              <Camera className="w-5 h-5 text-white stroke-[1.5]" />
                              <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-medium text-slate-800 truncate leading-tight">
                            {detailedProfile?.fullName || displayName}
                          </h3>
                          <p className="text-xs font-normal text-slate-500 truncate mt-0.5">
                            {detailedProfile?.email || user?.email}
                          </p>
                        </div>
                      </div>
                      
                      {!isEditing && (
                        <button 
                          onClick={() => setIsEditing(true)} 
                          className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5 transition-colors shrink-0"
                        >
                          <Edit2 className="w-3 h-3 stroke-[1.5]" /> Edit
                        </button>
                      )}
                    </div>

                    {/* Body Area */}
                    <div className="  bg-slate-50/50">
                      {isLoadingProfile ? (
                        <div className="py-8 flex flex-col items-center justify-center">
                          <Loader2 className="w-6 h-6 text-[#0096a4] animate-spin stroke-[1.5] mb-2" />
                          <p className="text-xs font-medium text-slate-500">Loading profile...</p>
                        </div>
                      ) : isEditing ? (
                        /* EDIT MODE */
                        <div className="space-y-4 p-3">
                          <div>
                            <label className="block text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                            <input 
                              type="text" 
                              value={editName} 
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all shadow-sm"
                            />
                          </div>
                          
                          <div className="pt-2 flex gap-3">
                            <button 
                              onClick={() => { setIsEditing(false); setPreviewImage(null); setSelectedImage(null); setEditName(detailedProfile?.fullName || ''); }}
                              className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={handleSaveProfile} 
                              disabled={isSaving || (editName === detailedProfile?.fullName && !selectedImage)}
                              className="flex-1 flex items-center justify-center gap-2 bg-[#1a365d] hover:bg-[#12284b] text-white py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm disabled:opacity-50"
                            >
                              {isSaving ? <Loader2 className="w-4 h-4 animate-spin stroke-[1.5]" /> : <CheckCircle2 className="w-4 h-4 stroke-[1.5]" />}
                              {isSaving ? 'Saving...' : 'Save'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* VIEW MODE (Card Style matching image) */
                        <div className="bg-white border border-slate-100  p-1.5 shadow-sm">
                          
                          {/* Name Row */}
                          <div className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                            <div className="w-9 h-9 rounded-full bg-[#0096a4]/10 text-[#0096a4] flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 stroke-[1.5]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-medium text-slate-400 leading-none mb-1">Full Name</p>
                              <p className="text-sm font-medium text-slate-800 leading-none truncate">{detailedProfile?.fullName || displayName}</p>
                            </div>
                          </div>
                          
                          <div className="h-px bg-slate-50 w-full" />
                          
                          {/* Email Row */}
                          <div className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <Mail className="w-4 h-4 stroke-[1.5]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-medium text-slate-400 leading-none mb-1">Email</p>
                              <p className="text-sm font-medium text-slate-800 leading-none truncate">{detailedProfile?.email || user?.email}</p>
                            </div>
                          </div>

                          <div className="h-px bg-slate-50 w-full" />
                          
                          {/* Phone / Detail Row */}
                          {/* <div className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <Phone className="w-4 h-4 stroke-[1.5]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-medium text-slate-400 leading-none mb-1">Phone Number</p>
                              <p className="text-sm font-medium text-slate-800 leading-none truncate">{detailedProfile?.phone || 'Not provided'}</p>
                            </div>
                          </div> */}

                        </div>
                      )}
                    </div>

                    {/* Footer Area (Logout) */}
                    {!isEditing && (
                      <div className="p-4 border-t border-slate-100 bg-white">
                        <button 
                          onClick={handleLogout} 
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50/50 text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-all"
                        >
                          <LogOut className="w-4 h-4 stroke-[1.5]" /> Sign Out
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0f213b]/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 bg-white z-50 lg:hidden shadow-2xl"
            >
              <UserSidebar closeMobileMenu={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
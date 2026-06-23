"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, CalendarDays, Camera, Loader2, AlertCircle, 
  CheckCircle2, Save, ShieldCheck, BadgeCheck, UploadCloud, Trash2
} from 'lucide-react';
import { getUserProfile, updateUserProfile } from '@/app/lib/utilities/userApis';

export default function UserProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [formData, setFormData] = useState({ fullName: '' });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getUserProfile();
      setProfile(data);
      setFormData({ fullName: data.fullName || '' });
    } catch (err: any) {
      setError(err.message || 'Failed to load profile details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setError('');

    try {
      setIsSaving(true);
      const submitData = new FormData();
      
      if (formData.fullName !== profile.fullName) {
        submitData.append('fullName', formData.fullName);
      }
      if (selectedImage) {
        submitData.append('profilePicture', selectedImage);
      }

      if (!submitData.has('fullName') && !submitData.has('profilePicture')) {
        return; // No changes
      }

      await updateUserProfile(submitData);
      
      setSuccessMessage('Profile updated successfully.');
      setSelectedImage(null);
      setPreviewImage(null);
      await fetchProfile(); 
      
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
        <p className="text-slate-500 font-medium text-sm tracking-wide">Loading your profile...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="w-full bg-white min-h-[40vh] rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center p-8 shadow-sm">
        <AlertCircle className="w-10 h-10 text-red-400 mb-4 stroke-[1.5]" />
        <p className="text-slate-600 font-medium text-sm">{error}</p>
      </div>
    );
  }

  const currentAvatarSrc = previewImage || profile?.profilePicture;
  const isModified = formData.fullName !== profile?.fullName || selectedImage !== null;

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-2">
        <div>
          <h1 className="text-2xl font-medium text-slate-800 tracking-tight">Account Settings</h1>
          <p className="text-sm font-normal text-slate-500 mt-1">
            Manage your personal identity, contact information, and security preferences.
          </p>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700 shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[1.5]" />
            <p className="text-sm font-medium">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: ID Card / Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
            
            {/* Minimalist Top Accent */}
            <div className="h-2 w-full bg-gradient-to-r from-[#1a365d] to-[#0096a4]"></div>
            
            <div className="p-8 flex flex-col items-center text-center border-b border-slate-50">
              <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center mb-5 relative">
                {currentAvatarSrc ? (
                  <img src={currentAvatarSrc} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="text-3xl font-medium text-slate-400">
                    {profile?.initials || 'U'}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-medium text-slate-800 tracking-tight mb-1">
                {formData.fullName || profile?.fullName}
              </h2>
              <p className="text-sm font-medium text-[#0096a4] flex items-center gap-1.5 justify-center">
                <ShieldCheck className="w-4 h-4 stroke-[1.5]" /> {profile?.membershipStatus === 'ACTIVE' ? 'Active Member' : 'Portal User'}
              </p>
            </div>

            <div className="p-6 bg-slate-50/50 space-y-4">
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">User ID</p>
                <p className="text-sm font-mono font-medium text-slate-700">{profile?.id?.split('-')[0] || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Member Since</p>
                <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-slate-400 stroke-[1.5]" />
                  {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Settings Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Personal Information */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-50">
                <h3 className="text-lg font-medium text-[#1a365d] mb-1">Personal Information</h3>
                <p className="text-sm font-normal text-slate-500">Update your photo and personal details.</p>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                
                {/* Photo Upload Area */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-4">Profile Photo</label>
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                      {currentAvatarSrc ? (
                        <img src={currentAvatarSrc} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-3">
                        <label className="px-4 py-2 bg-slate-50 border border-slate-200 text-[#0096a4] rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2 shadow-sm">
                          <UploadCloud className="w-4 h-4 stroke-[1.5]" /> Choose New
                          <input 
                            type="file" 
                            ref={fileInputRef}
                            accept="image/png, image/jpeg, image/jpg" 
                            onChange={handleImageChange} 
                            className="hidden" 
                          />
                        </label>
                        {previewImage && (
                          <button 
                            type="button" onClick={clearImageSelection}
                            className="px-4 py-2 bg-white border border-slate-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2 shadow-sm"
                          >
                            <Trash2 className="w-4 h-4 stroke-[1.5]" /> Remove
                          </button>
                        )}
                      </div>
                      <p className="text-xs font-normal text-slate-400">JPG, GIF or PNG. Max size of 2MB.</p>
                    </div>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Full Legal Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.fullName} 
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#0096a4]/20 focus:border-[#0096a4] outline-none transition-all shadow-sm"
                    placeholder="Enter your full name"
                  />
                  <p className="text-xs font-normal text-slate-400 mt-2">This name will appear on your certificates and public profile.</p>
                </div>

              </div>
            </div>

            {/* Section 2: Contact & Security */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-50">
                <h3 className="text-lg font-medium text-[#1a365d] mb-1">Contact & Security</h3>
                <p className="text-sm font-normal text-slate-500">Your email address and account security settings.</p>
              </div>
              
              <div className="p-6 md:p-8">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail className="w-4 h-4 stroke-[1.5]" />
                    </div>
                    <input 
                      type="email" 
                      disabled 
                      value={profile?.email || ''} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-normal text-slate-500 outline-none cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100">
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[1.5]" />
                      <span className="text-[10px] font-medium text-emerald-700 uppercase tracking-widest">Verified</span>
                    </div>
                  </div>
                  <p className="text-xs font-normal text-slate-400 mt-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 stroke-[1.5]" /> Email changes must be requested through admin support.
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky Save Bar */}
            <div className="sticky bottom-4 z-30 w-full p-4 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <div className="hidden sm:block text-sm font-medium text-slate-500">
                {isModified ? 'Unsaved changes' : 'Profile is up to date'}
              </div>
              <button 
                type="submit" 
                disabled={isSaving || !isModified}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1a365d] hover:bg-[#12284b] text-white px-8 py-3 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:shadow-none"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin stroke-[1.5]" /> : <Save className="w-4 h-4 stroke-[1.5]" />} 
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
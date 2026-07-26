// app/register/page.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User, Phone, ArrowRight, ArrowLeft, Building2, 
  GraduationCap, UploadCloud, Clock, CheckCircle2, MapPin, 
  BriefcaseMedical, Check, Eye, EyeOff, FileSignature
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/app/lib/utilities/apis';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Unified Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    cityDistrict: '',
    email: '',
    password: '',
    confirmPassword: '',
    qualification: '',
    otherQualification: '',
    currentDesignation: '',
    currentHospital: '',
    experience: ''
  });

  // File State mapped exactly to the API keys
  const [files, setFiles] = useState<{
    eduCertificate: File | null;
    govId: File | null;
    expCertificate: File | null;
    photo: File | null;
  }>({
    eduCertificate: null,
    govId: null,
    expCertificate: null,
    photo: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [fieldName]: e.target.files[0] });
    }
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const submissionData = new FormData();
      submissionData.append('fullName', formData.fullName);
      submissionData.append('phone', formData.phone);
      submissionData.append('cityDistrict', formData.cityDistrict);
      submissionData.append('email', formData.email);
      submissionData.append('password', formData.password);
      
      const finalQualification = formData.qualification === 'other' ? formData.otherQualification : formData.qualification;
      submissionData.append('highestQualification', finalQualification);
      submissionData.append('currentDesignation', formData.currentDesignation);
      submissionData.append('currentHospital', formData.currentHospital);
      submissionData.append('clinicalEmbryologyExpYrs', formData.experience);

      if (files.eduCertificate) submissionData.append('eduCertificate', files.eduCertificate);
      if (files.expCertificate) submissionData.append('expCertificate', files.expCertificate);
      if (files.photo) submissionData.append('photo', files.photo);
      if (files.govId) submissionData.append('govId', files.govId);

      await registerUser(submissionData);
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white font-sans selection:bg-[#0096a4]/20">
      
      {/* Left Panel: Register Wizard Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 relative overflow-y-auto">
        <div className="w-full max-w-md py-12">
          
          {/* Mobile Header Logo */}
          <div className="mb-10 lg:hidden flex justify-center">
            <Link href="/">
              <Image src="/images/Logo-NoBg.png" alt="EAAP Logo" width={200} height={70} className="h-14 w-auto object-contain" priority />
            </Link>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-semibold text-[#1a365d] mb-2 tracking-tight">Membership Application</h2>
            <p className="text-slate-500 font-light">Join the official state network of clinical embryologists.</p>
          </div>

          {/* 3-Step Engaging Stepper */}
          <div className="flex items-center gap-2 mb-10">
            {[
              { num: 1, label: 'General' },
              { num: 2, label: 'Professional' },
              { num: 3, label: 'Documents' }
            ].map((s) => (
              <div key={s.num} className={`flex flex-col gap-1.5 flex-1 transition-opacity duration-500 ${step >= s.num ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`flex items-center justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest ${step >= s.num ? 'text-[#0096a4]' : 'text-slate-400'}`}>
                  <span>Step {s.num}</span>
                  {step > s.num && <Check className="w-3 h-3 text-[#0096a4]" />}
                </div>
                <div className={`h-1.5 rounded-full transition-colors duration-500 ${step >= s.num ? 'bg-[#0096a4]' : 'bg-slate-100'}`} />
              </div>
            ))}
          </div>

          <div className="relative min-h-[520px]">
            {/* Error Message Display */}
            {error && (
              <div className="mb-6 bg-red-50 text-red-500 border border-red-100 p-4 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              
              {/* STEP 1: Personal Information */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <form className="space-y-4" onSubmit={handleNextStep1}>
                    <div className="space-y-1.5 group">
                      <label htmlFor="fullName" className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">Full Name (As per ID)</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                        <input 
                          type="text" 
                          id="fullName" 
                          name="fullName" 
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required 
                          className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light" 
                          placeholder="Dr. Jane Doe" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 group">
                        <label htmlFor="phone" className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                          <input 
                            type="tel" 
                            id="phone" 
                            name="phone" 
                            value={formData.phone}
                            onChange={handleInputChange}
                            required 
                            className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light" 
                            placeholder="+91" 
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 group">
                        <label htmlFor="cityDistrict" className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">City / District</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                          <input 
                            type="text" 
                            id="cityDistrict" 
                            name="cityDistrict" 
                            value={formData.cityDistrict}
                            onChange={handleInputChange}
                            required 
                            className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light" 
                            placeholder="Vijayawada" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 group">
                      <label htmlFor="email" className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleInputChange}
                          required 
                          className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light" 
                          placeholder="doctor@example.com" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 group">
                        <label htmlFor="password" className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">Create Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                          <input 
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            name="password" 
                            value={formData.password}
                            onChange={handleInputChange}
                            required 
                            className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-11 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light" 
                            placeholder="••••••••" 
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0096a4] transition-colors p-1">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 group">
                        <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                          <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required 
                            className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-11 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light" 
                            placeholder="••••••••" 
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0096a4] transition-colors p-1">
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-[#1a365d] hover:bg-[#0f213b] text-white rounded-xl py-4 font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(26,54,93,0.15)] flex items-center justify-center gap-2 mt-8 group active:scale-[0.98]">
                      Next: Professional Details
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: Professional Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <form className="space-y-4" onSubmit={handleNextStep2}>
                    <div className="space-y-1.5 group">
                      <label htmlFor="qualification" className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">Highest Qualification</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                        <select 
                          id="qualification" 
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleInputChange}
                          required 
                          className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light appearance-none"
                        >
                          <option value="">Select Qualification</option>
                          <option value="bsc">B.Sc Clinical Embryology</option>
                          <option value="msc">M.Sc Clinical Embryology</option>
                          <option value="phd">Ph.D in Reproductive Medicine</option>
                          <option value="md">MD / MS (OBG)</option>
                          <option value="mbbs">MBBS</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <AnimatePresence>
                      {formData.qualification === 'other' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="space-y-1.5 group overflow-hidden"
                        >
                          <label htmlFor="otherQualification" className="text-xs font-semibold text-[#0096a4] uppercase tracking-widest">Please Specify Qualification</label>
                          <div className="relative">
                            <FileSignature className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0096a4]" />
                            <input 
                              type="text" 
                              id="otherQualification" 
                              name="otherQualification" 
                              value={formData.otherQualification}
                              onChange={handleInputChange}
                              required 
                              className="w-full bg-white border border-[#0096a4]/30 text-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light shadow-[0_2px_10px_rgba(0,150,164,0.05)]" 
                              placeholder="e.g., Diploma in ART" 
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="space-y-1.5 group">
                      <label htmlFor="currentDesignation" className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">Current Designation</label>
                      <div className="relative">
                        <BriefcaseMedical className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                        <input 
                          type="text" 
                          id="currentDesignation" 
                          name="currentDesignation" 
                          value={formData.currentDesignation}
                          onChange={handleInputChange}
                          required 
                          className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light" 
                          placeholder="e.g., Senior Embryologist, Lab Director" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 group">
                      <label htmlFor="currentHospital" className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">Current Hospital / ART Clinic</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                        <input 
                          type="text" 
                          id="currentHospital" 
                          name="currentHospital" 
                          value={formData.currentHospital}
                          onChange={handleInputChange}
                          required 
                          className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light" 
                          placeholder="e.g., Nova IVF Fertility" 
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 group">
                      <label htmlFor="experience" className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-focus-within:text-[#0096a4] transition-colors">Clinical Embryology Exp (Yrs)</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0096a4] transition-colors" />
                        <input 
                          type="number" 
                          id="experience" 
                          name="experience" 
                          min="0" 
                          value={formData.experience}
                          onChange={handleInputChange}
                          required 
                          className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#0096a4] focus:ring-4 focus:ring-[#0096a4]/10 transition-all font-light" 
                          placeholder="0" 
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button type="button" onClick={() => setStep(1)} className="w-1/4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 rounded-xl py-4 font-medium transition-all shadow-sm flex items-center justify-center active:scale-[0.98]">
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <button type="submit" className="w-3/4 bg-[#1a365d] hover:bg-[#0f213b] text-white rounded-xl py-4 font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(26,54,93,0.15)] flex items-center justify-center gap-2 group active:scale-[0.98]">
                        Next: Documents
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* STEP 3: Document Uploads */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    
                    <div className="bg-[#0096a4]/5 border border-[#0096a4]/20 rounded-xl p-4 mb-4">
                      <p className="text-sm text-[#1a365d] font-light leading-relaxed">
                        To help expedite your application, you may upload your credentials below (PDF/Image, max 5MB). <strong>All uploads are optional at this stage</strong> and can be submitted later in your portal.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Professional Photo', name: 'photo', desc: "For ID card", fileObj: files.photo , isRequired : true    },
                        { label: 'Govt ID Proof', name: 'govId', desc: "Aadhar/Passport", fileObj: files.govId },
                        { label: 'Highest Degree Cert.', name: 'eduCertificate', desc: "BSc/MSc/MD", fileObj: files.eduCertificate }, 
                        { label: 'Experience Letter', name: 'expCertificate', desc: "From current/past org", fileObj: files.expCertificate },
                       
                      ].map((doc, idx) => (
                        <div key={idx} className={`relative group cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 ${doc.fileObj ? 'bg-[#0096a4]/10 border-[#0096a4]' : 'border-slate-200 bg-slate-50 hover:bg-[#0096a4]/5 hover:border-[#0096a4]/40'}`}>
                          <input 
                            type="file" 
                            name={doc.name} 
                            id={doc.name} 
                            required={!!doc.isRequired}  
                            onChange={(e) => handleFileChange(e, doc.name as keyof typeof files)} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                            accept=".pdf,image/*" 
                          />
                          <div className="px-3 py-5 flex flex-col items-center justify-center text-center">
                            <div className={`w-10 h-10 rounded-full shadow-sm border flex items-center justify-center mb-3 transition-transform ${doc.fileObj ? 'bg-[#0096a4] border-[#0096a4] text-white' : 'bg-white border-slate-100 text-slate-400 group-hover:scale-110 group-hover:text-[#0096a4]'}`}>
                              {doc.fileObj ? <CheckCircle2 className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
                            </div>
                            <span className="text-[12px] font-semibold text-[#1a365d] group-hover:text-[#0096a4] leading-tight transition-colors mb-1">
                              {doc.label} {doc.isRequired && <span className="text-red-500">*</span>}
                            </span>
                             <span className="text-[10px] text-slate-500 font-light truncate max-w-[100px]">{doc.fileObj ? doc.fileObj.name : doc.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button type="button" onClick={() => setStep(2)} disabled={isLoading} className="w-1/4 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 rounded-xl py-4 font-medium transition-all shadow-sm flex items-center justify-center active:scale-[0.98] disabled:opacity-50">
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <button type="submit" disabled={isLoading} className="w-3/4 bg-[#0096a4] hover:bg-[#00828f] text-white rounded-xl py-4 font-medium transition-all duration-300 shadow-[0_4px_20px_rgba(0,150,164,0.25)] flex items-center justify-center gap-2 group active:scale-[0.98] disabled:opacity-70">
                        {isLoading ? 'Submitting...' : 'Submit Application'}
                        {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-light text-sm">
              Already a member?{' '}
              <Link href="/login" className="font-medium text-[#1a365d] hover:text-[#0096a4] transition-colors underline underline-offset-4 decoration-slate-200 hover:decoration-[#0096a4]">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Right Panel: Immersive Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#FAFAFA] border-l border-slate-100 flex-col justify-between p-12 lg:p-16 relative overflow-hidden">
        
        {/* Dynamic Watermark & Gradients */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-[600px] z-10" />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            className="absolute -right-[10%] w-[800px] h-[800px] opacity-[0.03] mix-blend-multiply"
          >
            <Image src="/images/small-logo.png" alt="EAAP Watermark" fill className=" h-29 w-auto object-contain" />
          </motion.div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#0096a4]/5 rounded-full blur-[120px] z-0" />
        </div>

        {/* Abstract Medical Structures - Adjusted for Right Panel */}
        <motion.div className="absolute inset-0 w-full z-0 flex justify-center items-center pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full h-full max-w-[800px] max-h-[800px] text-[#0096a4]"
          >
             {/* Dividing Cell */}
             <svg className="absolute top-[15%] right-[10%] w-72 h-72" viewBox="0 0 200 200" fill="none">
              <motion.circle animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
              <circle cx="85" cy="85" r="35" stroke="currentColor" strokeWidth="2" className="opacity-60" />
              <circle cx="120" cy="115" r="32" stroke="currentColor" strokeWidth="2" className="opacity-60" />
              <circle cx="125" cy="75" r="28" stroke="currentColor" strokeWidth="2" className="opacity-60" />
              <circle cx="75" cy="125" r="30" stroke="currentColor" strokeWidth="2" className="opacity-60" />
            </svg>

             {/* DNA Helix */}
             <motion.svg 
              animate={{ rotate: 360 }} 
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              className="absolute md:top-[35%] md:left-[5%] w-64 h-64 md:w-96 md:h-96 opacity-20 md:opacity-40" viewBox="0 0 200 200" fill="none"
            >
              <path d="M20,100 C60,20 140,20 180,100 C220,180 300,180 340,100" stroke="currentColor" strokeWidth="2" />
              <path d="M20,100 C60,180 140,180 180,100 C220,20 300,20 340,100" stroke="currentColor" strokeWidth="2" />
              <line x1="40" y1="80" x2="40" y2="120" stroke="currentColor" strokeWidth="1" />
              <line x1="70" y1="50" x2="70" y2="150" stroke="currentColor" strokeWidth="1" />
              <line x1="100" y1="35" x2="100" y2="165" stroke="currentColor" strokeWidth="1" />
              <line x1="130" y1="50" x2="130" y2="150" stroke="currentColor" strokeWidth="1" />
              <line x1="160" y1="80" x2="160" y2="120" stroke="currentColor" strokeWidth="1" />
            </motion.svg>

             {/* Molecular Chain */}
             <motion.svg 
              animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute md:bottom-[10%] md:right-[20%] w-56 h-56 md:w-[22rem] md:h-[22rem] opacity-20 md:opacity-50" viewBox="0 0 200 200" fill="none"
            >
              <circle cx="50" cy="150" r="12" fill="currentColor" />
              <circle cx="100" cy="100" r="16" stroke="currentColor" strokeWidth="3" />
              <circle cx="160" cy="80" r="10" fill="currentColor" />
              <circle cx="130" cy="160" r="8" stroke="currentColor" strokeWidth="2" />
              <line x1="50" y1="150" x2="100" y2="100" stroke="currentColor" strokeWidth="2" />
              <line x1="100" y1="100" x2="160" y2="80" stroke="currentColor" strokeWidth="2" />
              <line x1="100" y1="100" x2="130" y2="160" stroke="currentColor" strokeWidth="2" />
            </motion.svg>

            {/* Biochemical Hexagon */}
            <motion.svg 
              animate={{ rotate: 360 }} 
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="absolute top-[60%] right-[5%] w-48 h-48 opacity-30" viewBox="0 0 200 200" fill="none"
            >
              <path d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
              <line x1="100" y1="20" x2="100" y2="60" stroke="currentColor" strokeWidth="2" />
              <line x1="30" y1="140" x2="65" y2="120" stroke="currentColor" strokeWidth="2" />
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* Top: Logo (Bigger & Left Aligned) */}
        <div className="relative z-10 flex justify-start">
          <Link href="/">
            <Image src="/images/Logo-NoBg.png" alt="EAAP Logo" width={280} height={100} className="h-20 w-auto object-contain" priority />
          </Link>
        </div>

        {/* Middle: Engaging Copy (Left Aligned) */}
        <div className="relative z-10 w-full max-w-lg text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
              <span className="flex w-2 h-2 rounded-full bg-[#1a365d] animate-pulse" />
              <span className="text-[#0096a4] text-xs font-bold uppercase tracking-widest">Join The Association</span>
            </div>
            
            <h1 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-5xl xl:text-6xl text-[#1a365d] leading-[1.1] mb-6 tracking-tight">
              Elevate your <br/>
              <span className="italic text-[#0096a4] font-light">Practice.</span>
            </h1>
            <p className="text-slate-500 font-light text-lg leading-relaxed mb-12">
              Join Andhra Pradesh's definitive regulatory and scientific body for clinical embryologists. Upload your credentials to secure your professional future today.
            </p>

            {/* Floating Stat Card (Left aligned within container) */}
            
          </motion.div>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10 text-sm text-slate-400 font-light flex justify-start">
          <span>Protected by standard encryption policies.</span>
        </div>
      </div>
    </main>
  );
}
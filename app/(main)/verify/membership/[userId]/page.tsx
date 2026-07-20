"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Loader2, 
  CheckCircle2, 
  User, 
  Calendar, 
  Hash,
  Award
} from 'lucide-react';

export default function VerifyMembership() {
  const params = useParams();
  const userId = params?.userId as string;
  
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scanTime, setScanTime] = useState<string>('');

  useEffect(() => {
    setScanTime(new Date().toLocaleString());

    const verify = async () => {
      if (!userId) return;
      
      try {
        const res = await fetch(`/api/verify/membership/${userId}`);
        const data = await res.json();
        
        if (!res.ok) {
          setResult({ 
            valid: false, 
            error: data.error || "Verification failed. Unrecognized credential." 
          });
          return;
        }

        setResult(data);
      } catch (err) {
        setResult({ 
          valid: false, 
          error: "Network error occurred while connecting to the registry." 
        });
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [userId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm mb-4">
            <Award className="w-6 h-6 text-[#1a365d] stroke-[1.5]" />
          </div>
          <h1 className="text-xl font-medium text-[#1a365d] tracking-tight">EAAP Credential Verification</h1>
          <p className="text-sm font-normal text-slate-500 mt-1">Official Registry</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden relative"
        >
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-[#0096a4] animate-spin mb-6 stroke-[1.5]" />
              <h2 className="text-lg font-medium text-slate-800 tracking-tight mb-2">Verifying Record</h2>
              <p className="text-sm font-normal text-slate-500">Checking secure database...</p>
            </div>
          ) : result?.valid && result?.data ? (
            <div>
              <div className="bg-emerald-50 border-b border-emerald-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 shadow-inner border border-emerald-200/50 z-10">
                  <ShieldCheck className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h2 className="text-2xl font-medium text-emerald-800 tracking-tight z-10">Authentic Record</h2>
                <p className="text-sm font-normal text-emerald-600/80 mt-1 z-10">This membership certificate is valid and active.</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 stroke-[1.5]" /> Member Name
                  </p>
                  <p className="text-lg font-medium text-slate-800">{result.data.name}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 stroke-[1.5]" /> Credential ID
                  </p>
                  <p className="text-base font-medium text-slate-800 font-mono">{result.data.membershipId}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Status</p>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span className="text-[10px] font-medium uppercase tracking-widest">{result.data.status}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 stroke-[1.5]" /> Issued On
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {new Date(result.data.memberSince).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-6 shadow-inner border border-red-100">
                <ShieldAlert className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h2 className="text-2xl font-medium text-slate-800 tracking-tight mb-2">Verification Failed</h2>
              <p className="text-sm font-normal text-slate-500 mb-8">{result?.error || "Invalid or unrecognized credential."}</p>
              
              <div className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-normal text-slate-500 text-left">
                If you believe this is an error, please contact the EAAP administration for support.
              </div>
            </div>
          )}
        </motion.div>

        <div className="text-center mt-8 text-xs font-normal text-slate-400 min-h-[20px]">
          {scanTime ? `Scanned at ${scanTime}` : ''}
        </div>
        
      </div>
    </div>
  );
}
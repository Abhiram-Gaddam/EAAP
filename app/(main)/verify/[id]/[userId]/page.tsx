"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Loader2, 
  User, 
  Calendar, 
  Hash,
  FileBadge
} from 'lucide-react';

export default function VerifyEventCertificate() {
  const params = useParams();
  
  // Safely handle the param whether the folder is named [id] or [eventId]
  const eventId = (params?.eventId || params?.id) as string;
  const userId = params?.userId as string;
  
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create state for the scan time to avoid hydration mismatch
  const [scanTime, setScanTime] = useState<string>('');

  useEffect(() => {
    // Set the time ONLY on the client after mounting
    setScanTime(new Date().toLocaleString());

    const verify = async () => {
      if (!eventId || !userId) return;

      try {
        const res = await fetch(`/api/verify/${eventId}/${userId}`);
        const data = await res.json();
        
        // Handle non-200 responses safely
        if (!res.ok) {
          setResult({ 
            valid: false, 
            error: data.error || "Verification failed. Unrecognized certificate." 
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
  }, [eventId, userId]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        
        {/* Header / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm mb-4">
            <FileBadge className="w-6 h-6 text-[#0096a4] stroke-[1.5]" />
          </div>
          <h1 className="text-xl font-medium text-[#1a365d] tracking-tight">EAAP Event Verification</h1>
          <p className="text-sm font-normal text-slate-500 mt-1">Official Registry</p>
        </div>

        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden relative"
        >
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-10 h-10 text-[#0096a4] animate-spin mb-6 stroke-[1.5]" />
              <h2 className="text-lg font-medium text-slate-800 tracking-tight mb-2">Verifying Certificate</h2>
              <p className="text-sm font-normal text-slate-500">Checking secure database...</p>
            </div>
          ) : result?.valid && result?.data ? (
            <div>
              {/* Success Banner */}
              <div className="bg-[#0096a4]/5 border-b border-[#0096a4]/10 p-8 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0096a4]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#0096a4] mb-4 shadow-sm border border-slate-100 z-10">
                  <ShieldCheck className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h2 className="text-2xl font-medium text-[#1a365d] tracking-tight z-10">Authentic Certificate</h2>
                <p className="text-sm font-normal text-slate-500 mt-1 z-10">This event participation record is valid.</p>
              </div>

              {/* Data Display */}
              <div className="p-8 space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 stroke-[1.5]" /> Participant Name
                  </p>
                  <p className="text-lg font-medium text-slate-800">{result.data.name}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileBadge className="w-3.5 h-3.5 stroke-[1.5]" /> Event Title
                  </p>
                  <p className="text-base font-medium text-slate-800">{result.data.eventTitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 stroke-[1.5]" /> Event Date
                    </p>
                    <p className="text-sm font-medium text-slate-800">
                      {new Date(result.data.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 stroke-[1.5]" /> Certificate ID
                    </p>
                    <p className="text-xs font-medium text-slate-800 font-mono break-all">{result.data.certificateId}</p>
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
              <p className="text-sm font-normal text-slate-500 mb-8">{result?.error || "Invalid or unrecognized certificate."}</p>
              
              <div className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs font-normal text-slate-500 text-left">
                If you believe this is an error, please contact the EAAP administration for support.
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs font-normal text-slate-400 min-h-[20px]">
          {scanTime ? `Scanned at ${scanTime}` : ''}
        </div>
        
      </div>
    </div>
  );
}
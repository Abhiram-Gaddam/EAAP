// "use client";

// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useRouter } from 'next/navigation';
// import { 
//   ShieldCheck, Award, CreditCard, Loader2, AlertCircle, 
//   CheckCircle2, ArrowRight, Download, Sparkles 
// } from 'lucide-react';
// import { 
//   getUserDashboard, // Assuming this exists in your userApis
//   getMembershipCertificate, 
//   getCurrentUser 
// } from '@/app/lib/utilities/userApis';
// import CertificatePreviewModal from '@/app/(admin)/components/certificateModel';

// // Utility to load the Razorpay script dynamically
// const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// const BENEFITS = [
//   "Official EAAP Membership Certificate & Digital ID Card",
//   "Unrestricted access to the Research & Publications library",
//   "Priority registration access to all CMEs, Workshops, and Conferences",
//   "Voting rights in EAAP general body meetings and elections",
//   "Zero recurring annual fees or hidden renewal charges—valid for life"
// ];

// export default function UserMembershipPage() {
//   const router = useRouter();
  
//   // Data States
//   const [data, setData] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Payment States
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false);

//   // Certificate Rendering States
//   const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
//   const [renderData, setRenderData] = useState<any>(null);
//   const [isCertLoading, setIsCertLoading] = useState(false);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setIsLoading(true);
//       const res = await getUserDashboard();
//       setData(res);
//     } catch (err: any) {
//       setError(err.message || 'Failed to load membership data.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- PAYMENT LOGIC ---
//   const handlePayment = async () => {
//     setIsProcessingPayment(true);

//     const isScriptLoaded = await loadRazorpayScript();
//     if (!isScriptLoaded) {
//       alert('Razorpay failed to load. Please check your connection.');
//       setIsProcessingPayment(false);
//       return;
//     }

//     try {
//       const response = await fetch('/api/admin/membership/create-order', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//       });
      
//       if (response.status === 401) {
//         router.push("/login");
//         return;
//       }
      
//       const orderData = await response.json();

//       if (!response.ok) {
//         throw new Error(orderData.error || 'Failed to initialize payment');
//       }

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: orderData.amount, 
//         currency: orderData.currency,
//         name: 'EAAP', 
//         description: 'Lifetime Membership Fee',
//         order_id: orderData.orderId, 
        
//         handler: async function (razorpayResponse: any) {
//           try {
//             const verifyRes = await fetch('/api/admin/membership/verify-payment', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({
//                 razorpay_order_id: razorpayResponse.razorpay_order_id,
//                 razorpay_payment_id: razorpayResponse.razorpay_payment_id,
//                 razorpay_signature: razorpayResponse.razorpay_signature,
//               }),
//             });
        
//             const result = await verifyRes.json();
        
//             if (!verifyRes.ok) throw new Error(result.error);
        
//             alert('Payment verified! Your membership is now active.');
//             window.location.reload(); 
//           } catch (err: any) {
//             alert('Payment done but verification failed. Please contact support.');
//             console.error(err);
//           }
//         },
//         prefill: {
//           name: data?.user?.fullName || '',
//           email: data?.user?.email || '',
//         },
//         theme: {
//           color: '#0096a4', 
//         },
//       };

//       const paymentObject = new (window as any).Razorpay(options);
      
//       paymentObject.on('payment.failed', function (response: any) {
//         alert(`Payment failed: ${response.error.description}`);
//       });

//       paymentObject.open();

//     } catch (error: any) {
//       console.error(error);
//       alert(error.message);
//     } finally {
//       setIsProcessingPayment(false);
//     }
//   };

//   // --- CERTIFICATE LOGIC ---
//   const handleViewCertificate = async () => {
//     try {
//       setIsCertLoading(true);
      
//       const userData = await getCurrentUser();
//       if (!userData?.user?.userId) {
//         throw new Error("Could not authenticate user session.");
//       }

//       const res = await getMembershipCertificate(userData.user.userId);
      
//       setRenderData(res);
//       setIsRenderModalOpen(true);

//     } catch (err: any) {
//       alert(err.message || "Failed to load membership certificate data.");
//     } finally {
//       setIsCertLoading(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="w-full h-[60vh] flex flex-col items-center justify-center">
//         <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
//         <p className="text-slate-500 font-medium text-sm tracking-wide">Loading membership details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full bg-white min-h-[40vh] rounded-3xl border border-red-100 flex flex-col items-center justify-center text-center p-8 shadow-sm">
//         <AlertCircle className="w-10 h-10 text-red-400 mb-4 stroke-[1.5]" />
//         <p className="text-slate-600 font-medium text-sm">{error}</p>
//       </div>
//     );
//   }

//   const user = data?.user || {};
//   const isMembershipActive = user.membershipStatus === 'APPROVED';

//   return (
//     <div className="w-full max-w-[1200px] mx-auto space-y-10 pb-12">
      
//       {/* Page Header */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-medium text-slate-800 tracking-tight">Membership Portal</h1>
//         <p className="text-sm font-normal text-slate-500 mt-1 max-w-2xl">
//           Manage your official EAAP membership, access your credentials, and review your benefits.
//         </p>
//       </div>

//       <AnimatePresence mode="wait">
//         {isMembershipActive ? (
          
//           /* ========================================= */
//           /* ACTIVE MEMBER STATE                       */
//           /* ========================================= */
//           <motion.div 
//             key="active"
//             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//             className="space-y-8"
//           >
//             {/* Premium Certificate Card */}
//             <div className="w-full bg-gradient-to-br from-[#1a365d] to-[#12284b] rounded-[2.5rem] p-1 relative overflow-hidden shadow-[0_8px_30px_rgba(26,54,93,0.15)]">
//               <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
//               <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0096a4]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

//               <div className="bg-[#1a365d]/40 backdrop-blur-md rounded-[2.4rem] p-8 md:p-12 border border-white/10 relative z-10 flex flex-col md:flex-row items-center gap-10">
                
//                 <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#0096a4] to-teal-500 flex items-center justify-center shrink-0 shadow-inner border border-white/20">
//                   <Award className="w-12 h-12 text-white stroke-[1.5]" />
//                 </div>

//                 <div className="flex-1 text-center md:text-left min-w-0">
//                   <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-medium uppercase tracking-widest mb-4">
//                     <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" /> Active Lifetime Member
//                   </div>
//                   <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight truncate mb-3">
//                     {user.fullName || 'Member'}
//                   </h2>
//                   <p className="text-sm font-normal text-slate-300">
//                     Your credentials are fully verified and your lifetime membership is active. You have full access to all EAAP benefits and privileges.
//                   </p>
//                 </div>

//                 <div className="shrink-0 w-full md:w-auto">
//                   <button 
//                     onClick={handleViewCertificate}
//                     disabled={isCertLoading}
//                     className="w-full md:w-auto px-8 py-4 bg-white text-[#1a365d] hover:bg-slate-50 rounded-2xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
//                   >
//                     {isCertLoading ? (
//                       <><Loader2 className="w-5 h-5 stroke-[1.5] animate-spin" /> Preparing...</>
//                     ) : (
//                       <><Download className="w-5 h-5 stroke-[1.5]" /> View Official Certificate</>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Benefits Reminder */}
//             <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-10 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
//               <h3 className="text-lg font-medium text-[#1a365d] mb-6 flex items-center gap-2">
//                 <ShieldCheck className="w-5 h-5 text-[#0096a4] stroke-[1.5]" /> Your Privileges
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {BENEFITS.map((benefit, idx) => (
//                   <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
//                     <CheckCircle2 className="w-5 h-5 text-[#0096a4] stroke-[1.5] shrink-0 mt-0.5" />
//                     <span className="text-sm font-normal text-slate-600 leading-relaxed">{benefit}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
          
//         ) : (

//           /* ========================================= */
//           /* INACTIVE / UNPAID STATE                   */
//           /* ========================================= */
//           <motion.div 
//             key="inactive"
//             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//             className="grid grid-cols-1 lg:grid-cols-12 gap-8"
//           >
//             {/* Left Column: Benefits & Context */}
//             <div className="lg:col-span-7 space-y-6">
//               <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-10 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
//                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a365d]/5 border border-[#1a365d]/10 text-[#1a365d] text-[11px] font-medium uppercase tracking-widest mb-6 shadow-sm">
//                   <Sparkles className="w-3.5 h-3.5 text-[#0096a4] stroke-[1.5]" /> Membership Pending
//                 </div>
                
//                 <h2 className="text-3xl font-medium text-[#1a365d] tracking-tight mb-4">
//                   Unlock Lifetime Access
//                 </h2>
//                 <p className="text-base font-normal text-slate-500 leading-relaxed mb-8">
//                   You are one step away from joining Andhra Pradesh's premier network of clinical embryologists. Complete your admission fee payment to activate your account and instantly unlock all member privileges.
//                 </p>

//                 <div className="space-y-4 pt-6 border-t border-slate-100">
//                   {BENEFITS.map((benefit, idx) => (
//                     <div key={idx} className="flex items-start gap-3">
//                       <CheckCircle2 className="w-5 h-5 text-[#0096a4] stroke-[1.5] shrink-0 mt-0.5" />
//                       <span className="text-sm font-normal text-slate-600 leading-relaxed">{benefit}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Right Column: Checkout Card */}
//             <div className="lg:col-span-5">
//               <div className="sticky top-24 bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
//                 <div className="h-2 w-full bg-gradient-to-r from-[#1a365d] to-[#0096a4]" />
                
//                 <div className="p-8 md:p-10">
//                   <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
//                     <div>
//                       <h3 className="text-lg font-medium text-slate-800">Admission Fee</h3>
//                       <p className="text-xs font-normal text-slate-500 mt-1">One-time payment</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-3xl font-medium text-[#1a365d]">₹1,500</p>
//                     </div>
//                   </div>

//                   <button 
//                     onClick={handlePayment}
//                     disabled={isProcessingPayment}
//                     className="w-full py-4 bg-[#0096a4] hover:bg-[#007a86] text-white rounded-xl text-base font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 group mb-6"
//                   >
//                     {isProcessingPayment ? (
//                       <><Loader2 className="w-5 h-5 stroke-[1.5] animate-spin" /> Processing Securely...</>
//                     ) : (
//                       <><CreditCard className="w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform" /> Pay & Activate Membership</>
//                     )}
//                   </button>

//                   <p className="text-xs font-normal text-slate-400 text-center leading-relaxed">
//                     By proceeding, you agree to the EAAP terms of membership. Payments are processed securely via Razorpay.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Reusable Render Modal */}
//       <AnimatePresence>
//         {isRenderModalOpen && (
//           <CertificatePreviewModal 
//             isOpen={isRenderModalOpen}
//             onClose={() => { 
//               setIsRenderModalOpen(false); 
//               setRenderData(null); 
//             }}
//             previewData={renderData}
//             isLoading={false} 
//             title="Official Membership Certificate"
//           />
//         )}
//       </AnimatePresence>

//     </div>
//   );
// }
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Award, CreditCard, Loader2, AlertCircle, 
  CheckCircle2, ArrowRight, Download, Sparkles, Clock,
  FileSearch
} from 'lucide-react';
import { 
  getUserDashboard, 
  getMembershipCertificate, 
  getCurrentUser 
} from '@/app/lib/utilities/userApis';
import CertificatePreviewModal from '@/app/(admin)/components/certificateModel';

// Utility to load the Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BENEFITS = [
  "Official EAAP Membership Certificate & Digital ID Card",
  "Unrestricted access to the Research & Publications library",
  "Priority registration access to all CMEs, Workshops, and Conferences",
  "Voting rights in EAAP general body meetings and elections",
  "Zero recurring annual fees or hidden renewal charges—valid for life"
];

export default function UserMembershipPage() {
  const router = useRouter();
  
  // Data States
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Payment States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Certificate Rendering States
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [renderData, setRenderData] = useState<any>(null);
  const [isCertLoading, setIsCertLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await getUserDashboard();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load membership data.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- PAYMENT LOGIC ---
  const handlePayment = async () => {
    setIsProcessingPayment(true);

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Razorpay failed to load. Please check your connection.');
      setIsProcessingPayment(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/membership/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.status === 401) {
        router.push("/login");
        return;
      }
      
      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount, 
        currency: orderData.currency,
        name: 'EAAP', 
        description: 'Lifetime Membership Fee',
        order_id: orderData.orderId, 
        
        handler: async function (razorpayResponse: any) {
          try {
            const verifyRes = await fetch('/api/admin/membership/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
              }),
            });
        
            const result = await verifyRes.json();
        
            if (!verifyRes.ok) throw new Error(result.error);
        
            alert('Payment verified! Awaiting admin approval.');
            window.location.reload(); 
          } catch (err: any) {
            alert('Payment done but verification failed. Please contact support.');
            console.error(err);
          }
        },
        prefill: {
          name: data?.user?.fullName || '',
          email: data?.user?.email || '',
        },
        theme: {
          color: '#0096a4', 
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });

      paymentObject.open();

    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // --- CERTIFICATE LOGIC ---
  const handleViewCertificate = async () => {
    try {
      setIsCertLoading(true);
      
      const userData = await getCurrentUser();
      if (!userData?.user?.userId) {
        throw new Error("Could not authenticate user session.");
      }

      const res = await getMembershipCertificate(userData.user.userId);
      
      setRenderData(res);
      setIsRenderModalOpen(true);

    } catch (err: any) {
      alert(err.message || "Failed to load membership certificate data.");
    } finally {
      setIsCertLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0096a4] animate-spin mb-4 stroke-[1.5]" />
        <p className="text-slate-500 font-medium text-sm tracking-wide">Loading membership details...</p>
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

  const user = data?.user || {};
  const status = user.membershipStatus;
  const isMembershipActive = status === 'APPROVED';
  const isMembershipPending = status === 'PENDING_APPROVAL';

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-10 pb-12">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-slate-800 tracking-tight">Membership Portal</h1>
        <p className="text-sm font-normal text-slate-500 mt-1 max-w-2xl">
          Manage your official EAAP membership, access your credentials, and review your benefits.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isMembershipActive ? (
          
          /* ========================================= */
          /* ACTIVE MEMBER STATE                       */
          /* ========================================= */
          <motion.div 
            key="active"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Premium Certificate Card */}
            <div className="w-full bg-gradient-to-br from-[#1a365d] to-[#12284b] rounded-[2.5rem] p-1 relative overflow-hidden shadow-[0_8px_30px_rgba(26,54,93,0.15)]">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0096a4]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

              <div className="bg-[#1a365d]/40 backdrop-blur-md rounded-[2.4rem] p-8 md:p-12 border border-white/10 relative z-10 flex flex-col md:flex-row items-center gap-10">
                
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#0096a4] to-teal-500 flex items-center justify-center shrink-0 shadow-inner border border-white/20">
                  <Award className="w-12 h-12 text-white stroke-[1.5]" />
                </div>

                <div className="flex-1 text-center md:text-left min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-medium uppercase tracking-widest mb-4">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" /> Active Lifetime Member
                  </div>
                  <h2 className="text-3xl md:text-4xl font-medium text-white tracking-tight truncate mb-3">
                    {user.fullName || 'Member'}
                  </h2>
                  <p className="text-sm font-normal text-slate-300">
                    Your credentials are fully verified and your lifetime membership is active. You have full access to all EAAP benefits and privileges.
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <button 
                    onClick={handleViewCertificate}
                    disabled={isCertLoading}
                    className="w-full md:w-auto px-8 py-4 bg-white text-[#1a365d] hover:bg-slate-50 rounded-2xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isCertLoading ? (
                      <><Loader2 className="w-5 h-5 stroke-[1.5] animate-spin" /> Preparing...</>
                    ) : (
                      <><Download className="w-5 h-5 stroke-[1.5]" /> View Official Certificate</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Benefits Reminder */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-10 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
              <h3 className="text-lg font-medium text-[#1a365d] mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0096a4] stroke-[1.5]" /> Your Privileges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BENEFITS.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                    <CheckCircle2 className="w-5 h-5 text-[#0096a4] stroke-[1.5] shrink-0 mt-0.5" />
                    <span className="text-sm font-normal text-slate-600 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
        ) : isMembershipPending ? (
          
          /* ========================================= */
          /* PENDING APPROVAL STATE                    */
          /* ========================================= */
          <motion.div 
            key="pending"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-[2.5rem] border border-amber-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0096a4]/5 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <FileSearch className="w-10 h-10 text-amber-500 stroke-[1.5]" />
                </div>
                
                <h2 className="text-3xl font-medium text-slate-800 tracking-tight mb-4">
                  Application Under Review
                </h2>
                
                <p className="text-base font-normal text-slate-500 leading-relaxed mb-10 max-w-lg mx-auto">
                  Your lifetime membership fee of <span className="font-medium text-slate-700">₹1,500</span> has been successfully processed. The executive committee is currently verifying your professional credentials.
                </p>

                <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 text-sm font-medium shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin stroke-[2]" /> Pending Admin Approval
                </div>

                <p className="text-xs font-normal text-slate-400 mt-10">
                  You will receive an email notification once your membership certificate is issued.
                </p>
              </div>
            </div>
          </motion.div>

        ) : (

          /* ========================================= */
          /* INACTIVE / UNPAID STATE                   */
          /* ========================================= */
          <motion.div 
            key="inactive"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Column: Benefits & Context */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-10 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a365d]/5 border border-[#1a365d]/10 text-[#1a365d] text-[11px] font-medium uppercase tracking-widest mb-6 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-[#0096a4] stroke-[1.5]" /> Membership Pending
                </div>
                
                <h2 className="text-3xl font-medium text-[#1a365d] tracking-tight mb-4">
                  Unlock Lifetime Access
                </h2>
                <p className="text-base font-normal text-slate-500 leading-relaxed mb-8">
                  You are one step away from joining Andhra Pradesh's premier network of clinical embryologists. Complete your admission fee payment to submit your profile for board verification.
                </p>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  {BENEFITS.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#0096a4] stroke-[1.5] shrink-0 mt-0.5" />
                      <span className="text-sm font-normal text-slate-600 leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Checkout Card */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-[#1a365d] to-[#0096a4]" />
                
                <div className="p-8 md:p-10">
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-medium text-slate-800">Admission Fee</h3>
                      <p className="text-xs font-normal text-slate-500 mt-1">One-time payment</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-medium text-[#1a365d]">₹1,500</p>
                    </div>
                  </div>

                  <button 
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className="w-full py-4 bg-[#0096a4] hover:bg-[#007a86] text-white rounded-xl text-base font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 group mb-6"
                  >
                    {isProcessingPayment ? (
                      <><Loader2 className="w-5 h-5 stroke-[1.5] animate-spin" /> Processing Securely...</>
                    ) : (
                      <><CreditCard className="w-5 h-5 stroke-[1.5] group-hover:scale-110 transition-transform" /> Pay & Submit Profile</>
                    )}
                  </button>

                  <p className="text-xs font-normal text-slate-400 text-center leading-relaxed">
                    By proceeding, you agree to the EAAP terms of membership. Payments are processed securely via Razorpay.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reusable Render Modal */}
      <AnimatePresence>
        {isRenderModalOpen && (
          <CertificatePreviewModal 
            isOpen={isRenderModalOpen}
            onClose={() => { 
              setIsRenderModalOpen(false); 
              setRenderData(null); 
            }}
            previewData={renderData}
            isLoading={false} 
            title="Official Membership Certificate"
          />
        )}
      </AnimatePresence>

    </div>
  );
}
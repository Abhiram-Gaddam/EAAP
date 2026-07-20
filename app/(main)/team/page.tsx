"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Star } from 'lucide-react';

// --- DATA EXTRACTION ---
// Place your webp images in public/images/ exactly matching the 'image' string below.
const GOVERNING_BODY = [
  { name: 'Mr. Y. Kishore Babu', role: 'President', image: '/images/team/y-kishore-babu.webp' },
  { name: 'Mr. T. Suresh Kumar', role: 'Vice President', image: '/images/team/t-suresh-kumar.webp' },
  { name: 'Dr. V. Lenin Babu', role: 'Secretary', image: '/images/team/v-lenin-babu.webp' },
  { name: 'Mr. P. Dileep Kumar', role: 'Joint Secretary', image: '/images/team/p-dileep-kumar.webp' },
  { name: 'Mr. Venkata B. Subrahmanyam', role: 'Treasurer', image: '/images/team/venkata-b-subrahmanyam.webp' },
  { name: 'Mr. P. Midhun Chakravarthy', role: 'Joint Treasurer', image: '/images/team/p-midhun-chakravarthy.webp' },
];

const EC_MEMBERS = [
  { name: 'Mr. Sagar Reddy', image: '/images/team/sagar-reddy.webp' ,position: 'object-[center_5%]'},
  { name: 'Mr. S. Rajesh', image: '/images/team/s-rajesh.webp',position: 'object-[center_5%]' },
  { name: 'Mr. M. Siva Krishna', image: '/images/team/m-siva-krishna.webp',position: 'object-[center_25%]' },
  { name: 'Mr. K. Sreekanth', image: '/images/team/k-sreekanth.webp' },
  { name: 'Mr. K. Eswar Rao', image: '/images/team/k-eswar-rao.webp' ,position: 'object-[center_15%]'},
  { name: 'Mr. P. J. Suresh', image: '/images/team/p-j-suresh.webp',position: 'object-[center_15%]' },
  { name: 'Mrs. Tuheena Reddy', image: '/images/team/tuheena-reddy.webp' },
  { name: 'Mr. I N V Satish', image: '/images/team/i-n-v-satish.webp' ,position: 'object-[center_10%]'},
];

const FOUNDING_MEMBERS = [
  { name: 'Mr. M Murthy Raju', image: '/images/team/m-murthy-raju.webp' },
  { name: 'Mr. P Vengala Rao', image: '/images/team/p-vengala-rao.webp' },
  { name: 'Mr. Bapuji', image: '/images/team/bapuji.webp' },
  { name: 'Mr. Shaik Kamal', image: '/images/team/shaik-kamal.webp' },
  { name: 'Dr. Ram Kumar K Y', image: '/images/team/ram-kumar-ky.webp' },
  { name: 'Mr. B Sravan Reddy', image: '/images/team/b-sravan-reddy.webp' },
  { name: 'Mr. A. Gurivi Reddy', image: '/images/team/a-gurivi-reddy.webp' },
  { name: 'Ms. P. Kavitha', image: '/images/team/p-kavitha.webp' },
  { name: 'Ms. Madhu Tejaswini', image: '/images/team/madhu-tejaswini.webp' },
  { name: 'Mr. P Suneet Kumar', image: '/images/team/p-suneet-kumar.webp' },
];

// Reusable component for team members
// Reusable component for team members
const MemberCard = ({ member, isCore = false }: { member: any, isCore?: boolean }) => {
    const [imgError, setImgError] = useState(false);
  
    // Generate initials for fallback
    const getInitials = (name: string) => {
      const parts = name.replace(/(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/ig, '').trim().split(' ');
      if (parts.length > 1) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].substring(0, 2).toUpperCase();
    };
  
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,150,164,0.08)] transition-all duration-500 overflow-hidden"
      >
        {/* Image Container */}
        <div className={`relative w-full ${isCore ? 'aspect-[4/5]' : 'aspect-square'} bg-slate-100 overflow-hidden`}>
          {!imgError ? (
            <img 
              src={member.image} 
              alt={member.name} 
              onError={() => setImgError(true)}
              // 👇 Added dynamic position class here
              className={`w-full h-full object-cover ${member.position || 'object-center'} group-hover:scale-105 transition-transform duration-700 ease-out`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border-b border-slate-200/50">
              <span className="text-4xl font-medium text-[#1a365d]/20 tracking-tight">
                {getInitials(member.name)}
              </span>
            </div>
          )}
          
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a365d]/80 via-[#1a365d]/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
  
        {/* Content */}
        <div className="flex flex-col items-center text-center p-6 bg-white relative z-10">
          {member.role && (
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0096a4] text-white text-[10px] font-medium uppercase tracking-widest shadow-md">
              {member.role}
            </span>
          )}
          <h3 className={`font-medium text-[#1a365d] ${isCore ? 'text-lg mt-2' : 'text-base'} tracking-tight line-clamp-1`}>
            {member.name}
          </h3>
          {isCore && (
            <div className="w-6 h-[1px] bg-[#0096a4]/30 mt-3 group-hover:w-12 transition-all duration-300" />
          )}
        </div>
      </motion.div>
    );
  };

export default function TeamPage() {
  return (
    <main className="bg-[#FAFAFA] min-h-screen pb-24 font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-16 lg:px-24 overflow-hidden border-b border-slate-200/60 bg-white">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#0096a4]/5 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1a365d]/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[#1a365d] text-[11px] font-medium uppercase tracking-widest mb-6 shadow-sm">
              <Users className="w-3.5 h-3.5 text-[#0096a4] stroke-[1.5]" /> Association Leadership
            </div>
            <h1 className="font-['Playfair_Display',_'Playfair_Display_Fallback',_serif] text-4xl md:text-5xl lg:text-6xl text-[#1a365d] leading-[1.1] mb-6">
              Meet the <span className="italic text-[#0096a4]">Visionaries.</span>
            </h1>
            <p className="text-slate-500 font-normal text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Committed to fostering collaboration and excellence in clinical embryology through education, innovation, and ethical practice across Andhra Pradesh.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Governing Body Section */}
      <section className="py-20 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 rounded-xl bg-[#1a365d]/5 flex items-center justify-center shrink-0 border border-[#1a365d]/10">
            <Award className="w-5 h-5 text-[#1a365d] stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-[#1a365d] tracking-tight">Governing Body</h2>
            <p className="text-sm font-normal text-slate-500 mt-1">The executive leadership of EAAP</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {GOVERNING_BODY.map((member, idx) => (
            <MemberCard key={idx} member={member} isCore={true} />
          ))}
        </div>
      </section>

      {/* Executive Committee Section */}
      <section className="py-20 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto relative z-10 border-t border-slate-200/60">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 rounded-xl bg-[#0096a4]/10 flex items-center justify-center shrink-0 border border-[#0096a4]/20">
            <Users className="w-5 h-5 text-[#0096a4] stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-[#1a365d] tracking-tight">Executive Committee</h2>
            <p className="text-sm font-normal text-slate-500 mt-1">Driving innovation and standards</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {EC_MEMBERS.map((member, idx) => (
            <MemberCard key={idx} member={member} />
          ))}
        </div>
      </section>

      {/* Founding Members Section */}
      <section className="py-20 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto relative z-10 border-t border-slate-200/60">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
            <Star className="w-5 h-5 text-amber-500 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-[#1a365d] tracking-tight">Founding Members</h2>
            <p className="text-sm font-normal text-slate-500 mt-1">The pioneers who laid our foundation</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {FOUNDING_MEMBERS.map((member, idx) => (
            <MemberCard key={idx} member={member} />
          ))}
        </div>
      </section>

    </main>
  );
}
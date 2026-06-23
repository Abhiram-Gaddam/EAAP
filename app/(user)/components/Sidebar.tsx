"use client";

import { useState } from 'react'; 
import Link from 'next/link';
import  Image  from 'next/image'
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, User, CalendarDays, Award, FileText, 
  CreditCard, LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { logoutUser } from '@/app/lib/utilities/apis';

const NAV_LINKS = [
  { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
  // { name: 'My Profile', href: '/user/profile', icon: User },
  { name: 'Events', href: '/user/events', icon: CalendarDays },
  { name: 'Certificates', href: '/user/certificates', icon: Award },
  { name: 'Publications', href: '/user/publications', icon: FileText },
  { name: 'Membership', href: '/user/membership', icon: CreditCard },
];

export default function UserSidebar({ closeMobileMenu }: { closeMobileMenu?: () => void }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className={`relative flex flex-col h-full bg-white border-r border-emerald-100/50 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Floating Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-5 w-6 h-6 bg-white border border-emerald-100 rounded-full items-center justify-center text-slate-400 hover:text-[#0096a4] hover:shadow-md transition-all z-40"
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Branding */}
      <div className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-6'} border-b border-slate-100 shrink-0 transition-all`}>
  <Link href="/admin" onClick={closeMobileMenu} className="flex items-center gap-2 overflow-hidden">
    {isCollapsed ? (
      <Image 
        src="/images/small-logo.png" 
        alt="EAAP Icon" 
        width={32} 
        height={32} 
        className="object-contain shrink-0" 
      />
    ) : (
      <>
        <Image 
          src="/images/Logo-NoBg.png" 
          alt="EAAP Logo" 
          width={120} 
          height={40} 
          className="h-14 w-auto object-contain shrink-0" 
          priority
        />
         
      </>
    )}
  </Link>
</div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 hide-scrollbar">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMobileMenu}
              className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-700' 
                  : 'text-slate-500 hover:bg-emerald-50/50 hover:text-[#0096a4]'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-[#0096a4]'}`} strokeWidth={isActive ? 2 : 1.5} />
              
              {!isCollapsed && <span className="truncate">{link.name}</span>}

              {/* Hover Tooltip (Only visible when collapsed) */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-[#1a365d] text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg pointer-events-none">
                  {link.name}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#1a365d] rotate-45" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Area */}
      <div className="p-4 border-t border-emerald-50/50 shrink-0">
        <button 
          onClick={handleLogout}
          className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 w-full rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 group`}
        >
          <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-red-600" strokeWidth={1.5} />
          {!isCollapsed && <span className="truncate">Sign Out</span>}

          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg pointer-events-none">
              Sign Out
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-red-600 rotate-45" />
            </div>
          )}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
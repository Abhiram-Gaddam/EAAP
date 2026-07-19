"use client";

import { useState } from 'react';
import Link from 'next/link';
import  Image  from 'next/image'
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CalendarDays, 
  WalletCards, 
  BookOpen, 
  MessageSquare, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileBadge
} from 'lucide-react';
import { logoutUser } from '@/app/lib/utilities/apis';

const NAV_LINKS = [
  { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Applications', href: '/admin/applications', icon: FileText },
  { name: 'Directory', href: '/admin/directory', icon: Users },
  { name: 'Events', href: '/admin/events', icon: CalendarDays },
  { name: 'Certificates', href: '/admin/certificates', icon:  FileBadge   },
  { name: 'Financials', href: '/admin/financials', icon: WalletCards },
  { name: 'Publications', href: '/admin/publications', icon: BookOpen },
  { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
];

export default function AdminSidebar({ closeMobileMenu }: { closeMobileMenu?: () => void }) {
  const pathname = usePathname();
  // State to manage sidebar expansion
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
    <div className={`relative flex flex-col h-full bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Floating Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex absolute -right-3 top-5 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-[#0096a4] hover:shadow-md transition-all z-40"
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
        <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mt-1 px-2 py-0.5 bg-slate-100 rounded-full shrink-0">
          Admin
        </span>
      </>
    )}
  </Link>
</div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 hide-scrollbar">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = link.href === '/admin' 
            ? pathname === link.href 
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMobileMenu}
              className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#0096a4]/10 text-[#0096a4]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-[#1a365d]'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#0096a4]' : 'text-slate-400 group-hover:text-[#1a365d]'}`} strokeWidth={isActive ? 2 : 1.5} />
              
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

        <div className="pt-6 pb-2">
          <div className="h-px bg-slate-100 w-full" />
        </div>
{/* 
        <Link
          href="/admin/settings"
          onClick={closeMobileMenu}
          className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
            pathname.startsWith('/admin/settings') 
              ? 'bg-[#0096a4]/10 text-[#0096a4]' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-[#1a365d]'
          }`}
        >
          <Settings className={`w-5 h-5 shrink-0 ${pathname.startsWith('/admin/settings') ? 'text-[#0096a4]' : 'text-slate-400 group-hover:text-[#1a365d]'}`} strokeWidth={1.5} />
          {!isCollapsed && <span className="truncate">Settings</span>}

          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-[#1a365d] text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-lg pointer-events-none">
              Settings
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#1a365d] rotate-45" />
            </div>
          )}
        </Link> */}
      </nav>

      {/* User / Logout Area */}
      <div className="p-4 border-t border-slate-100 shrink-0">
        <button 
          onClick={handleLogout}
          className={`relative flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-3'} py-2.5 w-full rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 group`}
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
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
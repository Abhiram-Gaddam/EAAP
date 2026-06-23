// components/admin/Topbar.tsx
"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Bell, LogOut, Settings, User } from 'lucide-react';
import AdminSidebar from './Sidebar';
import { getCurrentUser, logoutUser } from '@/app/lib/utilities/apis';

export default function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; fullName?: string; role?: string; email?: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (error) {
        router.push('/login');
      }
    }
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Failed to log out", error);
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
            <Link href={href} className="text-sm font-light text-slate-500 hover:text-[#0096a4] transition-colors">
              {title}
            </Link>
          )}
        </div>
      );
    });
  };

  const displayName = user?.fullName || user?.name || 'Loading...';
  const displayRole = user?.role || '';
  const initials = displayName !== 'Loading...' 
    ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
    : '...';

  return (
    <>
      <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-10 shrink-0">
        
        {/* Left Side: Mobile Menu Toggle & Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-[#1a365d] rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:flex items-center">
            <Link href="/admin" className="text-sm font-light text-slate-500 hover:text-[#0096a4] transition-colors">
              Admin
            </Link>
            {pathname !== '/admin' && generateBreadcrumbs()}
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-[#1a365d] transition-colors rounded-full hover:bg-slate-50">
            <Bell className="w-5 h-5" strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
          </button>
          
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          
          {/* Profile Dropdown Container */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 cursor-pointer group rounded-full focus:outline-none"
            >
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-[#1a365d] leading-none mb-0.5">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-none">
                  {displayRole}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#1a365d] flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm group-hover:shadow-md group-hover:bg-[#0096a4] transition-all">
                {initials}
              </div>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  {/* Invisible overlay to close dropdown when clicking outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileOpen(false)} 
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100 z-50 overflow-hidden origin-top-right"
                  >
                    {/* User Info Header */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-semibold text-[#1a365d] truncate">{displayName}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email || 'admin@eaap.in'}</p>
                    </div>

                    {/* Menu Links */}
                    <div className="p-2 space-y-1">
                      <Link 
                        href="/admin/directory/me" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-[#0096a4] hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link 
                        href="/admin/settings" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 hover:text-[#0096a4] hover:bg-slate-50 rounded-xl transition-colors"
                      >
                        <Settings className="w-4 h-4" /> Account Settings
                      </Link>
                      
                      <div className="h-px bg-slate-100 w-full my-1" />
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#1a365d]/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 lg:hidden shadow-2xl"
            >
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#1a365d] bg-slate-50 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              <AdminSidebar closeMobileMenu={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
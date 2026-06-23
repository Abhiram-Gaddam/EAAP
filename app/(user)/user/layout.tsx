import UserSidebar from "../components/Sidebar";
import UserTopbar from "../components/Topbar";

 
export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Desktop Sidebar - Hidden on mobile, controlled by its own internal state */}
      <div className="hidden lg:block z-40">
        <UserSidebar />
      </div>

      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar - Includes mobile menu logic internally */}
        <UserTopbar />

        <div className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
        
      </main>

      {/* Global Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}
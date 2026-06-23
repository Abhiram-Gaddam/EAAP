import AdminSidebar from "../components/Sidebar";
import AdminTopbar from "../components/Topbar";
 
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#FAFAFA] font-sans overflow-hidden">
      
      {/* Desktop Sidebar (Hidden on mobile) */}
      {/* We removed 'w-64' and 'border-r' here so the Sidebar component handles it */}
      <div className="hidden lg:block z-30 h-full relative">
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <AdminTopbar />
        
        <main className="flex-1 bg-[#FAFAFA] overflow-y-auto   relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0096a4]/5   blur-[100px] pointer-events-none -z-10" />
          
          <div className="  w-full h-full relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
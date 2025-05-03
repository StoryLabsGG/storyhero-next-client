import { AppSidebar } from '@/components/shared/Sidebar';
import { Topbar } from '@/components/shared/Topbar';
import Particles from '@/components/ui/particles';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Particles
        className="fixed inset-0 h-full w-full"
        quantity={100}
        staticity={30}
        ease={20}
        color="#EA580C"
      />
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <Topbar />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}

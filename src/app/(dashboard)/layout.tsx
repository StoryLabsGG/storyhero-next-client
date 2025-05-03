import { AppSidebar } from '@/components/shared/Sidebar';
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
      <AppSidebar />
      <main>{children}</main>
    </SidebarProvider>
  );
}

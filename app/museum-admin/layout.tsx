import { MuseumAdminSidebar } from '@/components/museum-admin/MuseumAdminSidebar';
import { MuseumAdminMobileSidebar } from '@/components/museum-admin/MuseumAdminMobileSidebar';

export default function MuseumAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <MuseumAdminSidebar />
      <MuseumAdminMobileSidebar />
      
      {/* Main content - adjust margin based on sidebar width */}
      <main className="min-w-0 flex-1 ml-0 md:ml-64 bg-muted/10">
        <div className="container mx-auto w-full max-w-7xl p-4 pb-24 sm:p-6 md:pb-6">
          {children}
        </div>
      </main>
    </div>
  );
}
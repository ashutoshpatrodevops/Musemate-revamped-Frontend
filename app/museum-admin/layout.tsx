import { MuseumAdminSidebar } from '@/components/museum-admin/MuseumAdminSidebar';

export default function MuseumAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <MuseumAdminSidebar />
      
      {/* Main content - adjust margin based on sidebar width */}
      <main className="flex-1 ml-64 bg-muted/10">
        <div className="container mx-auto p-6 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
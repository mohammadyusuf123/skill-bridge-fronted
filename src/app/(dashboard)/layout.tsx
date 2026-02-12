import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 ">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-muted/10">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

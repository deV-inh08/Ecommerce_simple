import AdminSidebar from './components/AdminSidebar';
import AdminTopBar from './components/AdminTopBar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full bg-white">
      <body className="h-full overflow-hidden">
        <div className="flex h-screen">
          {/* Sidebar */}
          <AdminSidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <AdminTopBar />
            <main className="flex-1 overflow-auto" style={{ backgroundColor: 'var(--beige-light)' }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

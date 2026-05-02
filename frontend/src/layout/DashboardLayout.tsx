import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import TopBar from "../components/TopBar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          marginLeft: sidebarOpen ? '260px' : '0',
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Top bar */}
        <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />

        {/* Page content */}
        <main style={{ flex: 1, padding: '1.75rem', maxWidth: '1400px', width: '100%', margin: '0 auto', paddingTop: '1.5rem' }}>
          <div className="animate-fade-up">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '1rem',
          color: '#334155',
          fontSize: '0.72rem',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}>
          EduFlow © {new Date().getFullYear()} — College Request Management System
        </footer>
      </div>
    </div>
  );
}

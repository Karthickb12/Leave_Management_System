import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from './layout/DashboardLayout'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import NewRequestPage from './pages/NewRequestPage'
import ApprovalsPage from './pages/ApprovalsPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--color-brand-start), var(--color-brand-end))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', animation: 'pulse-ring 2s ease-out infinite' }}>🎓</div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;

  return <DashboardLayout>{children}</DashboardLayout>;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/*" element={
        <ProtectedRoute>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/request/new" element={<NewRequestPage />} />
            <Route path="/history" element={<div style={{ padding: '1rem' }}><h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '1rem' }}>Request History</h1><div className="glass-card animate-fade-up" style={{ borderRadius: '1.25rem', padding: '3rem', textAlign: 'center', color: 'var(--color-muted)' }}><p style={{ fontSize: '1rem', margin: 0 }}>📋 History view coming soon</p></div></div>} />
            <Route path="/approvals" element={<ApprovalsPage />} />
          </Routes>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

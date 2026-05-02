import { useState, useEffect } from 'react';
import { Bell, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const roleColors: Record<string, string> = {
  STUDENT: '#818cf8',
  ADVISOR: '#34d399',
  HOD: '#f59e0b',
  PRINCIPAL: '#f472b6',
  ADMIN: '#f87171',
};

const roleLabels: Record<string, string> = {
  STUDENT: 'Student',
  ADVISOR: 'Class Advisor',
  HOD: 'Head of Dept.',
  PRINCIPAL: 'Principal',
  ADMIN: 'Administrator',
};

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
  const { user, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const roleColor = role ? roleColors[role] : '#818cf8';
  const roleLabel = role ? roleLabels[role] : '';

  return (
    <header
      style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-topbar-bg)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Left: Hamburger + Greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          id="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: '0.625rem',
            padding: '0.45rem',
            cursor: 'pointer',
            color: 'var(--color-muted)',
            display: 'flex',
            alignItems: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-hover-overlay)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="animate-fade-in" style={{ animationDelay: '50ms' }}>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.1 }}>
            {greeting()}, <span style={{ color: roleColor }}>{displayName.split(' ')[0]}</span>
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--color-subtle)', marginTop: '0.1rem' }}>
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right: Role badge + notifications + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {role && (
          <>
            <style>{`
              @media (min-width: 640px) {
                .role-badge { display: inline-flex !important; }
              }
            `}</style>
            <span
              className="role-badge animate-fade-in"
              style={{
                padding: '0.3rem 0.85rem',
                borderRadius: '99px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: roleColor,
                background: `${roleColor}18`,
                border: `1px solid ${roleColor}30`,
                display: 'none',
                alignItems: 'center',
              }}
            >
              {roleLabel}
            </span>
          </>
        )}

        <button
          onClick={toggleTheme}
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: '0.625rem',
            padding: '0.45rem',
            cursor: 'pointer',
            color: 'var(--color-muted)',
            display: 'flex',
            alignItems: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-hover-overlay)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          id="notifications-btn"
          style={{
            position: 'relative',
            background: 'transparent',
            border: '1px solid var(--color-border)',
            borderRadius: '0.625rem',
            padding: '0.45rem',
            cursor: 'pointer',
            color: 'var(--color-muted)',
            display: 'flex',
            alignItems: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-hover-overlay)'}
          onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'transparent'}
          aria-label="Notifications"
        >
          <Bell size={17} />
          <span style={{
            position: 'absolute',
            top: '4px', right: '4px',
            width: '7px', height: '7px',
            borderRadius: '50%',
            background: 'var(--color-brand-start)',
            border: '1.5px solid var(--color-bg)',
          }} />
        </button>

        {/* Avatar */}
        <div
          style={{
            width: '36px', height: '36px',
            borderRadius: '0.875rem',
            background: `linear-gradient(135deg, ${roleColor}40, ${roleColor}20)`,
            border: `1.5px solid ${roleColor}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: roleColor,
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            cursor: 'default',
            userSelect: 'none',
          }}
          title={displayName}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}

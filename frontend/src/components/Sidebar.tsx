import { Home, PlusCircle, FileText, CheckSquare, LogOut, Settings, BarChart2, GraduationCap, ChevronLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const roleColors: Record<string, string> = {
  STUDENT: '#818cf8',
  ADVISOR: '#34d399',
  HOD: '#f59e0b',
  PRINCIPAL: '#f472b6',
  ADMIN: '#f87171',
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { role, logout, user } = useAuth();
  const location = useLocation();

  const getNavItems = (role: UserRole) => {
    const common = [
      { label: "Dashboard", href: "/dashboard", icon: Home },
    ];

    switch (role) {
      case 'STUDENT':
        return [
          ...common,
          { label: "New Request", href: "/request/new", icon: PlusCircle },
          { label: "History", href: "/history", icon: FileText },
        ];
      case 'ADVISOR':
      case 'HOD':
      case 'PRINCIPAL':
        return [
          ...common,
          { label: "Approvals", href: "/approvals", icon: CheckSquare },
          { label: "History", href: "/history", icon: FileText },
          { label: "Reports", href: "/reports", icon: BarChart2 },
        ];
      case 'ADMIN':
        return [
          ...common,
          { label: "Users", href: "/users", icon: Settings },
          { label: "Settings", href: "/settings", icon: Settings },
        ];
      default:
        return common;
    }
  };

  if (!role) return null;
  const navItems = getNavItems(role);
  const roleColor = roleColors[role] ?? '#818cf8';
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 39,
            background: 'rgba(2,6,23,0.7)',
            backdropFilter: 'blur(4px)',
          }}
          className="md:hidden"
        />
      )}

      {/* Sidebar panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0, left: 0,
          height: '100vh',
          width: open ? '260px' : '0px',
          zIndex: 40,
          overflow: 'hidden',
          background: 'var(--color-bg)',
          borderRight: '1px solid var(--color-border)',
          backdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ width: '260px', display: 'flex', flexDirection: 'column', height: '100%', padding: '0' }}>
          {/* Logo */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 1.25rem 0.75rem',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px', height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
                flexShrink: 0,
              }}>
                <GraduationCap size={20} color="#fff" />
              </div>
              <div>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>EduFlow</span>
                <p style={{ fontSize: '0.65rem', color: 'var(--color-subtle)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '1px' }}>Request System</p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-subtle)', padding: '0.25rem',
                borderRadius: '0.5rem', display: 'flex',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-subtle)'}
              aria-label="Close sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          {/* Role badge */}
          <div style={{ padding: '0.75rem 1.25rem 0' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.3rem 0.75rem',
              borderRadius: '99px',
              background: `${roleColor}15`,
              border: `1px solid ${roleColor}25`,
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: roleColor, flexShrink: 0 }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: roleColor, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{role}</span>
            </div>
          </div>

          {/* Nav label */}
          <div style={{ padding: '0.75rem 1.25rem 0.4rem' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Navigation
            </span>
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, padding: '0 0.75rem', overflowY: 'auto' }}>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={onClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.65rem 0.875rem',
                        borderRadius: '0.875rem',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? 'var(--color-text)' : 'var(--color-muted)',
                        background: isActive
                          ? 'var(--color-hover-overlay)'
                          : 'transparent',
                        border: isActive
                          ? '1px solid var(--color-border)'
                          : '1px solid transparent',
                        transition: 'all 0.15s',
                        position: 'relative',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = 'var(--color-hover-overlay)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--color-text)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                          (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)';
                        }
                      }}
                    >
                      {isActive && (
                        <span style={{
                          position: 'absolute',
                          left: 0, top: '50%', transform: 'translateY(-50%)',
                          width: '3px', height: '55%',
                          borderRadius: '0 2px 2px 0',
                          background: 'linear-gradient(180deg, #6366f1, #7c3aed)',
                        }} />
                      )}
                      <item.icon
                        size={18}
                        color={isActive ? '#818cf8' : 'currentColor'}
                        strokeWidth={isActive ? 2.2 : 1.8}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom: User profile + Logout */}
          <div style={{
            padding: '0.75rem',
            borderTop: '1px solid var(--color-border)',
            margin: '0.5rem',
            borderRadius: '1rem',
            background: 'var(--color-card-bg-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
              <div style={{
                width: '36px', height: '36px',
                borderRadius: '0.75rem',
                background: `${roleColor}20`,
                border: `1.5px solid ${roleColor}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: roleColor,
                fontSize: '0.78rem',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayName}
                </p>
                <p style={{ fontSize: '0.68rem', color: 'var(--color-subtle)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              id="logout-btn"
              onClick={logout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '0.55rem 0.75rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-muted)',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-danger)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-muted)';
              }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

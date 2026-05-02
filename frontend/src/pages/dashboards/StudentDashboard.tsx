import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Plus, Clock, CheckCircle, XCircle, LayoutDashboard, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/requests/');
        const data = res.data;
        setRecentRequests(data);
        setStats({
          total: data.length,
          pending: data.filter((r: any) => r.status === 'PENDING').length,
          approved: data.filter((r: any) => r.status === 'APPROVED').length,
          rejected: data.filter((r: any) => r.status === 'REJECTED').length,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;
  const displayName = user?.displayName || 'Student';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* ── Page header ── */}
      <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <LayoutDashboard size={16} color="var(--color-brand-start)" />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-brand-start)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Student Portal
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 0.3rem', letterSpacing: '-0.025em' }}>
            Hello, {displayName.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>
            Track your OD, Leave, and Permission requests in real-time.
          </p>
        </div>

        <Link
          to="/request/new"
          id="new-request-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.4rem',
            borderRadius: '0.875rem',
            background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.875rem',
            boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
            transition: 'transform 0.15s, box-shadow 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(99,102,241,0.45)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = '';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 15px rgba(99,102,241,0.35)';
          }}
        >
          <Plus size={18} strokeWidth={2.5} />
          New Request
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard label="Total Requests" value={stats.total} icon={LayoutDashboard} color="blue" delay={0} />
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="yellow" delay={80} />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle} color="green" delay={160} />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="red" delay={240} />
      </div>

      {/* ── Approval rate bar + Recent requests ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem', flexWrap: 'wrap' }}
           className="grid-cols-1 md:grid-cols-[1fr_2fr]"
      >
        {/* Approval rate card */}
        <div
          className="animate-fade-up glass-card delay-300"
          style={{ borderRadius: '1.25rem', padding: '1.5rem' }}
        >
          <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 1.25rem' }}>
            Approval Rate
          </h3>

          {/* Circular progress ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-border)" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="url(#ring-grad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - approvalRate / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
                <defs>
                  <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1 }}>{approvalRate}%</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-muted)', marginTop: '2px' }}>approved</span>
              </div>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'Approved', value: stats.approved, color: 'var(--color-success)' },
                { label: 'Pending', value: stats.pending, color: 'var(--color-warning)' },
                { label: 'Rejected', value: stats.rejected, color: 'var(--color-danger)' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)' }}>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent requests */}
        <div
          className="animate-fade-up glass-card delay-400"
          style={{ borderRadius: '1.25rem', overflow: 'hidden' }}
        >
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarCheck size={16} color="var(--color-brand-start)" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>Recent Requests</h3>
            </div>
            <span style={{
              fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-brand-start)',
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
              padding: '0.2rem 0.6rem', borderRadius: '99px',
            }}>
              {recentRequests.length} total
            </span>
          </div>

          <div style={{ padding: '0.75rem 1rem', maxHeight: '340px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} className="skeleton" style={{ height: '58px', borderRadius: '0.75rem' }} />
                ))}
              </div>
            ) : recentRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-subtle)' }}>
                <CalendarCheck size={36} style={{ opacity: 0.25, margin: '0 auto 0.75rem' }} />
                <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>No requests yet</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-subtle)', margin: '0.25rem 0 0' }}>Submit your first OD or Leave request</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {recentRequests.map((req, i) => (
                  <div
                    key={req.id}
                    className="animate-fade-up"
                    style={{
                      animationDelay: `${i * 60}ms`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.875rem 1rem',
                      borderRadius: '0.875rem',
                      background: 'var(--color-card-bg-subtle)',
                      border: '1px solid var(--color-border)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-hover-overlay)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-card-bg-subtle)'}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <StatusBadge status={req.type} size="sm" />
                        {req.days && <span style={{ fontSize: '0.72rem', color: 'var(--color-subtle)' }}>{req.days} days</span>}
                      </div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--color-subtle)', margin: 0 }}>
                        {req.created_at ? new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                      </p>
                    </div>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

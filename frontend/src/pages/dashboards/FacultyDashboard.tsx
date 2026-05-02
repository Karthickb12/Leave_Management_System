import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, Users, Filter, LayoutDashboard } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import RequestCard from '../../components/RequestCard';

const TYPE_FILTERS = ['ALL', 'OD', 'LEAVE', 'MEDICAL', 'EMERGENCY'];

export default function FacultyDashboard() {
  const { role } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [approvedToday, setApprovedToday] = useState(0);
  const [rejectedToday, setRejectedToday] = useState(0);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/requests/', { params: { status: 'PENDING', stage: role } });
      setRequests(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // Reset today counters on role change
    setApprovedToday(0);
    setRejectedToday(0);
  }, [role]);

  const handleAction = async (requestId: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      await api.post('/requests/approve', { request_id: requestId, approver_role: role, decision });
      if (decision === 'APPROVED') setApprovedToday(v => v + 1);
      else setRejectedToday(v => v + 1);
      toast.success(`Request ${decision === 'APPROVED' ? 'approved ✓' : 'rejected ✕'}`);
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error('Action failed');
    }
  };

  const filtered = typeFilter === 'ALL' ? requests : requests.filter(r => r.type === typeFilter);

  const roleColors: Record<string, string> = {
    ADVISOR: '#34d399', HOD: '#f59e0b', PRINCIPAL: '#f472b6',
  };
  const roleColor = role ? (roleColors[role] ?? '#818cf8') : '#818cf8';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '12px', fontSize: '0.875rem' },
        }}
      />

      {/* ── Header ── */}
      <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <LayoutDashboard size={16} color={roleColor} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: roleColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Faculty Portal
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 0.3rem', letterSpacing: '-0.025em' }}>
            {role} Dashboard
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>
            Review and manage pending student requests.
          </p>
        </div>

        {/* Stats pills */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: '0.875rem',
            background: 'var(--color-card-bg-subtle)', border: '1px solid var(--color-border)',
          }}>
            <Users size={14} color="var(--color-subtle)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--color-subtle)' }}>Pending:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text)' }}>{requests.length}</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: '0.875rem',
            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)',
          }}>
            <CheckCircle size={14} color="var(--color-success)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--color-success)' }}>Approved today:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-success)' }}>{approvedToday}</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: '0.875rem',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
          }}>
            <Clock size={14} color="var(--color-danger)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--color-danger)' }}>Rejected today:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-danger)' }}>{rejectedToday}</span>
          </div>
        </div>
      </div>

      {/* ── Type filters ── */}
      <div className="animate-fade-up delay-100" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Filter size={15} color="var(--color-subtle)" />
        {TYPE_FILTERS.map(t => (
          <button
            key={t}
            id={`filter-${t.toLowerCase()}-btn`}
            onClick={() => setTypeFilter(t)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '99px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              transition: 'all 0.15s',
              ...(typeFilter === t ? {
                background: 'linear-gradient(135deg, var(--color-brand-start), var(--color-brand-end))',
                color: '#fff',
                boxShadow: '0 2px 10px rgba(99,102,241,0.3)',
              } : {
                background: 'var(--color-card-bg-subtle)',
                color: 'var(--color-muted)',
                border: '1px solid var(--color-border)',
              }),
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Request list ── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '110px', borderRadius: '1.25rem' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="animate-scale-in glass-card" style={{
          borderRadius: '1.5rem',
          padding: '3.5rem 2rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '1.25rem',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <CheckCircle size={28} color="var(--color-success)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.4rem' }}>All caught up!</h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', margin: 0 }}>
            No pending requests{typeFilter !== 'ALL' ? ` of type "${typeFilter}"` : ''} require your approval.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {filtered.map((req, i) => (
            <RequestCard
              key={req.id}
              request={req}
              showActions
              onApprove={id => handleAction(id, 'APPROVED')}
              onReject={id => handleAction(id, 'REJECTED')}
              delay={i * 60}
            />
          ))}
        </div>
      )}
    </div>
  );
}

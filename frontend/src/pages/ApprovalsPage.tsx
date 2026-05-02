import { useEffect, useState } from 'react';
import api from '../lib/api';
import toast, { Toaster } from 'react-hot-toast';
import { CheckSquare } from 'lucide-react';
import RequestCard from '../components/RequestCard';

const ROLES = ['ADVISOR', 'HOD', 'PRINCIPAL'];

const roleColors: Record<string, string> = {
  ADVISOR: '#34d399', HOD: '#f59e0b', PRINCIPAL: '#f472b6',
};

export default function ApprovalsPage() {
  const [role, setRole] = useState('ADVISOR');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchRequests(); }, [role]);

  const handleAction = async (requestId: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      await api.post('/requests/approve', { request_id: requestId, approver_role: role, decision });
      toast.success(`Request ${decision.toLowerCase()}`);
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error('Action failed');
    }
  };

  const rc = roleColors[role] ?? '#818cf8';

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
            <CheckSquare size={16} color={rc} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: rc, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Pending Approvals
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 0.3rem', letterSpacing: '-0.025em' }}>
            Approvals Queue
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>
            Review and action pending student requests.
          </p>
        </div>

        {/* Role switcher */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.875rem',
          borderRadius: '0.875rem',
          background: 'var(--color-card-bg-subtle)',
          border: '1px solid var(--color-border)',
        }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-subtle)', fontWeight: 500 }}>View as:</span>
          <select
            id="role-switcher-select"
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: rc,
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              padding: '0',
            }}
          >
            {ROLES.map(r => <option key={r} value={r} style={{ background: 'var(--color-surface)' }}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '110px', borderRadius: '1.25rem' }} />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="animate-scale-in glass-card" style={{
          borderRadius: '1.5rem',
          padding: '3.5rem 2rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '1.25rem',
            background: `${rc}12`, border: `1px solid ${rc}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <CheckSquare size={28} color={rc} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 0.4rem' }}>
            All clear!
          </h3>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', margin: 0 }}>
            No pending requests for <strong style={{ color: rc }}>{role}</strong> to review.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {requests.map((req, i) => (
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

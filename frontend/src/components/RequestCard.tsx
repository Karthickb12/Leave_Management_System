import { Clock, User } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface Request {
  id: string;
  studentId?: string;
  type: string;
  days: number;
  reason: string;
  status?: string;
  currentStage?: string;
  created_at?: string;
}

interface RequestCardProps {
  request: Request;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  delay?: number;
}

export default function RequestCard({ request, showActions = false, onApprove, onReject, delay = 0 }: RequestCardProps) {
  const isEmergency = request.type === 'EMERGENCY';

  return (
    <div
      className="animate-fade-up glass-card"
      style={{
        animationDelay: `${delay}ms`,
        borderRadius: '1.25rem',
        padding: '1.5rem',
        border: isEmergency ? '1px solid var(--color-danger)' : undefined,
        transition: 'transform 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = ''}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Left content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <StatusBadge status={request.type} />
            {request.status && <StatusBadge status={request.status} />}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              color: 'var(--color-muted)', fontSize: '0.78rem',
            }}>
              <Clock size={12} />
              {request.days} {request.days === 1 ? 'day' : 'days'}
            </span>
          </div>

          {request.studentId && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: 'var(--color-muted)', fontSize: '0.82rem' }}>
              <User size={13} />
              <span>{request.studentId}</span>
            </div>
          )}

          <p style={{ color: 'var(--color-text)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>
            {request.reason}
          </p>

          {request.created_at && (
            <p style={{ color: 'var(--color-subtle)', fontSize: '0.75rem' }}>
              Submitted {new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>

        {/* Action buttons */}
        {showActions && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={() => onApprove?.(request.id)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.875rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#fff',
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; }}
            >
              ✓ Approve
            </button>
            <button
              onClick={() => onReject?.(request.id)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.875rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-danger)',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.18)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; }}
            >
              ✕ Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

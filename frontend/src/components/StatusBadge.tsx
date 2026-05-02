interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  PENDING:  { label: 'Pending',  className: 'badge-pending',  dot: 'var(--color-warning)' },
  APPROVED: { label: 'Approved', className: 'badge-approved', dot: 'var(--color-success)' },
  REJECTED: { label: 'Rejected', className: 'badge-rejected', dot: 'var(--color-danger)' },
  OD:       { label: 'OD',       className: 'badge-info',     dot: 'var(--color-info)' },
  LEAVE:    { label: 'Leave',    className: 'badge-info',     dot: 'var(--color-info)' },
  MEDICAL:  { label: 'Medical',  className: 'badge-info',     dot: 'var(--color-brand-start)' },
  EMERGENCY:{ label: 'Emergency',className: 'badge-rejected', dot: 'var(--color-danger)' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status?.toUpperCase()] ?? { label: status, className: 'badge-info', dot: 'var(--color-muted)' };
  const isEmergency = status?.toUpperCase() === 'EMERGENCY';

  return (
    <span
      className={config.className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: size === 'sm' ? '0.2rem 0.55rem' : '0.3rem 0.7rem',
        borderRadius: '99px',
        fontSize: size === 'sm' ? '0.7rem' : '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: config.dot,
          flexShrink: 0,
          animation: isEmergency ? 'pulse-ring 1.5s ease-out infinite' : undefined,
        }}
      />
      {config.label}
    </span>
  );
}

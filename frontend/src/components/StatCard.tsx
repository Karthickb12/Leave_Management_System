import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'sky';
  delay?: number;
  suffix?: string;
}

const colorMap = {
  blue:   { icon: 'rgba(99,102,241,0.18)',   text: '#a5b4fc', glow: 'rgba(99,102,241,0.25)',   border: 'rgba(99,102,241,0.25)' },
  yellow: { icon: 'rgba(245,158,11,0.18)',   text: '#fbbf24', glow: 'rgba(245,158,11,0.2)',    border: 'rgba(245,158,11,0.25)' },
  green:  { icon: 'rgba(34,197,94,0.15)',    text: '#4ade80', glow: 'rgba(34,197,94,0.2)',     border: 'rgba(34,197,94,0.25)' },
  red:    { icon: 'rgba(239,68,68,0.15)',    text: '#f87171', glow: 'rgba(239,68,68,0.2)',     border: 'rgba(239,68,68,0.25)' },
  purple: { icon: 'rgba(168,85,247,0.18)',   text: '#c4b5fd', glow: 'rgba(168,85,247,0.2)',    border: 'rgba(168,85,247,0.25)' },
  sky:    { icon: 'rgba(14,165,233,0.18)',   text: '#38bdf8', glow: 'rgba(14,165,233,0.2)',    border: 'rgba(14,165,233,0.25)' },
};

export default function StatCard({ label, value, icon: Icon, color, delay = 0, suffix = '' }: StatCardProps) {
  const c = colorMap[color];

  return (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${delay}ms`, position: 'relative', borderRadius: '1.25rem', overflow: 'hidden' }}
    >
      <div
        style={{
          background: 'var(--color-glass-card)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${c.border}`,
          borderRadius: '1.25rem',
          padding: '1.5rem',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'default',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 32px ${c.glow}`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = '';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '';
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {label}
            </p>
            <p style={{ color: 'var(--color-text)', fontSize: '2.25rem', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {value.toLocaleString()}{suffix}
            </p>
          </div>
          <div
            style={{
              background: c.icon,
              borderRadius: '0.875rem',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${c.border}`,
            }}
          >
            <Icon size={22} color={c.text} strokeWidth={2} />
          </div>
        </div>

        {/* Subtle bottom glow line */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${c.text}, transparent)`,
          opacity: 0.4,
        }} />
      </div>
    </div>
  );
}

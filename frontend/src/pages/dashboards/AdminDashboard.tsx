import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { Search, Shield, RefreshCw, Download } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

export default function AdminDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/requests/logs/all');
      setLogs(res.data);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const filteredLogs = logs
    .filter(log =>
      (log.student_name ?? '').toLowerCase().includes(filter.toLowerCase()) ||
      (log.stage ?? '').toLowerCase().includes(filter.toLowerCase()) ||
      (log.decision ?? '').toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      const ta = new Date(a.timestamp).getTime();
      const tb = new Date(b.timestamp).getTime();
      return sortAsc ? ta - tb : tb - ta;
    });

  const approvedCount = logs.filter(l => l.decision === 'APPROVED').length;
  const rejectedCount = logs.filter(l => l.decision === 'REJECTED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* ── Header ── */}
      <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.4rem' }}>
            <Shield size={16} color="var(--color-danger)" />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Admin Portal
            </span>
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-text)', margin: '0 0 0.3rem', letterSpacing: '-0.025em' }}>
            System Audit Logs
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', margin: 0 }}>
            Track every approval action taken across the system.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <button
            id="refresh-logs-btn"
            onClick={fetchLogs}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.6rem 1rem',
              background: 'var(--color-card-bg-subtle)', border: '1px solid var(--color-border)',
              borderRadius: '0.75rem', color: 'var(--color-subtle)', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 500, transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-hover-overlay)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-card-bg-subtle)'}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            id="export-csv-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.6rem 1rem',
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '0.75rem', color: '#818cf8', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 600, transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.2)'}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.12)'}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Summary stats ── */}
      <div className="animate-fade-up delay-100" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.875rem' }}>
        {[
          { label: 'Total Actions', value: logs.length, color: '#818cf8' },
          { label: 'Approved', value: approvedCount, color: '#4ade80' },
          { label: 'Rejected', value: rejectedCount, color: '#f87171' },
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              padding: '1.125rem 1.25rem',
              borderRadius: '1rem',
              background: 'var(--color-card-bg-subtle)',
              border: `1px solid ${stat.color}20`,
            }}
          >
            <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)', margin: '0 0 0.3rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{stat.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, margin: 0, lineHeight: 1 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Table ── */}
      <div className="animate-fade-up glass-card delay-200" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '360px' }}>
            <Search size={15} color="var(--color-subtle)" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              id="log-search-input"
              type="text"
              placeholder="Search by student, stage, decision..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="input-base"
              style={{ paddingLeft: '2.5rem', height: '38px' }}
            />
          </div>
          <button
            id="sort-toggle-btn"
            onClick={() => setSortAsc(v => !v)}
            style={{
              padding: '0.45rem 0.875rem', borderRadius: '0.625rem',
              background: 'var(--color-card-bg-subtle)', border: '1px solid var(--color-border)',
              color: 'var(--color-muted)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500,
              transition: 'background 0.15s',
            }}
          >
            {sortAsc ? '↑ Oldest first' : '↓ Newest first'}
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: '46px', borderRadius: '0.5rem' }} />)}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-card-bg-subtle)', borderBottom: '1px solid var(--color-border)' }}>
                  {['Timestamp', 'Student', 'Type', 'Action By', 'Decision', 'Remarks'].map(h => (
                    <th key={h} style={{ padding: '0.875rem 1.25rem', textAlign: 'left', color: 'var(--color-muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? filteredLogs.map((log, i) => (
                    <tr
                    key={i}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--color-hover-overlay)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.875rem 1.25rem', color: 'var(--color-subtle)', fontFamily: 'monospace', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
                      {log.student_name}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <StatusBadge status={log.request_type} size="sm" />
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', color: 'var(--color-brand-start)', fontWeight: 500 }}>
                      {log.approver}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <StatusBadge status={log.decision} size="sm" />
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', color: 'var(--color-subtle)', fontStyle: 'italic', maxWidth: '220px' }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.comments || '—'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-subtle)' }}>
                      No logs found matching "{filter}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer count */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--color-border)', color: 'var(--color-subtle)', fontSize: '0.75rem' }}>
          Showing {filteredLogs.length} of {logs.length} entries
        </div>
      </div>
    </div>
  );
}

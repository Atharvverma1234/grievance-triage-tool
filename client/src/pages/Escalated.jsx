import { useEffect, useState } from 'react';
import api from '../api';
import AppShell from '../components/AppShell';

export default function Escalated() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/escalated').then(res => { setComplaints(res.data); setLoading(false); });
  }, []);

  return (
    <AppShell>
      <div className="page-header">
        <h1>Escalated complaints</h1>
        <p className="page-subtitle">Unresolved complaints that have exceeded their response window significantly and need zonal-level attention.</p>
      </div>

      {loading ? (
        <p className="page-subtitle">Loading…</p>
      ) : complaints.length === 0 ? (
        <div className="empty-state">Nothing escalated right now — the ward-level queue is keeping pace.</div>
      ) : (
        complaints.map(c => (
          <div key={c._id} className="complaint-card" style={{ borderColor: 'var(--urgency-high)' }}>
            <div className="complaint-card-top">
              <p style={{ fontSize: '0.92rem' }}>{c.summary || c.rawText}</p>
              <span className="urgency-dot" style={{ color: 'var(--urgency-high)' }}>escalated</span>
            </div>
            <div className="complaint-meta">
              {c.category?.replace('_', ' ')} · {c.extractedLocation || c.location} · {c.department}
            </div>
          </div>
        ))
      )}
    </AppShell>
  );
}
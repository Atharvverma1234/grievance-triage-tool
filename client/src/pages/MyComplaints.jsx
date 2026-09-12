import { useEffect, useState } from 'react';
import api from '../api';
import AppShell from '../components/AppShell';

const STATUS_LABELS = { open: 'Open', in_progress: 'In progress', resolved: 'Resolved' };

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/complaints/mine').then(res => { setComplaints(res.data); setLoading(false); });
  }, []);

  return (
    <AppShell>
      <div className="page-header"><h1>Your reports</h1></div>

      {loading ? (
        <p className="page-subtitle">Loading…</p>
      ) : complaints.length === 0 ? (
        <div className="empty-state">You haven't reported anything yet.</div>
      ) : (
        complaints.map(c => (
          <div key={c._id} className="complaint-card">
            <div className="complaint-card-top">
              <p style={{ fontSize: '0.92rem' }}>{c.summary || c.rawText}</p>
              {c.status === 'resolved' ? (
                <span className="stamp">RESOLVED</span>
              ) : (
                <span className="urgency-dot" style={{ color: 'var(--accent)' }}>{STATUS_LABELS[c.status]}</span>
              )}
            </div>
            <div className="complaint-meta">
              {c.category?.replace('_', ' ')} · {c.extractedLocation || c.location || 'No location'} · {new Date(c.createdAt).toLocaleDateString()}
            </div>
            {c.status === 'resolved' && c.resolutionNote && (
              <div className="resolution-note">
                <span style={{ color: 'var(--urgency-low)', fontWeight: 600 }}>Resolution: </span>
                {c.resolutionNote}
              </div>
            )}
          </div>
        ))
      )}
    </AppShell>
  );
}
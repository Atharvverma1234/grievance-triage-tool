import { useEffect, useState } from 'react';
import api from '../api';
import AppShell from '../components/AppShell';

export default function PendingOfficials() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    const res = await api.get('/admin/pending-officials');
    setPending(res.data);
    setLoading(false);
  };

  useEffect(() => {
    let isMounted = true;

    const loadPending = async () => {
      const res = await api.get('/admin/pending-officials');
      if (isMounted) {
        setPending(res.data);
        setLoading(false);
      }
    };

    loadPending();

    return () => {
      isMounted = false;
    };
  }, []);

  const approve = async (id) => {
    await api.patch(`/admin/pending-officials/${id}/approve`);
    fetchPending();
  };

  return (
    <AppShell>
      <div className="page-header"><h1>Pending official accounts</h1></div>

      {loading ? (
        <p className="page-subtitle">Loading…</p>
      ) : pending.length === 0 ? (
        <div className="empty-state">No accounts awaiting approval.</div>
      ) : (
        pending.map(u => (
          <div key={u._id} className="complaint-card">
            <div className="complaint-card-top">
              <div>
                <p style={{ fontSize: '0.92rem' }}>{u.name} — {u.email}</p>
                <div className="complaint-meta">{u.ward || 'No ward specified'}</div>
              </div>
              <button className="btn-primary" onClick={() => approve(u._id)}>Approve</button>
            </div>
          </div>
        ))
      )}
    </AppShell>
  );
}
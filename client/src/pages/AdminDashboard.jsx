import { useEffect, useState } from 'react';
import api from '../api';
import AppShell from '../components/AppShell';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (categoryFilter) params.category = categoryFilter;
    const res = await api.get('/admin/complaints', { params });
    setComplaints(res.data);
    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => { fetchComplaints(); }, 0);
    return () => clearTimeout(timeoutId);
  }, [statusFilter, categoryFilter]);

  const updateStatus = async (id, status, resolutionNote) => {
    await api.patch(`/admin/complaints/${id}`, { status, resolutionNote });
    fetchComplaints();
  };

  return (
    <AppShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <div>
          <h1>Complaint queue</h1>
          <p className="page-subtitle">
            {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} matching current filters
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="field-select" style={{ width: 'auto' }}>
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="field-select" style={{ width: 'auto' }}>
            <option value="">All categories</option>
            <option value="pothole">Pothole</option>
            <option value="garbage">Garbage</option>
            <option value="water_leakage">Water leakage</option>
            <option value="streetlight">Streetlight</option>
            <option value="drainage">Drainage</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="page-subtitle">Loading complaints…</p>
      ) : complaints.length === 0 ? (
        <div className="empty-state">No complaints match these filters yet.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>{['Photo', 'Issue', 'Category', 'Urgency', 'Location', 'Department', 'Reports', 'Status'].map(h => <th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c._id} className={c.isOverdue ? 'overdue' : ''}>
                  <td>
                    {c.photoUrl ? (
                      <a href={`http://localhost:5000${c.photoUrl}`} target="_blank" rel="noopener noreferrer">
                        <img
                          src={`http://localhost:5000${c.photoUrl}`}
                          alt="Complaint attachment"
                          className="photo-thumb"
                        />
                      </a>
                    ) : '—'}
                  </td>
                  <td>
                    {c.isOverdue && <span style={{ color: 'var(--urgency-high)', marginRight: '0.4rem' }} title="Overdue">⚠</span>}
                    {c.summary || c.rawText}
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{c.category?.replace('_', ' ') || '—'}</td>
                  <td>
                    <span className="urgency-dot" style={{ color: `var(--urgency-${c.urgency || 'medium'})` }}>{c.urgency || 'unset'}</span>
                  </td>
                  <td>
                    {c.locationLat && c.locationLng ? (
                      <a href={`https://www.openstreetmap.org/?mlat=${c.locationLat}&mlon=${c.locationLng}#map=17/${c.locationLat}/${c.locationLng}`} target="_blank" rel="noopener noreferrer" className="link">
                        {c.extractedLocation || c.location || 'View pin'}
                      </a>
                    ) : (c.extractedLocation || c.location || '—')}
                  </td>
                  <td>{c.department || '—'}</td>
                  <td>{c.reportCount > 1 ? <span className="report-badge">×{c.reportCount}</span> : '1'}</td>
                  <td>
                    {c.status === 'resolved' ? (
                      <span className="stamp">RESOLVED</span>
                    ) : (
                      <select
                        value={c.status}
                        className="field-select"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.82rem', width: 'auto' }}
                        onChange={e => {
                          const newStatus = e.target.value;
                          if (newStatus === 'resolved') {
                            const note = window.prompt('Add a resolution note (optional):', '');
                            updateStatus(c._id, newStatus, note || '');
                          } else {
                            updateStatus(c._id, newStatus, c.resolutionNote);
                          }
                        }}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}
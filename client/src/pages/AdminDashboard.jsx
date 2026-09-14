
import { useEffect, useState } from 'react';
import api from '../api';
import AppShell from '../components/AppShell';

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [allWards, setAllWards] = useState(false);
  const [error, setError] = useState('');

  // =====================================================
  // Fetch Complaints
  // =====================================================
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {};

      if (statusFilter) {
        params.status = statusFilter;
      }

      if (categoryFilter) {
        params.category = categoryFilter;
      }

      if (allWards) {
        params.allWards = 'true';
      }

      const res = await api.get('/admin/complaints', {
        params
      });

      setComplaints(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);

      setComplaints([]);

      setError(
        err.response?.data?.error ||
        'Failed to load complaints. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Fetch whenever filters change
  // =====================================================
  useEffect(() => {
    const fetch = setTimeout(() => {
      fetchComplaints();
    }, 0);

    return () => clearTimeout(fetch);
  }, [statusFilter, categoryFilter, allWards]);

  // =====================================================
  // Update Complaint Status
  // =====================================================
  const updateStatus = async (
    id,
    status,
    resolutionNote = ''
  ) => {
    try {
      await api.patch(`/admin/complaints/${id}`, {
        status,
        resolutionNote
      });

      await fetchComplaints();
    } catch (err) {
      console.error('Failed to update complaint:', err);

      window.alert(
        err.response?.data?.error ||
        'Failed to update complaint status.'
      );
    }
  };

  // =====================================================
  // Export Complaints as CSV
  // =====================================================
  const exportCSV = () => {
    if (complaints.length === 0) {
      window.alert('There are no complaints to export.');
      return;
    }

    const headers = [
      'Summary',
      'Category',
      'Urgency',
      'Location',
      'Department',
      'Status',
      'Reports',
      'Overdue',
      'Hours Open'
    ];

    const escapeCSV = (value) => {
      if (value === null || value === undefined) {
        return '';
      }

      const text = String(value);

      // Escape quotes and wrap every field in quotes
      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = complaints.map((c) => [
      c.summary || c.rawText || '',
      c.category || '',
      c.urgency || '',
      c.extractedLocation || c.location || '',
      c.department || '',
      c.status || '',
      c.reportCount || 1,
      c.isOverdue ? 'Yes' : 'No',
      c.hoursOpen ?? ''
    ]);

    const csv = [
      headers,
      ...rows
    ]
      .map((row) => row.map(escapeCSV).join(','))
      .join('\n');

    const blob = new Blob(
      [csv],
      {
        type: 'text/csv;charset=utf-8;'
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;
    link.download =
      `complaints-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // Render
  // =====================================================
  return (
    <AppShell>

      {/* =================================================
          Header + Filters
      ================================================== */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '1.5rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <h1>Complaint queue</h1>

          <p className="page-subtitle">
            {complaints.length} complaint
            {complaints.length !== 1 ? 's' : ''}
            {' '}matching current filters
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.6rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >

          {/* All Wards */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <input type="checkbox" checked={allWards} onChange={e => setAllWards(e.target.checked)} />
          All wards
          </label>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="field-select"
            style={{
              width: 'auto'
            }}
          >
            <option value="">
              All statuses
            </option>

            <option value="open">
              Open
            </option>

            <option value="in_progress">
              In progress
            </option>

            <option value="resolved">
              Resolved
            </option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            className="field-select"
            style={{
              width: 'auto'
            }}
          >
            <option value="">
              All categories
            </option>

            <option value="pothole">
              Pothole
            </option>

            <option value="garbage">
              Garbage
            </option>

            <option value="water_leakage">
              Water leakage
            </option>

            <option value="streetlight">
              Streetlight
            </option>

            <option value="drainage">
              Drainage
            </option>

            <option value="other">
              Other
            </option>
          </select>

          {/* Export CSV */}
          <button onClick={exportCSV} className="btn-toolbar">Export CSV</button>
        </div>
      </div>

      {/* =================================================
          Error
      ================================================== */}
      {error && (
        <div
          className="empty-state"
          style={{
            marginBottom: '1rem'
          }}
        >
          {error}
        </div>
      )}

      {/* =================================================
          Loading
      ================================================== */}
      {loading ? (

        <p className="page-subtitle">
          Loading complaints…
        </p>

      ) : complaints.length === 0 ? (

        /* Empty State */
        <div className="empty-state">
          No complaints match these filters yet.
        </div>

      ) : (

        /* =================================================
           Complaints Table
        ================================================== */
        <div className="table-wrap">
          <table>

            <thead>
              <tr>
                {[
                  'Photo',
                  'Issue',
                  'Category',
                  'Urgency',
                  'Location',
                  'Department',
                  'Reports',
                  'Status'
                ].map((heading) => (
                  <th key={heading}>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {complaints.map((c) => (

                <tr
                  key={c._id}
                  className={
                    c.isOverdue
                      ? 'overdue'
                      : ''
                  }
                >

                  {/* Photo */}
                  <td>
                    {c.photoUrl ? (
                      <a
                        href={`http://localhost:5000${c.photoUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`http://localhost:5000${c.photoUrl}`}
                          alt="Complaint attachment"
                          className="photo-thumb"
                        />
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Issue */}
                  <td>
                    {c.isOverdue && (
                      <span
                        style={{
                          color:
                            'var(--urgency-high)',
                          marginRight: '0.4rem'
                        }}
                        title="Overdue"
                      >
                        ⚠
                      </span>
                    )}

                    {c.summary ||
                      c.rawText ||
                      '—'}
                  </td>

                  {/* Category */}
                  <td
                    style={{
                      textTransform:
                        'capitalize'
                    }}
                  >
                    {c.category
                      ? c.category.replace(
                          /_/g,
                          ' '
                        )
                      : '—'}
                  </td>

                  {/* Urgency */}
                  <td>
                    <span
                      className="urgency-dot"
                      style={{
                        color:
                          `var(--urgency-${
                            c.urgency ||
                            'medium'
                          })`
                      }}
                    >
                      {c.urgency ||
                        'unset'}
                    </span>
                  </td>

                  {/* Location */}
                  <td>
                    {c.locationLat != null &&
                    c.locationLng != null ? (

                      <a
                        href={
                          `https://www.openstreetmap.org/?mlat=${c.locationLat}&mlon=${c.locationLng}` +
                          `#map=17/${c.locationLat}/${c.locationLng}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {c.extractedLocation ||
                          c.location ||
                          'View pin'}
                      </a>

                    ) : (

                      c.extractedLocation ||
                      c.location ||
                      '—'

                    )}
                  </td>

                  {/* Department */}
                  <td>
                    {c.department ||
                      '—'}
                  </td>

                  {/* Reports */}
                  <td>
                    {c.reportCount > 1 ? (

                      <span className="report-badge">
                        ×{c.reportCount}
                      </span>

                    ) : (
                      '1'
                    )}
                  </td>

                  {/* Status */}
                  <td>
                    {c.status ===
                    'resolved' ? (

                      <span className="stamp">
                        RESOLVED
                      </span>

                    ) : (

                      <select
                        value={
                          c.status ||
                          'open'
                        }
                        className="field-select"
                        style={{
                          padding:
                            '0.3rem 0.5rem',
                          fontSize:
                            '0.82rem',
                          width:
                            'auto'
                        }}
                        onChange={(e) => {

                          const newStatus =
                            e.target.value;

                          if (
                            newStatus ===
                            'resolved'
                          ) {

                            const note =
                              window.prompt(
                                'Add a resolution note (optional):',
                                ''
                              );

                            updateStatus(
                              c._id,
                              newStatus,
                              note || ''
                            );

                          } else {

                            updateStatus(
                              c._id,
                              newStatus,
                              c.resolutionNote ||
                                ''
                            );

                          }
                        }}
                      >

                        <option value="open">
                          Open
                        </option>

                        <option value="in_progress">
                          In progress
                        </option>

                        <option value="resolved">
                          Resolved
                        </option>

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

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api';
import { Link } from 'react-router-dom';

const chartTheme = { axisColor: '#8B93A3', gridColor: '#262B35' };
const darkTooltipStyle = {
  contentStyle: { background: '#1F2530', border: '1px solid #262B35', borderRadius: 6, fontSize: '0.85rem', color: '#EDEFF3' },
  labelStyle: { color: '#8B93A3' },
  itemStyle: { color: '#EDEFF3' }
};

export default function PublicDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/public/stats').then(res => setData(res.data));
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      <header className="shell-header">
        <div className="shell-header-inner">
          <div className="brand">
            <span className="brand-mark">CG</span>
            <div>
              <div className="brand-title">Civic Grievance Portal</div>
              <div className="brand-sub">Public transparency dashboard</div>
            </div>
          </div>
          <Link to="/" className="nav-link">Sign in</Link>
        </div>
      </header>

      <main className="page">
        <div className="page-header">
          <h1>City-wide complaint transparency</h1>
          <p className="page-subtitle">
            Aggregate, anonymized statistics on civic complaints across the city. No personal or complaint-level data is shown here.
          </p>
        </div>

        {!data ? (
          <p className="page-subtitle">Loading…</p>
        ) : (
          <>
            <div className="insights-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="chart-card">
                <h3>Total complaints filed</h3>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{data.totalComplaints}</div>
              </div>
              <div className="chart-card">
                <h3>Resolution rate</h3>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--urgency-low)' }}>{data.resolutionRate}%</div>
              </div>
              <div className="chart-card">
                <h3>Filed this month</h3>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{data.thisMonthCount}</div>
              </div>
            </div>

            <div className="chart-card" style={{ marginTop: '1.5rem' }}>
              <h3>Complaints by category</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.categoryCounts}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} vertical={false} />
                  <XAxis dataKey="_id" stroke={chartTheme.axisColor} fontSize={12} tickLine={false} axisLine={{ stroke: chartTheme.gridColor }} />
                  <YAxis stroke={chartTheme.axisColor} fontSize={12} tickLine={false} axisLine={{ stroke: chartTheme.gridColor }} />
                  <Tooltip {...darkTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                  <Bar dataKey="count" fill="#3B82C4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
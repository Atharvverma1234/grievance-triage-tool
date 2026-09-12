import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import api from '../api';
import AppShell from '../components/AppShell';

const chartTheme = {
  axisColor: '#8B93A3',
  gridColor: '#262B35',
};

const darkTooltipStyle = {
  contentStyle: {
    background: '#1F2530',
    border: '1px solid #262B35',
    borderRadius: 6,
    fontSize: '0.85rem',
    color: '#EDEFF3'
  },
  labelStyle: { color: '#8B93A3' },
  itemStyle: { color: '#EDEFF3' }
};

export default function Insights() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/insights').then(res => setData(res.data));
  }, []);

  if (!data) {
    return (
      <AppShell>
        <div className="page-header"><h1>Insights</h1></div>
        <p className="page-subtitle">Loading insights…</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="page-header"><h1>Insights</h1></div>

      <div className="digest-card">
        <div className="digest-label">Weekly digest</div>
        <p className="digest-text">{data.digest}</p>
      </div>

      <div className="insights-grid">
        <div className="chart-card">
          <h3>Complaints by category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.categoryCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} vertical={false} />
              <XAxis dataKey="_id" stroke={chartTheme.axisColor} fontSize={12} tickLine={false} axisLine={{ stroke: chartTheme.gridColor }} />
              <YAxis stroke={chartTheme.axisColor} fontSize={12} tickLine={false} axisLine={{ stroke: chartTheme.gridColor }} />
              <Tooltip {...darkTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="count" fill="#3B82C4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Complaint trend over time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} vertical={false} />
              <XAxis dataKey="_id" stroke={chartTheme.axisColor} fontSize={12} tickLine={false} axisLine={{ stroke: chartTheme.gridColor }} />
              <YAxis stroke={chartTheme.axisColor} fontSize={12} tickLine={false} axisLine={{ stroke: chartTheme.gridColor }} />
              <Tooltip {...darkTooltipStyle} />
              <Line type="monotone" dataKey="count" stroke="#3F9F6B" strokeWidth={2} dot={{ fill: '#3F9F6B', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>Top locations</h3>
        <ul className="location-list">
          {data.locationCounts.map(l => (
            <li key={l._id || 'unknown'}>
              <span>{l._id || 'Unknown'}</span>
              <span className="location-count">{l.count} complaint{l.count !== 1 ? 's' : ''}</span>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
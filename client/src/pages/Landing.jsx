import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api';

const FEATURES = [
  {
    icon: '🗣️',
    title: 'Report in your own language',
    desc: 'Type or speak in English, Hindi, Tamil, Bengali, Marathi, or Kannada — AI translates and classifies it automatically.'
  },
  {
    icon: '📍',
    title: 'Pin the exact location',
    desc: 'Drop a map pin alongside a ward or landmark description, so officials can find the issue precisely.'
  },
  {
    icon: '🔁',
    title: 'Duplicate detection',
    desc: 'AI merges near-identical reports of the same issue into one tracked entry, instead of cluttering the queue.'
  },
  {
    icon: '⚠️',
    title: 'Urgency-based escalation',
    desc: 'Complaints exceeding a response-time threshold are automatically flagged and surfaced for officials.'
  },
  {
    icon: '🧭',
    title: 'AI department routing',
    desc: 'Each complaint is routed to the responsible department using semantic retrieval, not a rigid keyword list.'
  },
  {
    icon: '📊',
    title: 'Public transparency',
    desc: 'City-wide complaint statistics are open to everyone — no login required to see how the city is doing.'
  }
];

export default function Landing() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/public/stats').then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      <header className="shell-header">
        <div className="shell-header-inner">
          <div className="brand">
            <span className="brand-mark">CG</span>
            <div>
              <div className="brand-title">Civic Grievance Portal</div>
              <div className="brand-sub">Municipal issue reporting</div>
            </div>
          </div>
          <div className="user-area">
            <Link to="/login" className="nav-link">Sign in</Link>
            <Link to="/register" className="btn-ghost" style={{ textDecoration: 'none' }}>Create account</Link>
          </div>
        </div>
      </header>

      <section className="landing-hero">
        <div className="landing-eyebrow">SDG 11 · Sustainable Cities and Communities</div>
        <h1 className="landing-title">
          Report a civic issue. AI routes it to the right desk, in any language.
        </h1>
        <p className="landing-subtitle">
          A municipal grievance platform that classifies, prioritizes, and translates citizen complaints
          using IBM Granite — so officials see a triaged queue instead of an unsorted pile, and citizens
          aren't limited to typing in English.
        </p>
        <div className="landing-cta-row">
          <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Report an issue</Link>
          <Link to="/transparency" className="btn-secondary">View public statistics</Link>
        </div>
      </section>

      {stats && (
        <section className="landing-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.totalComplaints}</div>
            <div className="stat-label">Complaints filed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--urgency-low)' }}>{stats.resolutionRate}%</div>
            <div className="stat-label">Resolution rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.thisMonthCount}</div>
            <div className="stat-label">Filed this month</div>
          </div>
        </section>
      )}

      <section className="landing-section">
        <h2 className="landing-section-title">How it helps</h2>
        <div className="feature-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        Built for the 1M1B AI for Sustainability Virtual Internship, in collaboration with IBM SkillsBuild &amp; AICTE.
      </footer>
    </div>
  );
}
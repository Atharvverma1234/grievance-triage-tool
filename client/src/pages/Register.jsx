import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import AppShell from '../components/AppShell';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen', ward: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed — try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="page-narrow">
        <div className="page-header">
          <h1>Create an account</h1>
          <p className="page-subtitle">Sign up to report issues or, as a municipal official, to manage them.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="banner banner-error">{error}</div>}

          <div className="field">
            <label className="field-label" htmlFor="name">Full name</label>
            <input id="name" className="field-input" value={form.name} onChange={update('name')} required />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="field-input" value={form.email} onChange={update('email')} required />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="field-input" value={form.password} onChange={update('password')} required />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="role">I am a</label>
            <select id="role" className="field-select" value={form.role} onChange={update('role')}>
              <option value="citizen">Citizen — reporting issues</option>
              <option value="official">Municipal official — managing complaints</option>
            </select>
          </div>
          {form.role === 'official' && (
            <div className="field">
              <label className="field-label" htmlFor="ward">Ward</label>
              <input id="ward" className="field-input" value={form.ward} onChange={update('ward')} placeholder="e.g. Ward 5" />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="helper-text">
          Already have an account? <Link to="/" className="link">Sign in</Link>
        </p>
      </div>
    </AppShell>
  );
} 
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';
import AppShell from '../components/AppShell';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'official' ? '/admin' : '/submit');
    } catch (err) {
      setError(err.response?.data?.error || 'Sign-in failed. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="page-narrow">
        <div className="page-header">
          <h1>Sign in</h1>
          <p className="page-subtitle">Report an issue or manage complaints for your ward.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="banner banner-error">{error}</div>}

          <div className="field">
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="field-input" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="field-input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="helper-text">
          Don't have an account? <Link to="/register" className="link">Create one</Link>
        </p>
      </div>
    </AppShell>
  );
}
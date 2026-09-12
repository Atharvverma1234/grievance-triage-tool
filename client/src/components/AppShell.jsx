import { useAuth } from '../AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          {user && (
            <div className="user-area">
              {user.role === 'citizen' && (
                <Link to="/my-complaints" className="nav-link">My reports</Link>
              )}
              {user.role === 'official' && (
                <>
                  <Link to="/insights" className="nav-link">Insights</Link>
                  <Link to="/pending-officials" className="nav-link">Approvals</Link>
                </>
              )}
              <span className="user-label">{user.name} · {user.role}</span>
              <button onClick={() => { logout(); navigate('/'); }} className="btn-ghost">
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="page">{children}</main>
    </div>
  );
}
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { to: '/expenses', label: 'Expenses', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { to: '/categories', label: 'Categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z' },
  { to: '/budget', label: 'Budget', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
];

function NavIcon({ path }: { path: string }) {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export function Layout() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addToast('You have been logged out.', 'info');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 40,
            display: 'none',
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 'var(--sidebar-width)',
          minWidth: 'var(--sidebar-width)',
          backgroundColor: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
        className={sidebarOpen ? 'sidebar-open' : ''}
      >
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--color-border)' }}>
          <h3 style={{ color: 'var(--color-primary)' }}>Expense Tracker</h3>
        </div>

        <nav style={{ flex: 1, padding: '8px' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 'var(--radius-btn)',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive ? 500 : 400,
                marginBottom: 2,
                transition: 'background-color 0.15s',
              })}
            >
              <NavIcon path={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div
          style={{
            padding: 16,
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: 'var(--color-text-secondary)',
              marginBottom: 8,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.email}
          </p>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              padding: '4px 0',
              fontSize: 14,
            }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: 'var(--color-bg)',
        }}
      >
        {/* Mobile top bar */}
        <div
          className="mobile-topbar"
          style={{
            display: 'none',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
            }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span style={{ fontWeight: 600 }}>Expense Tracker</span>
        </div>

        <div style={{ padding: 24 }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 768px) {
          .mobile-topbar { display: flex !important; }
          aside:not(.sidebar-open) { display: none !important; }
          aside.sidebar-open {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            min-width: 100% !important;
            z-index: 50 !important;
          }
          .sidebar-overlay { display: block !important; }
        }
      `}</style>
    </div>
  );
}

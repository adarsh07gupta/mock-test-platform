import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('auth_user');
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    try {
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: 8 }}>Dashboard</h1>
      {user ? (
        <div style={{ marginBottom: 16 }}>
          <p style={{ margin: 0 }}>Welcome, <strong>{user.name || user.email}</strong>!</p>
          <p style={{ margin: '4px 0 0 0', color: '#555' }}>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading user...</p>
      )}

      <button
        onClick={handleLogout}
        style={{
          padding: '8px 12px',
          background: '#e53e3e',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Sign out
      </button>
    </div>
  );
};

export default Dashboard;
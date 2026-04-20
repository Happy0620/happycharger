import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setUser } = useAppContext();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const btn = document.getElementById('loginSubmitBtn') as HTMLButtonElement;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        navigate('/');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  };

  return (
    <div className="auth-body">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo">Feasto</Link>
        </nav>
      </div>

      <div className="auth-container">
        <div className="auth-card login-card">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Login to continue ordering your favorite food</p>
          </div>

          <form id="loginForm" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <i className="fa-regular fa-envelope"></i>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ marginBottom: 0 }}>Password</label>
                <a href="#" className="text-link" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Forgot Password?</a>
              </div>
              <div className="input-wrapper">
                <i className="fa-solid fa-lock"></i>
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`} onClick={() => setShowPassword(!showPassword)}></i>
              </div>
            </div>

            <button type="submit" id="loginSubmitBtn" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>Login</button>

            <p className="form-subtext">
              Don't have an account? <Link to="/signup" className="text-link">Sign Up</Link>
            </p>
          </form>
        </div>

        <div className="login-floating-images">
          <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Food 1" className="floating-img" />
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Food 2" className="floating-img" style={{ transform: 'scale(1.1)', zIndex: 5 }} />
          <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Food 3" className="floating-img" />
        </div>
      </div>
    </div>
  );
}

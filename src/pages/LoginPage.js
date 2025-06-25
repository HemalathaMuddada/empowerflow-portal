import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Removed Carousel imports as it's being replaced by branding section
// import { Carousel } from 'react-responsive-carousel';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
import logo from '../logo.svg'; // Correctly placed import
import './LoginPage.css';

// Dummy credentials - In a real app, this would come from a backend or secure storage
const DUMMY_USERS = {
  'alice.j@example.com': { id: 'emp001', password: 'password', role: 'employee', name: 'Alice Johnson' },
  'bob.w@example.com': { id: 'emp002', password: 'password', role: 'lead', name: 'Bob Williams' },
  'carol.d@example.com': { id: 'emp003', password: 'password', role: 'manager', name: 'Carol Davis' },
  'david.g@example.com': { id: 'emp004', password: 'password', role: 'hr', name: 'David Green' },
  'frank.b@example.com': { id: 'emp006', password: 'password', role: 'superadmin', name: 'Frank Black' },
  'employee@example.com': { id: 'empDummy001', password: 'password', role: 'employee', name: 'John Doe (Demo)'}
};

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    const user = DUMMY_USERS[email.toLowerCase()];

    if (user && user.password === password) {
      localStorage.setItem('loggedInUser', JSON.stringify({
        id: user.id,
        name: user.name,
        role: user.role,
        email: email.toLowerCase()
      }));
      sessionStorage.setItem('justLoggedIn', 'true');
      navigate(`/dashboard/${user.role}`, { state: { user: { id: user.id, name: user.name, role: user.role } } });
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-page-container"> {/* This will be the main flex container */}
      <div className="login-branding-section">
        <img src={logo} alt="EmpowerFlow Logo" className="login-logo" />
        <h1>EmpowerFlow</h1>
        <p>Integrated HR & Payroll Platform</p>
      </div>
      <div className="login-form-container">
        <div className="login-form-card">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Login ID</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Login ID"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="form-options">
              <a href="/forgot-password" onClick={(e)=> e.preventDefault()} className="forgot-password-link">Forgot Password?</a>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="login-button">Login</button>
          </form>
          <p className="signup-prompt">
            Don't have an account? <a href="/signup" className="signup-link">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

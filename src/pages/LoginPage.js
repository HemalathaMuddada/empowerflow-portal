import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import './LoginPage.css'; // We will create this file for styles

// Dummy credentials - In a real app, this would come from a backend or secure storage
// Aligned with INITIAL_MASTER_EMPLOYEE_LIST for IDs and some names/roles
const DUMMY_USERS = {
  'alice.j@example.com': { id: 'emp001', password: 'password', role: 'employee', name: 'Alice Johnson' }, // Assuming 'employee' role for Alice for login simplicity
  'bob.w@example.com': { id: 'emp002', password: 'password', role: 'lead', name: 'Bob Williams' },
  'carol.d@example.com': { id: 'emp003', password: 'password', role: 'manager', name: 'Carol Davis' },
  'david.g@example.com': { id: 'emp004', password: 'password', role: 'hr', name: 'David Green' },
  'frank.b@example.com': { id: 'emp006', password: 'password', role: 'superadmin', name: 'Frank Black' },
  // Add a generic employee if needed for the old 'employee@example.com'
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
      // Store user info (e.g., in localStorage or context for other components to access)
      localStorage.setItem('loggedInUser', JSON.stringify({
        id: user.id, // Store the ID
        name: user.name,
        role: user.role,
        email: email.toLowerCase() // Store consistent email
      }));
      sessionStorage.setItem('justLoggedIn', 'true'); // Flag for one-time welcome message

      // Redirect based on role
      // Pass user object which now includes id to dashboards if needed, though localStorage is primary source
      navigate(`/dashboard/${user.role}`, { state: { user: { id: user.id, name: user.name, role: user.role } } });
    } else {
      setError('Invalid email or password.');
    }
  };

import logo from '../logo.svg'; // Assuming logo.svg is in src/

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
        {/* Branding content: Logo and tagline */}
        <img src={logo} alt="EmpowerFlow Logo" className="login-logo" />
        <h1>EmpowerFlow</h1>
        <p>Integrated HR & Payroll Platform</p>
      </div>
      <div className="login-form-container"> {/* This will be the right column for the form */}
        <div className="login-form-card"> {/* Inner card for the form itself */}
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Login ID</label> {/* Changed label */}
              <input
                type="email" // Assuming Login ID is email
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
              {/* TODO: Implement "Login with OTP" if needed */}
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

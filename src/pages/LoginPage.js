import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel'; // Restore Carousel import
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Restore Carousel CSS
import logo from '../logo.svg';
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
        <p className="tagline">Integrated HR & Payroll Platform</p>
        <div className="login-carousel-wrapper">
          <Carousel
              autoPlay
              infiniteLoop
              showThumbs={false}
              showStatus={false}
              interval={4000}
              transitionTime={700}
              emulateTouch={true}
          >
            <div>
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29sbGFib3JhdGlvbnxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=800&q=80" alt="Dynamic Team Collaboration" />
              <p className="legend">Foster Seamless Collaboration</p>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2R1Y3Rpdml0eXxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=800&q=80" alt="Peak Productivity Tools" />
              <p className="legend">Elevate Team Productivity</p>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1604881991720-f91add269bed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGVtcGxveWVlJTIwd2VsbGJlaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80" alt="Employee Well-being Focus" />
              <p className="legend">Champion Employee Well-being</p>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9kZXJuJTIwb2ZmaWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=80" alt="Future of Work Solutions" />
              <p className="legend">Innovate Your HR Processes</p>
            </div>
          </Carousel>
        </div>
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

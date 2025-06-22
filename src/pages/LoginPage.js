import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import './LoginPage.css'; // We will create this file for styles

// Dummy credentials - In a real app, this would come from a backend or secure storage
const DUMMY_USERS = {
  'employee@example.com': { password: 'password', role: 'employee', name: 'John Doe' },
  'lead@example.com': { password: 'password', role: 'lead', name: 'Jane Smith' },
  'manager@example.com': { password: 'password', role: 'manager', name: 'Mike Ross' },
  'hr@example.com': { password: 'password', role: 'hr', name: 'Sarah Connor' },
  'superadmin@example.com': { password: 'password', role: 'superadmin', name: 'Admin User' },
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
      // For now, we pass it via route state. This is simple but has limitations.
      // A context API or Redux would be better for a larger application.
      localStorage.setItem('loggedInUser', JSON.stringify({ name: user.name, role: user.role, email: email }));

      // Redirect based on role
      navigate(`/dashboard/${user.role}`, { state: { user: { name: user.name, role: user.role } } });
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-section">
        <div className="logo">EmpowerFlow</div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E.g., user@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
      <div className="login-carousel-section">
        <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={4000} // Slightly faster interval
            transitionTime={700} // Smoother transition
            emulateTouch={true}
        >
          <div>
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29sbGFib3JhdGlvbnxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=1000&q=80" alt="Dynamic Team Collaboration" />
            <p className="legend">Foster Seamless Collaboration</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2R1Y3Rpdml0eXxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=1000&q=80" alt="Peak Productivity Tools" />
            <p className="legend">Elevate Team Productivity</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1604881991720-f91add269bed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGVtcGxveWVlJTIwd2VsbGJlaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=1000&q=80" alt="Employee Well-being Focus" />
            <p className="legend">Champion Employee Well-being</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9kZXJuJTIwb2ZmaWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=1000&q=80" alt="Future of Work Solutions" />
            <p className="legend">Innovate Your HR Processes</p>
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default LoginPage;

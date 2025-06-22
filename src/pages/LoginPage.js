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
        <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={5000}>
          <div>
            {/* Using Unsplash for more control over image type - searching for "abstract" or "business technology" */}
            <img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3MlMjB0ZWNobm9sb2d5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" alt="Modern Business Technology" />
            <p className="legend">Integrated HR Solutions</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGF0YSUyMGFuYWx5dGljc3xlbnwwfHwwfHx8MA&auto=format&fit=crop&w=800&q=60" alt="Data Analytics and Insights" />
            <p className="legend">Unlock Data-Driven Insights</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGVhbSUyMGNvbGxhYm9yYXRpb258ZW58MHx8MHx8fDA&auto=format&fit=crop&w=800&q=60" alt="Seamless Collaboration" />
            <p className="legend">Empower Your Workforce</p>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJ1c2luZXNzJTIwZ3Jvd3RofGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" alt="Business Growth and Scalability" />
            <p className="legend">Scale With Confidence</p>
          </div>
        </Carousel>
      </div>
    </div>
  );
}

export default LoginPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css'; // We will create this file for styles

const ROLES = ['employee', 'lead', 'manager', 'hr']; // Superadmin typically created differently

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword || !role) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }

    // Password strength (example: at least 6 characters)
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    // Simulate signup process
    console.log('Simulating signup:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password); // In a real app, NEVER log passwords
    console.log('Role:', role);

    // In a real app, you would send this to a backend server.
    // You might also want to add the new user to the DUMMY_USERS object
    // if you want them to be able to log in immediately (not implemented here for simplicity).

    setSuccess(`Account for ${name} (${role}) created successfully! You can now try logging in.`);

    // Optionally, clear form or redirect
    // setName('');
    // setEmail('');
    // setPassword('');
    // setConfirmPassword('');
    // setRole(ROLES[0]);

    // setTimeout(() => {
    //   navigate('/login');
    // }, 3000); // Redirect to login after 3 seconds
  };

  return (
    <div className="signup-page-container">
      <div className="signup-form-section">
        <div className="logo">EmpowerFlow</div>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., John Doe"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E.g., john.doe@example.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Retype your password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;

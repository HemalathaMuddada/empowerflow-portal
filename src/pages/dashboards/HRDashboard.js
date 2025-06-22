import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { speakText, getTimeBasedGreeting, speakLogoutMessage } from '../../utils/speech';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import './Dashboard.css'; // Common dashboard styles

function HRDashboard() {
  const [userName, setUserName] = useState('HR Professional');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    let currentUserName = 'HR Professional';

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData && userData.name) {
          currentUserName = userData.name;
        }
      } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
      }
    }
    setUserName(currentUserName);

    const greeting = getTimeBasedGreeting();
    if (storedUser) {
        const welcomeMessage = `${greeting} ${currentUserName}, you have successfully logged into the portal. Welcome to the HR Dashboard.`;
        speakText(welcomeMessage);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleLogout = () => {
    const storedUserForLogout = localStorage.getItem('loggedInUser');
    let currentUserNameForLogout = 'User';
    if (storedUserForLogout) {
      try {
        const userData = JSON.parse(storedUserForLogout);
        currentUserNameForLogout = userData.name || currentUserNameForLogout;
      } catch (e) { /* ignore */ }
    }
    speakLogoutMessage(currentUserNameForLogout);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>HR Dashboard</p>
          </div>
          <div className="header-actions">
            <ThemeSwitcher />
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        <h2>Welcome, {userName}!</h2>
        <p>Manage employee records, payroll, recruitment, and company policies.</p>
        {/* More HR-specific content would go here */}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HRDashboard;

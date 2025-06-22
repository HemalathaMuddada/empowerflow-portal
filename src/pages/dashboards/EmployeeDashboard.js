import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { speakText, getTimeBasedGreeting, speakLogoutMessage } from '../../utils/speech';
import ThemeSwitcher from '../../components/ThemeSwitcher'; // Import ThemeSwitcher
import './Dashboard.css'; // Common dashboard styles

function EmployeeDashboard() {
  const [userName, setUserName] = useState('Employee');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    let currentUserName = 'Employee'; // Default

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
    // else if (routeUserName) { // Fallback to route state if localStorage fails or is empty
    //   currentUserName = routeUserName;
    // }

    setUserName(currentUserName);

    const greeting = getTimeBasedGreeting();
    // Only speak welcome if user data was actually found and parsed
    if (storedUser) {
        const welcomeMessage = `${greeting} ${currentUserName}, you have successfully logged into the portal. Welcome to your Employee Dashboard.`;
        speakText(welcomeMessage);
    }

    // Cleanup function to stop speech if component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleLogout = () => {
    const storedUserForLogout = localStorage.getItem('loggedInUser');
    let currentUserNameForLogout = 'User';
    if (storedUserForLogout) {
      try {
        const userData = JSON.parse(storedUserForLogout);
        currentUserNameForLogout = userData.name || currentUserNameForLogout;
      } catch (e) { /* ignore parsing error */ }
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
            <p>Employee Dashboard</p>
          </div>
          <div className="header-actions">
            <ThemeSwitcher />
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        <h2>Welcome, {userName}!</h2>
        <p>This is your personal dashboard. Here you can find your tasks, company updates, and personal information.</p>
        {/* More employee-specific content would go here */}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default EmployeeDashboard;

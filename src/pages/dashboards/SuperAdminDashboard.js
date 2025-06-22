import React, { useEffect, useState } from 'react';
import { speakText, getTimeBasedGreeting } from '../../utils/speech';
import './Dashboard.css'; // Common dashboard styles

function SuperAdminDashboard() {
  const [userName, setUserName] = useState('Super Admin');

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    let currentUserName = 'Super Admin';

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
    const welcomeMessage = `${greeting} ${currentUserName}, you have successfully logged into the portal. Welcome to the Super Admin Dashboard.`;
    speakText(welcomeMessage);

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>EmpowerFlow</h1>
        <p>Super Admin Dashboard</p>
      </header>
      <main className="dashboard-content">
        <h2>Welcome, {userName}!</h2>
        <p>System-wide configuration, user management, and advanced settings.</p>
        {/* More Super Admin-specific content would go here */}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default SuperAdminDashboard;

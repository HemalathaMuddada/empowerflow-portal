import React, { useEffect, useState } from 'react';
import { speakText, getTimeBasedGreeting } from '../../utils/speech';
import './Dashboard.css'; // Common dashboard styles

function HRDashboard() {
  const [userName, setUserName] = useState('HR Professional');

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
    const welcomeMessage = `${greeting} ${currentUserName}, you have successfully logged into the portal. Welcome to the HR Dashboard.`;
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
        <p>HR Dashboard</p>
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

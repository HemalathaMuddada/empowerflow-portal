import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom'; // Using localStorage now
import { speakText, getTimeBasedGreeting } from '../../utils/speech';
import './Dashboard.css'; // Common dashboard styles

function EmployeeDashboard() {
  // const location = useLocation();
  // const routeUserName = location.state?.user?.name; // From route state if passed

  const [userName, setUserName] = useState('Employee');

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
    const welcomeMessage = `${greeting} ${currentUserName}, you have successfully logged into the portal. Welcome to your Employee Dashboard.`;
    speakText(welcomeMessage);

    // Cleanup function to stop speech if component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>EmpowerFlow</h1>
        <p>Employee Dashboard</p>
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

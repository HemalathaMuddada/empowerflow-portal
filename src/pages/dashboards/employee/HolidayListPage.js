import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HOLIDAY_LIST } from '../../../utils/constants';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, getTimeBasedGreeting, speakText } from '../../../utils/speech'; // For potential header use
import { useNavigate } from 'react-router-dom';
import './HolidayListPage.css'; // If specific styles are needed

function HolidayListPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee'); // Default, can be enhanced

  // Effect for user name and potentially a greeting if this page were standalone for some reason
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || 'Employee');
      } catch (e) { console.error(e); }
    }
    // Optional: Speak a greeting or page title
    // speakText("Viewing Company Holiday List");
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

  const currentYear = new Date().getFullYear();
  const holidaysForYear = HOLIDAY_LIST.filter(h => h.date.startsWith(String(currentYear)));

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="dashboard-container holiday-list-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>Company Holiday List - {currentYear}</p>
          </div>
          <div className="header-actions">
            <ThemeSwitcher />
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        <div style={{ marginBottom: '20px' }}>
            <Link to="/dashboard/employee" className="action-button" style={{backgroundColor: 'var(--secondary-accent-color)'}}>
                &larr; Back to Dashboard
            </Link>
        </div>

        <h2>Official Holiday List for {currentYear}</h2>
        {holidaysForYear.length > 0 ? (
          <table className="holiday-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Holiday Name</th>
              </tr>
            </thead>
            <tbody>
              {holidaysForYear.map(holiday => {
                const dateObj = new Date(holiday.date);
                const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
                return (
                  <tr key={holiday.name}>
                    <td>{dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                    <td>{dayOfWeek}</td>
                    <td>{holiday.name}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No holidays listed for the current year ({currentYear}). Please check back later or contact HR.</p>
        )}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HolidayListPage;

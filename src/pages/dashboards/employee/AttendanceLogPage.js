import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import './AttendanceLogPage.css';

function AttendanceLogPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee');

  // Form state
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [inTime, setInTime] = useState('');
  const [outTime, setOutTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // History state
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const loadAttendanceHistory = () => {
    const storedHistory = localStorage.getItem('attendanceLogs');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        // Sort by date descending
        parsedHistory.sort((a,b) => new Date(b.date) - new Date(a.date));
        setAttendanceHistory(parsedHistory);
      } catch (e) {
        console.error("Failed to parse attendance history:", e);
        setAttendanceHistory([]);
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || 'Employee');
      } catch (e) { console.error(e); }
    }
    speakText("Attendance Log");
    loadAttendanceHistory();
  }, []);

  const handleLogout = () => {
    // Logout logic (same as other dashboard pages)
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

  const handleLogAttendance = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!logDate || !inTime || !outTime) {
      setError("Date, In-Time, and Out-Time are required.");
      return;
    }

    // Convert times to Date objects to calculate duration
    const todayForTime = '1970-01-01T'; // Use a dummy date for time calculation
    const inDateTime = new Date(`${todayForTime}${inTime}:00`);
    const outDateTime = new Date(`${todayForTime}${outTime}:00`);

    if (isNaN(inDateTime.getTime()) || isNaN(outDateTime.getTime())) {
        setError("Invalid In-Time or Out-Time format.");
        return;
    }

    if (outDateTime <= inDateTime) {
      setError("Out-Time must be after In-Time.");
      return;
    }

    const durationMs = outDateTime - inDateTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const totalHoursFormatted = `${hours}h ${minutes}m`;

    const newLogEntry = {
      id: Date.now(), // Simple unique ID
      date: logDate,
      inTime,
      outTime,
      totalHours: totalHoursFormatted,
      notes,
    };

    const updatedHistory = [newLogEntry, ...attendanceHistory];
     // Sort by date descending after adding new entry
    updatedHistory.sort((a,b) => new Date(b.date) - new Date(a.date));

    localStorage.setItem('attendanceLogs', JSON.stringify(updatedHistory));
    setAttendanceHistory(updatedHistory);
    setSuccess(`Attendance logged for ${logDate}: ${totalHoursFormatted}.`);

    // Clear form for next entry
    // setLogDate(new Date().toISOString().split('T')[0]); // Optionally reset date to today
    setInTime('');
    setOutTime('');
    setNotes('');
  };

  return (
    <div className="dashboard-container attendance-log-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>{userName}'s Attendance Log</p>
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

        <div className="attendance-form-section dashboard-card">
          <h3>Log Your Attendance</h3>
          <form onSubmit={handleLogAttendance} className="attendance-form">
            {error && <p className="form-message error-message">{error}</p>}
            {success && <p className="form-message success-message">{success}</p>}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="logDate">Date:</label>
                <input type="date" id="logDate" value={logDate} onChange={(e) => setLogDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="inTime">In-Time:</label>
                <input type="time" id="inTime" value={inTime} onChange={(e) => setInTime(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="outTime">Out-Time:</label>
                <input type="time" id="outTime" value={outTime} onChange={(e) => setOutTime(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notes (Optional):</label>
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" />
            </div>
            <button type="submit" className="submit-button">Log Attendance</button>
          </form>
        </div>

        <div className="attendance-history-section dashboard-card">
          <h3>Attendance History</h3>
          {attendanceHistory.length > 0 ? (
            <div className="table-responsive-wrapper">
              <table className="attendance-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>In-Time</th>
                    <th>Out-Time</th>
                    <th>Total Hours</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistory.map(log => (
                    <tr key={log.id}>
                      <td>{log.date}</td>
                      <td>{log.inTime}</td>
                      <td>{log.outTime}</td>
                      <td>{log.totalHours}</td>
                      <td className="notes-cell" title={log.notes}>{log.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No attendance records found.</p>
          )}
        </div>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AttendanceLogPage;

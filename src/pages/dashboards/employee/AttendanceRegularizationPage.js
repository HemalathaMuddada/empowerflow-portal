import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import './AttendanceRegularizationPage.css';

function AttendanceRegularizationPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee');

  // Form state
  const [discrepancyDate, setDiscrepancyDate] = useState('');
  const [originalInTime, setOriginalInTime] = useState('');
  const [originalOutTime, setOriginalOutTime] = useState('');
  const [requestedInTime, setRequestedInTime] = useState('');
  const [requestedOutTime, setRequestedOutTime] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // History state
  const [regularizationHistory, setRegularizationHistory] = useState([]);

  const loadRegularizationHistory = () => {
    const storedHistory = localStorage.getItem('attendanceRegularizationRequests');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        parsedHistory.sort((a,b) => new Date(b.submissionDate) - new Date(a.submissionDate));
        setRegularizationHistory(parsedHistory);
      } catch (e) {
        console.error("Failed to parse regularization history:", e);
        setRegularizationHistory([]);
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
    speakText("Attendance Regularization Request");
    loadRegularizationHistory();
  }, []);

  const handleLogout = () => {
    speakLogoutMessage(userName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!discrepancyDate || !reason.trim() || (!requestedInTime && !requestedOutTime)) {
      setFormError('Discrepancy Date, Reason, and at least one Requested Time are required.');
      return;
    }
    if( (requestedInTime && !requestedOutTime) || (!requestedInTime && requestedOutTime) ){
        // If one requested time is filled, the other should ideally also be, or logic needs to handle partial updates.
        // For now, let's assume if one is provided, the other might be the same as original or needs clarification.
        // This simple validation might need refinement based on actual business rules.
    }
    if (requestedInTime && requestedOutTime && requestedOutTime <= requestedInTime) {
        setFormError('Requested Out-Time must be after Requested In-Time.');
        return;
    }

    const newRequest = {
      id: Date.now(),
      discrepancyDate,
      originalInTime: originalInTime || 'N/A',
      originalOutTime: originalOutTime || 'N/A',
      requestedInTime: requestedInTime || 'N/A',
      requestedOutTime: requestedOutTime || 'N/A',
      reason: reason.trim(),
      submissionDate: new Date().toISOString(),
      status: 'Pending' // Default status
    };

    // Simulate notification
    console.log(`--- Attendance Regularization Request ---
Submitted By: ${userName}
Date of Discrepancy: ${discrepancyDate}
Original Times: ${newRequest.originalInTime} - ${newRequest.originalOutTime}
Requested Times: ${newRequest.requestedInTime} - ${newRequest.requestedOutTime}
Reason: ${newRequest.reason}
Status: ${newRequest.status}
--- Forwarded to HR/Manager for Approval ---`);

    const updatedHistory = [newRequest, ...regularizationHistory];
    updatedHistory.sort((a,b) => new Date(b.submissionDate) - new Date(a.submissionDate));

    localStorage.setItem('attendanceRegularizationRequests', JSON.stringify(updatedHistory));
    setRegularizationHistory(updatedHistory);

    setFormSuccess("Regularization request submitted successfully.");
    // Clear form
    setDiscrepancyDate('');
    setOriginalInTime('');
    setOriginalOutTime('');
    setRequestedInTime('');
    setRequestedOutTime('');
    setReason('');
  };

  const formatDateForDisplay = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD
  };

  return (
    <div className="dashboard-container attendance-reg-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>{userName}'s Attendance Regularization</p>
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

        <div className="regularization-form-section dashboard-card">
          <h3>Request Attendance Regularization</h3>
          <p className="form-description">
            Use this form to request corrections for discrepancies in your recorded attendance, such as missed punch-in/out or incorrect timings.
          </p>
          <form onSubmit={handleSubmitRequest} className="regularization-form">
            {formError && <p className="form-message error-message">{formError}</p>}
            {formSuccess && <p className="form-message success-message">{formSuccess}</p>}

            <div className="form-group">
              <label htmlFor="discrepancyDate">Date of Discrepancy:</label>
              <input type="date" id="discrepancyDate" value={discrepancyDate} onChange={(e) => setDiscrepancyDate(e.target.value)} required />
            </div>

            <div className="form-row">
                <div className="form-group">
                <label htmlFor="originalInTime">Original In-Time (if any):</label>
                <input type="time" id="originalInTime" value={originalInTime} onChange={(e) => setOriginalInTime(e.target.value)} />
                </div>
                <div className="form-group">
                <label htmlFor="originalOutTime">Original Out-Time (if any):</label>
                <input type="time" id="originalOutTime" value={originalOutTime} onChange={(e) => setOriginalOutTime(e.target.value)} />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                <label htmlFor="requestedInTime">Requested In-Time:</label>
                <input type="time" id="requestedInTime" value={requestedInTime} onChange={(e) => setRequestedInTime(e.target.value)} />
                </div>
                <div className="form-group">
                <label htmlFor="requestedOutTime">Requested Out-Time:</label>
                <input type="time" id="requestedOutTime" value={requestedOutTime} onChange={(e) => setRequestedOutTime(e.target.value)} />
                </div>
            </div>
            <p className="form-hint"><small>Please provide at least one Requested Time. If only correcting one punch, leave the other Requested Time blank if it should remain as per original record or system default (e.g. if you forgot to punch out).</small></p>


            <div className="form-group">
              <label htmlFor="reason">Reason for Regularization:</label>
              <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows="4" required />
            </div>
            <button type="submit" className="submit-button">Submit Request</button>
          </form>
        </div>

        <div className="regularization-history-section dashboard-card">
          <h3>My Regularization Requests</h3>
          {regularizationHistory.length > 0 ? (
            <div className="table-responsive-wrapper">
              <table className="regularization-history-table">
                <thead>
                  <tr>
                    <th>Submitted</th>
                    <th>Discrepancy Date</th>
                    <th>Original In/Out</th>
                    <th>Requested In/Out</th>
                    <th className="reason-col">Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {regularizationHistory.map(req => (
                    <tr key={req.id}>
                      <td>{formatDateForDisplay(req.submissionDate)}</td>
                      <td>{formatDateForDisplay(req.discrepancyDate)}</td>
                      <td>{req.originalInTime} - {req.originalOutTime}</td>
                      <td>{req.requestedInTime} - {req.requestedOutTime}</td>
                      <td className="reason-col" title={req.reason}>{req.reason}</td>
                      <td><span className={`status-badge status-${req.status.toLowerCase()}`}>{req.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No regularization requests submitted yet.</p>
          )}
        </div>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AttendanceRegularizationPage;

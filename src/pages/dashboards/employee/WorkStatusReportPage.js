import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import './WorkStatusReportPage.css';

const OVERALL_STATUS_OPTIONS = [
    { value: 'on_track', label: 'On Track' },
    { value: 'minor_delays', label: 'Minor Delays' },
    { value: 'significant_delays', label: 'Significant Delays' },
    { value: 'completed', label: 'Completed' }
];

function WorkStatusReportPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee');

  // Form state
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasksCompleted, setTasksCompleted] = useState('');
  const [tasksPlanned, setTasksPlanned] = useState('');
  const [blockers, setBlockers] = useState('');
  const [overallStatus, setOverallStatus] = useState(OVERALL_STATUS_OPTIONS[0].value);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // History state
  const [reportHistory, setReportHistory] = useState([]); // Will be populated in the next step

  const loadReportHistory = () => {
    const storedReports = localStorage.getItem('workStatusReports');
    if (storedReports) {
      try {
        const parsedReports = JSON.parse(storedReports);
        // Sort by reportDate descending
        parsedReports.sort((a,b) => new Date(b.reportDate) - new Date(a.reportDate));
        setReportHistory(parsedReports); // This will be used in the next step for display
      } catch (e) {
        console.error("Failed to parse work status reports:", e);
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
    speakText("Work Status Report");
    loadReportHistory(); // Load history on mount for the next step
  }, []);

  const handleLogout = () => {
    // Standard logout logic
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

  const handleSubmitReport = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!reportDate || !tasksCompleted.trim() || !overallStatus) {
      setError('Report Date, Tasks Completed, and Overall Status are required.');
      return;
    }

    let leadEmail = "lead@example.com"; // Default for employee
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    if (loggedInUser.role === 'lead') {
        leadEmail = "manager@example.com"; // Lead reports to their manager
    }

    const reportData = {
      id: Date.now(),
      reportDate,
      tasksCompleted: tasksCompleted.trim(),
      tasksPlanned: tasksPlanned.trim(),
      blockers: blockers.trim(),
      overallStatus,
      submittedBy: userName,
      submissionTimestamp: new Date().toISOString(),
    };

    // Simulate email notification
    console.log(`--- Work Status Report ---
To: ${leadEmail}
From: ${userName} (${localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser')).email : 'user@example.com'})
Date: ${new Date(reportData.submissionTimestamp).toLocaleString()}
Report Date: ${reportDate}
Overall Status: ${OVERALL_STATUS_OPTIONS.find(opt => opt.value === overallStatus)?.label}

Tasks Completed:
${tasksCompleted.trim()}

Tasks Planned:
${tasksPlanned.trim() || 'N/A'}

Blockers/Issues:
${blockers.trim() || 'N/A'}
--- End of Report ---`);

    // Store in localStorage
    const currentReports = JSON.parse(localStorage.getItem('workStatusReports') || '[]');
    const updatedReports = [reportData, ...currentReports];
     // Sort by reportDate descending after adding new entry
    updatedReports.sort((a,b) => new Date(b.reportDate) - new Date(a.reportDate));

    localStorage.setItem('workStatusReports', JSON.stringify(updatedReports));
    setReportHistory(updatedReports); // Update state for immediate display in history (next step)

    setSuccess(`Report for ${reportDate} submitted successfully.`);
    // Clear form fields
    setTasksCompleted('');
    setTasksPlanned('');
    setBlockers('');
    setOverallStatus(OVERALL_STATUS_OPTIONS[0].value);
    // setReportDate(new Date().toISOString().split('T')[0]); // Optionally reset date
  };

  return (
    <div className="dashboard-container work-status-report-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>{userName}'s Work Status Report</p>
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

        <div className="report-form-section dashboard-card">
          <h3>Submit Work Status Report</h3>
          <form onSubmit={handleSubmitReport} className="status-report-form">
            {error && <p className="form-message error-message">{error}</p>}
            {success && <p className="form-message success-message">{success}</p>}

            <div className="form-group">
              <label htmlFor="reportDate">Report Date:</label>
              <input type="date" id="reportDate" value={reportDate} onChange={(e) => setReportDate(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="tasksCompleted">Tasks Completed Today/This Period:</label>
              <textarea id="tasksCompleted" value={tasksCompleted} onChange={(e) => setTasksCompleted(e.target.value)} rows="5" required />
            </div>

            <div className="form-group">
              <label htmlFor="tasksPlanned">Tasks Planned for Next Day/Period:</label>
              <textarea id="tasksPlanned" value={tasksPlanned} onChange={(e) => setTasksPlanned(e.target.value)} rows="5" />
            </div>

            <div className="form-group">
              <label htmlFor="blockers">Blockers / Issues Faced (Optional):</label>
              <textarea id="blockers" value={blockers} onChange={(e) => setBlockers(e.target.value)} rows="3" />
            </div>

            <div className="form-group">
              <label htmlFor="overallStatus">Overall Status:</label>
              <select id="overallStatus" value={overallStatus} onChange={(e) => setOverallStatus(e.target.value)} required>
                {OVERALL_STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-button">Submit Report</button>
          </form>
        </div>

        <div className="report-history-section dashboard-card">
          <h3>Submitted Report History</h3>
          {reportHistory.length > 0 ? (
            <div className="table-responsive-wrapper">
              <table className="report-history-table">
                <thead>
                  <tr>
                    <th>Report Date</th>
                    <th>Overall Status</th>
                    <th>Submitted On</th>
                    <th>View Details</th>
                  </tr>
                </thead>
                <tbody>
                  {reportHistory.map(report => (
                    <tr key={report.id}>
                      <td>{report.reportDate}</td>
                      <td>
                        <span className={`status-label status-${report.overallStatus}`}>
                            {OVERALL_STATUS_OPTIONS.find(opt => opt.value === report.overallStatus)?.label || report.overallStatus}
                        </span>
                      </td>
                      <td>{new Date(report.submissionTimestamp).toLocaleDateString()} {new Date(report.submissionTimestamp).toLocaleTimeString()}</td>
                      <td>
                        <button
                          onClick={() => alert(`Details for ${report.reportDate}:\nTasks Completed: ${report.tasksCompleted}\nTasks Planned: ${report.tasksPlanned || 'N/A'}\nBlockers: ${report.blockers || 'N/A'}`)}
                          className="view-details-button"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No reports submitted yet.</p>
          )}
        </div>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default WorkStatusReportPage;

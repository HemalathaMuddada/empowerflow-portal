import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import './RaiseConcernPage.css';

const CONCERN_CATEGORIES = [
    { value: 'it_issue', label: 'IT Issue (e.g., Laptop, Software Access)' },
    { value: 'hr_query', label: 'HR Query (e.g., Policy, Benefits)' },
    { value: 'payroll', label: 'Payroll Discrepancy' },
    { value: 'facility', label: 'Facility Issue (e.g., Office Maintenance)' },
    { value: 'feedback', label: 'Feedback/Suggestion' },
    { value: 'other', label: 'Other' }
];

const URGENCY_LEVELS = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
];

function RaiseConcernPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee');

  // Form state
  const [category, setCategory] = useState(CONCERN_CATEGORIES[0].value);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState(URGENCY_LEVELS[0].value);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // History state
  const [concernHistory, setConcernHistory] = useState([]); // Will be populated in the next step

  const loadConcernHistory = () => {
    const storedConcerns = localStorage.getItem('raisedConcerns');
    if (storedConcerns) {
      try {
        const parsedConcerns = JSON.parse(storedConcerns);
        // Sort by submissionTimestamp descending
        parsedConcerns.sort((a,b) => new Date(b.submissionTimestamp) - new Date(a.submissionTimestamp));
        setConcernHistory(parsedConcerns); // Used in next step for display
      } catch (e) {
        console.error("Failed to parse raised concerns:", e);
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
    speakText("Raise a Concern or Ticket");
    loadConcernHistory(); // Load history on mount for the next step
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

  const handleSubmitConcern = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Submission logic
    if (!category || !subject.trim() || !description.trim() || !urgency) {
        setError('Category, Subject, Description, and Urgency are required.');
        return;
    }

    const ticketId = `TKT${Date.now().toString().slice(-6)}`;
    const concernData = {
        id: ticketId,
        category,
        categoryLabel: CONCERN_CATEGORIES.find(cat => cat.value === category)?.label,
        subject: subject.trim(),
        description: description.trim(),
        urgency,
        urgencyLabel: URGENCY_LEVELS.find(lvl => lvl.value === urgency)?.label,
        submittedBy: userName,
        submissionTimestamp: new Date().toISOString(),
        status: 'Open', // Default status
    };

    // Simulate routing/notification
    let routeToDepartment = "Support Team";
    if (category === 'hr_query') routeToDepartment = "HR Department";
    else if (category === 'payroll') routeToDepartment = "Payroll Department";
    else if (category === 'it_issue') routeToDepartment = "IT Department";
    else if (category === 'facility') routeToDepartment = "Admin/Facility Team";

    console.log(`--- New Concern/Ticket Raised ---
Ticket ID: ${ticketId}
Submitted By: ${userName} (${localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser')).email : 'user@example.com'})
Timestamp: ${new Date(concernData.submissionTimestamp).toLocaleString()}
Category: ${concernData.categoryLabel}
Urgency: ${concernData.urgencyLabel}
Subject: ${concernData.subject}
Description: ${concernData.description}
--- Routed to: ${routeToDepartment} ---`);

    // Store in localStorage
    const currentConcerns = JSON.parse(localStorage.getItem('raisedConcerns') || '[]');
    const updatedConcerns = [concernData, ...currentConcerns];
    // Sort by submissionTimestamp descending
    updatedConcerns.sort((a,b) => new Date(b.submissionTimestamp) - new Date(a.submissionTimestamp));

    localStorage.setItem('raisedConcerns', JSON.stringify(updatedConcerns));
    setConcernHistory(updatedConcerns); // Update state for immediate display in history (next step)

    setSuccess(`Concern submitted successfully. Your Ticket ID is ${ticketId}.`);
    // Clear form fields
    setCategory(CONCERN_CATEGORIES[0].value);
    setSubject('');
    setDescription('');
    setUrgency(URGENCY_LEVELS[0].value);
  };

  return (
    <div className="dashboard-container raise-concern-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>{userName}'s Help Desk - Raise a Concern</p>
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

        <div className="concern-form-section dashboard-card">
          <h3>Submit a New Concern / Ticket</h3>
          <form onSubmit={handleSubmitConcern} className="concern-form">
            {error && <p className="form-message error-message">{error}</p>}
            {success && <p className="form-message success-message">{success}</p>}

            <div className="form-group">
              <label htmlFor="category">Concern Category:</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
                {CONCERN_CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject:</label>
              <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="description">Detailed Description:</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="6" required />
            </div>

            <div className="form-group">
              <label htmlFor="urgency">Urgency Level:</label>
              <select id="urgency" value={urgency} onChange={(e) => setUrgency(e.target.value)} required>
                {URGENCY_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="submit-button">Submit Concern</button>
          </form>
        </div>

        <div className="concern-history-section dashboard-card">
          <h3>My Submitted Concerns / Tickets</h3>
          {concernHistory.length > 0 ? (
            <div className="table-responsive-wrapper">
              <table className="concern-history-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Submitted On</th>
                    <th>Category</th>
                    <th>Subject</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    {/* Add Action/View Details column if needed */}
                  </tr>
                </thead>
                <tbody>
                  {concernHistory.map(concern => (
                    <tr key={concern.id}>
                      <td>{concern.id}</td>
                      <td>{new Date(concern.submissionTimestamp).toLocaleDateString()} {new Date(concern.submissionTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td>{concern.categoryLabel || concern.category}</td>
                      <td className="subject-cell" title={concern.subject}>{concern.subject}</td>
                      <td>
                        <span className={`urgency-label urgency-${concern.urgency}`}>
                            {concern.urgencyLabel || concern.urgency}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge status-${concern.status?.toLowerCase()}`}>
                            {concern.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No concerns submitted yet.</p>
          )}
        </div>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default RaiseConcernPage;

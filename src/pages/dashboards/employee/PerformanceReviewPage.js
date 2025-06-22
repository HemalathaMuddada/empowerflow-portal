import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import './PerformanceReviewPage.css';

// Dummy data for Performance Review
const DUMMY_PERFORMANCE_DATA = {
  currentPeriod: 'H1 2024 (Jan 2024 - Jun 2024)',
  status: 'Completed', // Other statuses: 'Upcoming', 'In Progress', 'Awaiting Manager Review', 'Awaiting Employee Acknowledgement'
  keyResultAreas: [
    { id: 'kra1', title: 'Project Delivery Excellence', rating: 'Exceeds Expectations (4/5)', managerComments: 'Consistently delivered high-quality work ahead of schedule. Showed great initiative.', employeeComments: 'Focused on proactive communication and robust testing.' },
    { id: 'kra2', title: 'Team Collaboration & Support', rating: 'Meets Expectations (3/5)', managerComments: 'Good team player, actively participates in discussions.', employeeComments: 'Enjoyed collaborating with the team on various initiatives.' },
    { id: 'kra3', title: 'Skill Development & Learning', rating: 'Needs Improvement (2/5)', managerComments: 'Needs to allocate more dedicated time for upskilling in new technologies as per goals.', employeeComments: 'Will prioritize learning goals in the next cycle.' },
  ],
  overallRating: 'Meets Expectations (3.0/5.0)',
  overallManagerComments: 'Solid performance this cycle. Focus on skill development for future growth.',
  overallEmployeeAcknowledgement: 'I acknowledge the review and will work on the feedback provided.',
  importantDates: {
    selfAssessmentDue: '2024-06-15',
    managerReviewComplete: '2024-06-30',
    reviewDiscussion: '2024-07-05',
    cycleClose: '2024-07-10'
  },
  nextReviewPeriod: 'H2 2024 (Jul 2024 - Dec 2024)',
  nextReviewStatus: 'Upcoming - Goal Setting in Progress'
};

function PerformanceReviewPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee');
  const [performanceData, setPerformanceData] = useState(DUMMY_PERFORMANCE_DATA);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || 'Employee');
      } catch (e) { console.error(e); }
    }
    speakText("My Performance Review");
  }, []);

  const handleLogout = () => {
    speakLogoutMessage(userName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="dashboard-container performance-review-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>{userName}'s Performance Review</p>
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

        <h2>Performance Review - {performanceData.currentPeriod}</h2>

        <div className="review-section dashboard-card">
          <h3>Overall Status: <span className={`status-highlight status-${performanceData.status.toLowerCase().replace(/\s+/g, '-')}`}>{performanceData.status}</span></h3>
        </div>

        <div className="review-section dashboard-card">
          <h3>Key Result Areas (KRAs) / Goals</h3>
          {performanceData.keyResultAreas.map(kra => (
            <div key={kra.id} className="kra-item">
              <h4>{kra.title}</h4>
              <p><strong>Rating:</strong> {kra.rating}</p>
              <p><strong>Manager's Comments:</strong> {kra.managerComments}</p>
              <p><strong>Employee's Comments:</strong> {kra.employeeComments || 'N/A'}</p>
            </div>
          ))}
        </div>

        <div className="review-section dashboard-card">
          <h3>Overall Assessment</h3>
          <p><strong>Overall Rating:</strong> {performanceData.overallRating}</p>
          <p><strong>Overall Manager's Comments:</strong> {performanceData.overallManagerComments}</p>
          <p><strong>Employee Acknowledgement:</strong> {performanceData.overallEmployeeAcknowledgement || 'Pending Acknowledgement'}</p>
        </div>

        <div className="review-section dashboard-card">
          <h3>Important Dates for Current Cycle</h3>
          <ul>
            <li>Self-Assessment Due: {new Date(performanceData.importantDates.selfAssessmentDue).toLocaleDateString()}</li>
            <li>Manager Review Complete by: {new Date(performanceData.importantDates.managerReviewComplete).toLocaleDateString()}</li>
            <li>Review Discussion by: {new Date(performanceData.importantDates.reviewDiscussion).toLocaleDateString()}</li>
            <li>Cycle Officially Closed: {new Date(performanceData.importantDates.cycleClose).toLocaleDateString()}</li>
          </ul>
        </div>

        <div className="review-section dashboard-card">
            <h3>Next Review Cycle</h3>
            <p><strong>Period:</strong> {performanceData.nextReviewPeriod}</p>
            <p><strong>Status:</strong> {performanceData.nextReviewStatus}</p>
        </div>

      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PerformanceReviewPage;

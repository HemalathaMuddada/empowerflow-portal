import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import { DUMMY_TEAM_MEMBERS } from '../../../utils/constants';
import './TeamCompensationPage.css';

function TeamCompensationPage() {
  const navigate = useNavigate();
  const [leadName, setLeadName] = useState('Lead');
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setLeadName(userData.name || 'Lead');
      } catch (e) { console.error(e); }
    }
    setTeamMembers(DUMMY_TEAM_MEMBERS); // Assuming DUMMY_TEAM_MEMBERS are the lead's direct reports
    speakText("Team Compensation Overview");
  }, []);

  const handleLogout = () => {
    speakLogoutMessage(leadName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="dashboard-container team-compensation-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>Team Compensation & Review Overview</p>
          </div>
          <div className="header-actions">
            <ThemeSwitcher />
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        <div style={{ marginBottom: '20px' }}>
            <Link to="/dashboard/lead" className="action-button" style={{backgroundColor: 'var(--secondary-accent-color)'}}>
                &larr; Back to Lead Dashboard
            </Link>
        </div>

        <h2>Team Compensation Details</h2>

        {teamMembers.length > 0 ? (
          <div className="team-comp-list">
            {teamMembers.map(member => (
              <div key={member.id} className="dashboard-card team-member-comp-card">
                <h3>{member.name} <span className="member-role">({member.role})</span></h3>
                {member.compensation ? (
                  <>
                    <p><strong>Current Gross Salary:</strong> ${member.compensation.currentGross.toLocaleString()}</p>
                    <p><strong>Last Hike Date:</strong> {formatDate(member.compensation.lastHikeDate)}</p>
                    <p><strong>Last Hike Percentage:</strong> {member.compensation.lastHikePercentage}</p>
                    <p><strong>Next Scheduled Review:</strong> {formatDate(member.compensation.nextReviewDate)}</p>
                  </>
                ) : (
                  <p>Compensation details not available.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No team member data available to display.</p>
        )}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default TeamCompensationPage;

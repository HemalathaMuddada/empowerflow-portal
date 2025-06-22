import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import { DUMMY_PAYSLIPS } from '../../../utils/constants'; // To get latest salary info
import './HikeInfoPage.css';

function HikeInfoPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee');
  const [latestSalary, setLatestSalary] = useState(null);

  // Dummy static data for hike info
  const hikeDetails = {
    effectiveDate: '2024-04-01',
    percentage: '10%',
    previousGross: 5500, // Example
    revisedGross: 6050,  // Example (5500 * 1.10)
    nextReviewCycle: 'Q1 2025 (Scheduled: April 2025)',
    notes: 'Your performance and contributions are valued. Congratulations on your recent salary revision.'
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    let currentUserName = 'Employee';
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        currentUserName = userData.name || 'Employee';
        setUserName(currentUserName);
      } catch (e) { console.error(e); }
    }

    // Attempt to get latest salary from payslips
    if (DUMMY_PAYSLIPS && DUMMY_PAYSLIPS.length > 0) {
      const sortedPayslips = [...DUMMY_PAYSLIPS].sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
      });
      setLatestSalary({
        gross: sortedPayslips[0].grossSalary,
        net: sortedPayslips[0].netSalary,
        month: sortedPayslips[0].month,
        year: sortedPayslips[0].year
      });
    }

    speakText(`${currentUserName}'s Compensation and Hike Information`);
  }, []);

  const handleLogout = () => {
    speakLogoutMessage(userName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="dashboard-container hike-info-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>My Compensation Information</p>
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

        <h2>Compensation Overview</h2>

        <div className="info-section dashboard-card">
          <h3>Current Compensation Summary</h3>
          {latestSalary ? (
            <>
              <p><strong>Latest Payslip Month:</strong> {latestSalary.month}, {latestSalary.year}</p>
              <p><strong>Gross Salary:</strong> ${latestSalary.gross.toFixed(2)}</p>
              <p><strong>Net Salary (Take Home):</strong> ${latestSalary.net.toFixed(2)}</p>
              <p><small><em>This is based on your last generated payslip. For a detailed breakdown, please visit the Payslips section.</em></small></p>
            </>
          ) : (
            <p>Current salary information is not available at the moment.</p>
          )}
        </div>

        <div className="info-section dashboard-card">
          <h3>Latest Hike Details</h3>
          <p><strong>Effective Date:</strong> {new Date(hikeDetails.effectiveDate).toLocaleDateString()}</p>
          <p><strong>Hike Percentage:</strong> {hikeDetails.percentage}</p>
          <p><strong>Previous Gross Salary (Indicative):</strong> ${hikeDetails.previousGross.toFixed(2)}</p>
          <p><strong>Revised Gross Salary (Indicative):</strong> ${hikeDetails.revisedGross.toFixed(2)}</p>
          {hikeDetails.notes && <p className="hike-notes"><em>Note: {hikeDetails.notes}</em></p>}
        </div>

        <div className="info-section dashboard-card">
          <h3>Next Review Cycle</h3>
          <p>{hikeDetails.nextReviewCycle}</p>
          <p><small><em>Specific dates and details will be communicated by your manager or HR.</em></small></p>
        </div>

      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HikeInfoPage;

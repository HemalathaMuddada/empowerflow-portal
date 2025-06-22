import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import { DUMMY_PAYSLIPS } from '../../../utils/constants';
import './PayslipListPage.css';

const simulateDownload = (payslip) => {
  // Construct payslip content
  let content = `****************************************\n`;
  content += `        EmpowerFlow Payslip\n`;
  content += `****************************************\n\n`;
  content += `Month: ${payslip.month}, ${payslip.year}\n`;
  content += `Employee ID: EMP001 (Demo)\n`; // Assuming a generic ID for demo
  content += `Employee Name: ${localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser')).name : 'Valued Employee'}\n`;
  content += `----------------------------------------\n`;
  content += `Earnings:\n`;
  content += `  Basic Salary:       $${payslip.details.basic.toFixed(2)}\n`;
  content += `  HRA:                $${payslip.details.hra.toFixed(2)}\n`;
  content += `  Special Allowance:  $${payslip.details.specialAllowance.toFixed(2)}\n`;
  content += `----------------------------------------\n`;
  content += `  Gross Salary:       $${payslip.grossSalary.toFixed(2)}\n`;
  content += `----------------------------------------\n`;
  content += `Deductions:\n`;
  content += `  Provident Fund:     $${payslip.details.providentFund.toFixed(2)}\n`;
  content += `  Professional Tax:   $${payslip.details.professionalTax.toFixed(2)}\n`;
  content += `  Income Tax (TDS):   $${payslip.details.incomeTax.toFixed(2)}\n`;
  content += `----------------------------------------\n`;
  content += `  Total Deductions:   $${payslip.totalDeductions.toFixed(2)}\n`;
  content += `----------------------------------------\n`;
  content += `NET SALARY:           $${payslip.netSalary.toFixed(2)}\n`;
  content += `----------------------------------------\n\n`;
  content += `This is a system-generated payslip. For any queries, please contact HR.\n`;
  content += `EmpowerFlow Inc.\n`;

  // Create a blob from the content
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  // Create a link element
  const link = document.createElement('a');
  // Set the download attribute with a filename
  link.download = payslip.fileName || `Payslip_${payslip.month}_${payslip.year}.txt`;
  // Create a URL for the blob and set it as the href of the link
  link.href = URL.createObjectURL(blob);
  // Append the link to the body
  document.body.appendChild(link);
  // Programmatically click the link to trigger the download
  link.click();
  // Remove the link from the body
  document.body.removeChild(link);
  // Revoke the blob URL to free up resources
  URL.revokeObjectURL(link.href);

  speakText(`Downloading payslip for ${payslip.month}, ${payslip.year}.`);
};

function PayslipListPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee');
  const [payslips, setPayslips] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || 'Employee');
      } catch (e) { console.error(e); }
    }
    // Sort payslips by year then month, descending (most recent first)
    const sortedPayslips = [...DUMMY_PAYSLIPS].sort((a, b) => {
        if (b.year !== a.year) {
            return b.year - a.year;
        }
        // Assuming month names can be converted to month numbers for sorting
        // This is a simple sort, a robust solution would map month names to numbers
        const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
    });
    setPayslips(sortedPayslips);
    speakText("Payslip List");
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

  return (
    <div className="dashboard-container payslip-list-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>{userName}'s Payslips</p>
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

        <h2>My Payslips</h2>
        {payslips.length > 0 ? (
          <ul className="payslip-list">
            {payslips.map(payslip => (
              <li key={payslip.id} className="payslip-item">
                <span className="payslip-info">
                  Payslip for {payslip.month}, {payslip.year}
                </span>
                <button
                  onClick={() => simulateDownload(payslip)}
                  className="download-button">
                  Download
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No payslips available at the moment.</p>
        )}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default PayslipListPage;

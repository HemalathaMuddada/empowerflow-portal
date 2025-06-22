import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DUMMY_PAYSLIPS } from '../../utils/constants';
import { speakText } from '../../utils/speech'; // For download confirmation

// Duplicating simulateDownload for now. Ideally, this would be a shared utility.
const simulateDownload = (payslip) => {
  let content = `****************************************\n`;
  content += `        EmpowerFlow Payslip\n`;
  content += `****************************************\n\n`;
  content += `Month: ${payslip.month}, ${payslip.year}\n`;
  content += `Employee ID: EMP001 (Demo)\n`;
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

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.download = payslip.fileName || `Payslip_${payslip.month}_${payslip.year}.txt`;
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
  speakText(`Downloading payslip for ${payslip.month}, ${payslip.year}.`);
};


const RecentPayslips = ({ maxItems = 2 }) => {
  const [recentPayslips, setRecentPayslips] = useState([]);

  useEffect(() => {
    // Sort payslips to get the most recent ones
    const sortedPayslips = [...DUMMY_PAYSLIPS].sort((a, b) => {
        if (b.year !== a.year) {
            return b.year - a.year;
        }
        const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
    });
    setRecentPayslips(sortedPayslips.slice(0, maxItems));
  }, [maxItems]);

  return (
    <div className="dashboard-card recent-payslips-card">
      <h3>Recent Payslips</h3>
      {recentPayslips.length > 0 ? (
        <ul>
          {recentPayslips.map(payslip => (
            <li key={payslip.id}>
              {payslip.month} {payslip.year} -
              <button
                onClick={() => simulateDownload(payslip)}
                className="inline-download-button">
                Download
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent payslips available.</p>
      )}
      <Link to="/dashboard/employee/payslips" className="card-link">View All Payslips</Link>
    </div>
  );
};

export default RecentPayslips;

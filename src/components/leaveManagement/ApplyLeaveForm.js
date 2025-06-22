import React, { useState, useEffect } from 'react';
import { LEAVE_TYPES, INITIAL_LEAVE_BALANCES } from '../../utils/constants';
import './ApplyLeaveForm.css'; // We'll create this CSS file

function ApplyLeaveForm() {
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0]?.value || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentBalances, setCurrentBalances] = useState({});

  useEffect(() => {
    // Load current balances from localStorage or use initial ones
    const storedBalances = localStorage.getItem('leaveBalances');
    if (storedBalances) {
      setCurrentBalances(JSON.parse(storedBalances));
    } else {
      setCurrentBalances(INITIAL_LEAVE_BALANCES);
      localStorage.setItem('leaveBalances', JSON.stringify(INITIAL_LEAVE_BALANCES));
    }
  }, []);

  const calculateLeaveDays = (start, end) => {
    const date1 = new Date(start);
    const date2 = new Date(end);
    if (isNaN(date1) || isNaN(date2) || date2 < date1) return 0;

    // Basic calculation: includes weekends and holidays for simplicity.
    // A real app would need a more complex date calculation library.
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day
    return diffDays;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!leaveType || !startDate || !endDate || !reason) {
      setError('All fields are required.');
      return;
    }

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    if (eDate < sDate) {
      setError('End date cannot be before start date.');
      return;
    }

    const today = new Date();
    today.setHours(0,0,0,0); // Normalize today's date
    if (sDate < today) {
        setError('Start date cannot be in the past.');
        return;
    }

    const daysApplied = calculateLeaveDays(startDate, endDate);
    if (daysApplied <= 0) {
        setError('Invalid date range selected.');
        return;
    }

    const availableBalance = currentBalances[leaveType] || 0;
    if (daysApplied > availableBalance) {
      setError(`Insufficient ${LEAVE_TYPES.find(lt => lt.value === leaveType)?.label || 'leave'} balance. Available: ${availableBalance} days.`);
      return;
    }

    // Save to localStorage
    const appliedLeaves = JSON.parse(localStorage.getItem('appliedLeaves') || '[]');
    const newLeaveApplication = {
      id: Date.now(), // Simple unique ID
      leaveType,
      leaveLabel: LEAVE_TYPES.find(lt => lt.value === leaveType)?.label,
      startDate,
      endDate,
      reason,
      days: daysApplied,
      status: 'Pending', // Default status
      appliedDate: new Date().toISOString(),
    };
    appliedLeaves.push(newLeaveApplication);
    localStorage.setItem('appliedLeaves', JSON.stringify(appliedLeaves));

    // Update balances
    const updatedBalances = { ...currentBalances, [leaveType]: availableBalance - daysApplied };
    localStorage.setItem('leaveBalances', JSON.stringify(updatedBalances));
    setCurrentBalances(updatedBalances); // Update state to reflect change immediately

    setSuccess(`Leave applied successfully for ${daysApplied} day(s). Your ${LEAVE_TYPES.find(lt => lt.value === leaveType)?.label} balance is now ${updatedBalances[leaveType]}.`);
    // Reset form
    setLeaveType(LEAVE_TYPES[0]?.value || '');
    setStartDate('');
    setEndDate('');
    setReason('');

    // Optionally, trigger a refresh of history/balance components if they are visible
    // This can be done via a shared state/context or event emitter in a more complex app.
  };

  return (
    <div className="apply-leave-form-container tab-content">
      <h3>Apply for Leave</h3>
      <form onSubmit={handleSubmit} className="leave-form">
        {error && <p className="form-message error-message">{error}</p>}
        {success && <p className="form-message success-message">{success}</p>}

        <div className="form-group">
          <label htmlFor="leaveType">Leave Type:</label>
          <select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
            {LEAVE_TYPES.map(lt => (
              <option key={lt.value} value={lt.value}>{lt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason:</label>
          <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows="4" required />
        </div>

        <div className="form-group">
            <p>Selected leave duration: <strong>{calculateLeaveDays(startDate, endDate)}</strong> day(s)</p>
            {leaveType && <p>Available {LEAVE_TYPES.find(lt => lt.value === leaveType)?.label || ''} balance: <strong>{currentBalances[leaveType] || 0}</strong> day(s)</p>}
        </div>

        <button type="submit" className="submit-button">Apply for Leave</button>
      </form>
    </div>
  );
}

export default ApplyLeaveForm;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_LEAVE_BALANCES, LEAVE_TYPES } from '../../utils/constants';
// import './LeaveBalances.css'; // If specific styles are needed

const LeaveBalances = () => {
  const [balances, setBalances] = useState(INITIAL_LEAVE_BALANCES);

  useEffect(() => {
    // Attempt to load balances from localStorage to reflect any updates
    const storedBalances = localStorage.getItem('leaveBalances');
    if (storedBalances) {
      try {
        setBalances(JSON.parse(storedBalances));
      } catch (e) {
        console.error("Failed to parse leave balances from localStorage", e);
        // Fallback to initial if parsing fails
        setBalances(INITIAL_LEAVE_BALANCES);
        localStorage.setItem('leaveBalances', JSON.stringify(INITIAL_LEAVE_BALANCES));
      }
    } else {
      // Initialize localStorage if nothing is stored
      localStorage.setItem('leaveBalances', JSON.stringify(INITIAL_LEAVE_BALANCES));
      setBalances(INITIAL_LEAVE_BALANCES);
    }
  }, []); // Empty dependency array: runs once on mount

  // Find label for a leave type value
  const getLeaveLabel = (value) => {
    const type = LEAVE_TYPES.find(lt => lt.value === value);
    return type ? type.label : value.charAt(0).toUpperCase() + value.slice(1); // Fallback to capitalized value
  };

  return (
    <div className="dashboard-card leave-balances-card">
      <h3>Leave Balances</h3>
      {Object.keys(balances).length > 0 ? (
        <ul>
          {Object.entries(balances).map(([type, balance]) => (
            <li key={type}>
              <strong>{getLeaveLabel(type)}:</strong> {balance} days
            </li>
          ))}
        </ul>
      ) : (
        <p>Leave balances are currently unavailable.</p>
      )}
      <Link to="/dashboard/employee/leave" className="card-link">Apply for Leave / View Details</Link>
    </div>
  );
};

export default LeaveBalances;

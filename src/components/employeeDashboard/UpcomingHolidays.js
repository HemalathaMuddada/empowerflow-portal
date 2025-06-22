import React from 'react';
import { Link } from 'react-router-dom';
import { HOLIDAY_LIST } from '../../utils/constants';
// import './UpcomingHolidays.css'; // If specific styles are needed beyond .dashboard-card

const UpcomingHolidays = ({ maxHolidays = 3 }) => {
  const today = new Date();
  // Filter for upcoming holidays and sort them
  const upcoming = HOLIDAY_LIST
    .map(holiday => ({ ...holiday, dateObj: new Date(holiday.date) }))
    .filter(holiday => holiday.dateObj >= today)
    .sort((a, b) => a.dateObj - b.dateObj)
    .slice(0, maxHolidays);

  const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  return (
    <div className="dashboard-card upcoming-holidays-card">
      <h3>Upcoming Holidays</h3>
      {upcoming.length > 0 ? (
        <ul>
          {upcoming.map(holiday => (
            <li key={holiday.name}>
              <strong>{formatDate(holiday.dateObj)}:</strong> {holiday.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming holidays in the near future.</p>
      )}
      <Link to="/dashboard/employee/holidays" className="card-link">View All Holidays</Link>
    </div>
  );
};

export default UpcomingHolidays;

import React from 'react';
import { Link } from 'react-router-dom';

// Using the same dummy status as in PerformanceReviewPage for consistency on the card
const DUMMY_REVIEW_STATUS = 'Completed'; // Could be 'Upcoming', 'In Progress', etc.
const DUMMY_REVIEW_PERIOD = 'H1 2024';

const PerformanceReviewCard = () => {
  return (
    <div className="dashboard-card performance-review-card">
      <h3>Performance Review</h3>
      <p><strong>Current Period:</strong> {DUMMY_REVIEW_PERIOD}</p>
      <p><strong>Status:</strong> <span className={`status-highlight status-${DUMMY_REVIEW_STATUS.toLowerCase().replace(/\s+/g, '-')}`}>{DUMMY_REVIEW_STATUS}</span></p>
      {/*
        Future enhancements could show:
        - Next key deadline (e.g., "Self-assessment due: YYYY-MM-DD")
        - Awaiting your action (if applicable)
      */}
      <ul>
        <li>Review your goals and feedback.</li>
        <li>Plan for the next review cycle.</li>
      </ul>
      <Link to="/dashboard/employee/performance-review" className="card-link">View Details</Link>
    </div>
  );
};

export default PerformanceReviewCard;

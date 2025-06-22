import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OpenConcernsWidget = () => {
  const [openConcernsCount, setOpenConcernsCount] = useState(0);

  useEffect(() => {
    const itemStr = localStorage.getItem('raisedConcerns');
    let raisedConcerns = [];
    if (itemStr && itemStr !== 'undefined') {
      try {
        raisedConcerns = JSON.parse(itemStr);
      } catch (e) {
        console.error("Failed to parse 'raisedConcerns' from localStorage:", e);
        raisedConcerns = [];
      }
    }
    setOpenConcernsCount(raisedConcerns.filter(c => c.status === 'Open' || c.status === 'Submitted').length);
  }, []);

  return (
    <div className="dashboard-card hr-widget open-concerns-widget">
      <h3>Unresolved Concerns</h3>
      <p className="metric-large">{openConcernsCount}</p>
      <p className="metric-label">Open Tickets/Concerns</p>
      <p className="metric-small">Require attention or resolution.</p>
      {/* Link to a future Concern Management page for HR */}
      <Link to="#" onClick={(e) => e.preventDefault()} className="card-link disabled-link">Manage Concerns (Coming Soon)</Link>
    </div>
  );
};

export default OpenConcernsWidget;

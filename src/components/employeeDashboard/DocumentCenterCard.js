import React from 'react';
import { Link } from 'react-router-dom';

const DocumentCenterCard = () => {
  return (
    <div className="dashboard-card">
      <h3>Document Center</h3>
      <p>Access company policies, guides, forms, and important announcements.</p>
      {/* Could show a count of new documents or recent additions if data was dynamic */}
      <ul>
        <li>Employee Handbook</li>
        <li>IT Security Guidelines</li>
        {/* Add more example document titles or a count */}
      </ul>
      <Link to="/dashboard/employee/documents" className="card-link">Go to Document Center</Link>
    </div>
  );
};

export default DocumentCenterCard;

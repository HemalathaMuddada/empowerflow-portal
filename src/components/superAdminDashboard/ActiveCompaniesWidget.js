import React from 'react';

const ActiveCompaniesWidget = () => {
  // In the future, this would fetch and display actual data
  const dummyActiveCompanies = 5; // Example data
  const dummyInactiveCompanies = 1;

  return (
    <div className="dashboard-card superadmin-widget">
      <h4>Company Stats</h4>
      <div>
        <p><strong>Active Companies:</strong> {dummyActiveCompanies}</p>
        <p><strong>Inactive Companies:</strong> {dummyInactiveCompanies}</p>
      </div>
      <p style={{ fontStyle: 'italic', color: '#888', fontSize: '0.9em' }}>(Summary data, details in Company Management)</p>
    </div>
  );
};

export default ActiveCompaniesWidget;

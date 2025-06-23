import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import './ViewDeclarationsPage.css';

const ITDeclarationsViewSection = () => {
  const [itDeclarations, setItDeclarations] = useState([]);
  const [message, setMessage] = useState('');
  const [filterEmployee, setFilterEmployee] = useState(''); // For filtering by employee name/ID

  useEffect(() => {
    loadITDeclarations();
  }, []);

  const loadITDeclarations = () => {
    const itemStr = localStorage.getItem('itDeclarations');
    let declarations = [];
    if (itemStr && itemStr !== 'undefined') {
      try {
        declarations = JSON.parse(itemStr);
        declarations.sort((a,b) => new Date(b.submissionDate) - new Date(a.submissionDate));
      } catch (e) {
        console.error("Failed to parse 'itDeclarations' from localStorage:", e);
      }
    }
    setItDeclarations(declarations);
  };

  const handleAction = (declarationId, newStatus, employeeName) => {
    setMessage('');
    let allDeclarations = JSON.parse(localStorage.getItem('itDeclarations') || '[]');
    const declarationIndex = allDeclarations.findIndex(dec => dec.id === declarationId);

    if (declarationIndex > -1) {
      let queryReason = '';
      if (newStatus === 'Queried') {
        queryReason = prompt(`Enter reason for querying declaration by ${employeeName} (Type: ${allDeclarations[declarationIndex].itemLabel}):`);
        if (queryReason === null) return; // User cancelled prompt
        allDeclarations[declarationIndex].queryReason = queryReason;
      }

      allDeclarations[declarationIndex].status = newStatus;
      allDeclarations[declarationIndex].actionDate = new Date().toISOString();

      localStorage.setItem('itDeclarations', JSON.stringify(allDeclarations));
      loadITDeclarations(); // Refresh list

      const successMsg = `IT Declaration for ${employeeName} (${allDeclarations[declarationIndex].itemLabel}) marked as ${newStatus}.`;
      setMessage(successMsg);
      speakText(successMsg);

      // Simulate email notification
      console.log(`--- IT Declaration Status Update ---
To: ${employeeName}
Subject: Update on your IT Declaration - ${allDeclarations[declarationIndex].itemLabel}

Dear ${employeeName},
Your IT Declaration for '${allDeclarations[declarationIndex].itemLabel}' (Amount: $${allDeclarations[declarationIndex].declaredAmount}) has been updated to: ${newStatus}.
${newStatus === 'Queried' && queryReason ? `Query: ${queryReason}` : ''}
${newStatus === 'Rejected' ? `Reason: [HR to provide reason if UI supports it]` : ''}

Regards,
HR Department, EmpowerFlow
--------------------------------`);
    } else {
      setMessage('Error: Declaration not found.');
    }
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-CA') : 'N/A';

  const filteredDeclarations = itDeclarations.filter(dec => {
    if (!filterEmployee.trim()) return true;
    const search = filterEmployee.toLowerCase();
    return dec.employeeName?.toLowerCase().includes(search) || dec.employeeId?.toLowerCase().includes(search);
  });

  return (
    <div className="declaration-view-section tab-content">
      <h4>Employee IT Declarations</h4>
      {message && <p className={`form-message ${message.includes('Error') ? 'error-message' : 'success-message'}`}>{message}</p>}

      <div className="table-filter-controls">
        <input
            type="text"
            placeholder="Filter by Employee Name/ID..."
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="filter-input"
        />
      </div>

      {filteredDeclarations.length > 0 ? (
        <div className="table-responsive-wrapper">
          <table className="declarations-hr-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Submitted</th>
                <th>Type</th>
                <th>Amount ($)</th>
                <th>Proof File</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeclarations.map(dec => (
                <tr key={dec.id}>
                  <td>{dec.employeeName}<br/><small>({dec.employeeId})</small></td>
                  <td>{formatDate(dec.submissionDate)}</td>
                  <td>{dec.itemLabel}</td>
                  <td>{dec.declaredAmount}</td>
                  <td>{dec.proofFileName || 'N/A'}</td>
                  <td><span className={`status-badge status-${dec.status.toLowerCase()}`}>{dec.status}</span></td>
                  <td className="actions-cell">
                    <button onClick={() => handleAction(dec.id, 'Approved', dec.employeeName)} className="action-btn approve-btn" title="Approve">✔</button>
                    <button onClick={() => handleAction(dec.id, 'Rejected', dec.employeeName)} className="action-btn reject-btn" title="Reject">✖</button>
                    <button onClick={() => handleAction(dec.id, 'Queried', dec.employeeName)} className="action-btn query-btn" title="Query">?</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No IT declarations found{filterEmployee.trim() ? ' for the current filter' : ''}.</p>
      )}
    </div>
  );
};

const FBPDeclarationsViewSection = () => {
  const [fbpDeclarations, setFbpDeclarations] = useState([]);
  const [message, setMessage] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');

  useEffect(() => {
    loadFBPDeclarations();
  }, []);

  const loadFBPDeclarations = () => {
    const itemStr = localStorage.getItem('fbpDeclarations');
    let declarations = [];
    if (itemStr && itemStr !== 'undefined') {
      try {
        declarations = JSON.parse(itemStr);
        declarations.sort((a,b) => new Date(b.submissionDate) - new Date(a.submissionDate));
      } catch (e) {
        console.error("Failed to parse 'fbpDeclarations' from localStorage:", e);
      }
    }
    setFbpDeclarations(declarations);
  };

  const handleAction = (declarationId, newStatus, employeeName) => {
    setMessage('');
    let allDeclarations = JSON.parse(localStorage.getItem('fbpDeclarations') || '[]');
    const declarationIndex = allDeclarations.findIndex(dec => dec.id === declarationId);

    if (declarationIndex > -1) {
      let queryReason = '';
      if (newStatus === 'Queried') {
        queryReason = prompt(`Enter reason for querying FBP declaration by ${employeeName} (Component: ${allDeclarations[declarationIndex].componentLabel}):`);
        if (queryReason === null) return;
        allDeclarations[declarationIndex].queryReason = queryReason;
      }

      allDeclarations[declarationIndex].status = newStatus;
      allDeclarations[declarationIndex].actionDate = new Date().toISOString();

      localStorage.setItem('fbpDeclarations', JSON.stringify(allDeclarations));
      loadFBPDeclarations();

      const successMsg = `FBP Declaration for ${employeeName} (${allDeclarations[declarationIndex].componentLabel}) marked as ${newStatus}.`;
      setMessage(successMsg);
      speakText(successMsg);

      // Simulate email notification
      console.log(`--- FBP Declaration Status Update ---
To: ${employeeName}
Subject: Update on your FBP Declaration - ${allDeclarations[declarationIndex].componentLabel}

Dear ${employeeName},
Your FBP Declaration for '${allDeclarations[declarationIndex].componentLabel}' (Amount: $${allDeclarations[declarationIndex].declaredAmount}) has been updated to: ${newStatus}.
${newStatus === 'Queried' && queryReason ? `Query: ${queryReason}` : ''}
${newStatus === 'Rejected' ? `Reason: [HR to provide reason if UI supports it]` : ''}

Regards,
HR Department, EmpowerFlow
--------------------------------`);
    } else {
      setMessage('Error: FBP Declaration not found.');
    }
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-CA') : 'N/A';

  const filteredDeclarations = fbpDeclarations.filter(dec => {
    if (!filterEmployee.trim()) return true;
    const search = filterEmployee.toLowerCase();
    return dec.employeeName?.toLowerCase().includes(search) || dec.employeeId?.toLowerCase().includes(search);
  });

  return (
    <div className="declaration-view-section tab-content">
      <h4>Employee FBP Declarations</h4>
      {message && <p className={`form-message ${message.includes('Error') ? 'error-message' : 'success-message'}`}>{message}</p>}

      <div className="table-filter-controls">
        <input
            type="text"
            placeholder="Filter by Employee Name/ID..."
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="filter-input"
        />
      </div>

      {filteredDeclarations.length > 0 ? (
        <div className="table-responsive-wrapper">
          <table className="declarations-hr-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Submitted</th>
                <th>Component</th>
                <th>Amount ($)</th>
                <th>Proof File</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeclarations.map(dec => (
                <tr key={dec.id}>
                  <td>{dec.employeeName}<br/><small>({dec.employeeId})</small></td>
                  <td>{formatDate(dec.submissionDate)}</td>
                  <td>{dec.componentLabel}</td>
                  <td>{dec.declaredAmount}</td>
                  <td>{dec.proofFileName || 'N/A'}</td>
                  <td><span className={`status-badge status-${dec.status.toLowerCase()}`}>{dec.status}</span></td>
                  <td className="actions-cell">
                    <button onClick={() => handleAction(dec.id, 'Approved', dec.employeeName)} className="action-btn approve-btn" title="Approve">✔</button>
                    <button onClick={() => handleAction(dec.id, 'Rejected', dec.employeeName)} className="action-btn reject-btn" title="Reject">✖</button>
                    <button onClick={() => handleAction(dec.id, 'Queried', dec.employeeName)} className="action-btn query-btn" title="Query">?</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No FBP declarations found{filterEmployee.trim() ? ' for the current filter' : ''}.</p>
      )}
    </div>
  );
};


function ViewDeclarationsPage() {
  const navigate = useNavigate();
  const [hrUserName, setHrUserName] = useState('HR Admin');
  const [activeTab, setActiveTab] = useState('it'); // 'it' or 'fbp'

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setHrUserName(userData.name || 'HR Admin');
      } catch (e) { console.error(e); }
    }
    speakText("View Employee Declarations");
  }, []);

  const handleLogout = () => {
    speakLogoutMessage(hrUserName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'it':
        return <ITDeclarationsViewSection />;
      case 'fbp':
        return <FBPDeclarationsViewSection />;
      default:
        return <ITDeclarationsViewSection />;
    }
  };

  return (
    <div className="dashboard-container view-declarations-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title"><h1>EmpowerFlow</h1><p>Oversee Employee Declarations</p></div>
          <div className="header-actions"><ThemeSwitcher /><button onClick={handleLogout} className="logout-button">Logout</button></div>
        </div>
      </header>
      <main className="dashboard-content">
        <div style={{ marginBottom: '20px' }}>
            <Link to="/dashboard/hr" className="action-button secondary-action-button">&larr; Back to HR Dashboard</Link>
        </div>

        <h2>Employee Declarations Portal</h2>

        <nav className="declarations-view-tabs">
          <button
            className={`declarations-view-tab-button ${activeTab === 'it' ? 'active' : ''}`}
            onClick={() => setActiveTab('it')}>
            IT Declarations
          </button>
          <button
            className={`declarations-view-tab-button ${activeTab === 'fbp' ? 'active' : ''}`}
            onClick={() => setActiveTab('fbp')}>
            FBP Declarations
          </button>
        </nav>

        <div className="declarations-view-content-container dashboard-card">
          {renderTabContent()}
        </div>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ViewDeclarationsPage;

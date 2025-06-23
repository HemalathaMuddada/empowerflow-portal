import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import './DeclarationsPage.css';

// Constants for IT Declaration
const IT_DECLARATION_TYPES = [
    { value: '80c_lic', label: '80C - LIC Premium' },
    { value: '80c_ppf', label: '80C - PPF Contribution' },
    { value: '80c_elss', label: '80C - ELSS Mutual Funds' },
    { value: '80c_housing_loan', label: '80C - Housing Loan (Principal)' },
    { value: '80d_medical_insurance', label: '80D - Medical Insurance Premium' },
    { value: 'hra_rent', label: 'HRA - Rent Paid' },
    { value: 'other', label: 'Other Tax Saving Investment' }
];

const ITDeclarationSection = ({ userName }) => { // Accept userName as prop
  const [itemType, setItemType] = useState(IT_DECLARATION_TYPES[0].value);
  const [declaredAmount, setDeclaredAmount] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submittedITDeclarations, setSubmittedITDeclarations] = useState([]);

  useEffect(() => {
    loadITDeclarations();
  }, []);

  const loadITDeclarations = () => {
    const stored = localStorage.getItem('itDeclarations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.sort((a,b) => new Date(b.submissionDate) - new Date(a.submissionDate));
        setSubmittedITDeclarations(parsed);
      } catch (e) { console.error("Failed to parse IT declarations", e); }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofFileName(e.target.files[0].name);
    } else {
      setProofFileName('');
    }
  };

  const handleSubmitIT = (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!itemType || !declaredAmount.trim()) {
      setFormError('Declaration Type and Declared Amount are required.');
      return;
    }
    if (isNaN(parseFloat(declaredAmount)) || parseFloat(declaredAmount) <= 0) {
        setFormError('Declared Amount must be a positive number.');
        return;
    }

    const loggedInUserData = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const newDeclaration = {
      id: Date.now(),
      employeeId: loggedInUserData.id || 'unknown_emp_id', // Add employeeId
      employeeName: loggedInUserData.name || userName, // Ensure employeeName is stored
      itemType,
      itemLabel: IT_DECLARATION_TYPES.find(it => it.value === itemType)?.label || itemType,
      declaredAmount: parseFloat(declaredAmount).toFixed(2),
      proofFileName: proofFileName || 'N/A',
      submissionDate: new Date().toISOString(),
      status: 'Submitted' // Basic status
    };

    const updatedDeclarations = [newDeclaration, ...submittedITDeclarations];
    updatedDeclarations.sort((a,b) => new Date(b.submissionDate) - new Date(a.submissionDate));

    localStorage.setItem('itDeclarations', JSON.stringify(updatedDeclarations));
    setSubmittedITDeclarations(updatedDeclarations);

    setFormSuccess(`IT Declaration for ${newDeclaration.itemLabel} submitted successfully.`);
    setItemType(IT_DECLARATION_TYPES[0].value);
    setDeclaredAmount('');
    setProofFileName('');
    // Clear the file input visually (though its state is tricky)
    const fileInput = document.getElementById('itProofFile');
    if (fileInput) fileInput.value = null;
  };

  return (
    <div className="declaration-section">
      <h4>Investment Declarations (IT Savings)</h4>
      <p>Submit your investment proofs for tax savings under sections like 80C, 80D, HRA etc.</p>
      <form onSubmit={handleSubmitIT} className="declaration-form-item">
        {formError && <p className="form-message error-message">{formError}</p>}
        {formSuccess && <p className="form-message success-message">{formSuccess}</p>}

        <div className="form-group">
          <label htmlFor="itItemType">Declaration Type:</label>
          <select id="itItemType" value={itemType} onChange={(e) => setItemType(e.target.value)} required>
            {IT_DECLARATION_TYPES.map(it => <option key={it.value} value={it.value}>{it.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="itDeclaredAmount">Declared Amount ($):</label>
          <input type="number" id="itDeclaredAmount" value={declaredAmount} onChange={(e) => setDeclaredAmount(e.target.value)} placeholder="e.g., 1500.00" step="0.01" required />
        </div>
        <div className="form-group">
          <label htmlFor="itProofFile">Upload Proof (Optional):</label>
          <input type="file" id="itProofFile" onChange={handleFileChange} />
          {proofFileName && <p className="file-name-display">Selected file: {proofFileName}</p>}
        </div>
        <button type="submit" className="submit-button">Submit IT Declaration</button>
      </form>

      <div className="submitted-declarations">
        <h5>My Submitted IT Declarations:</h5>
        {submittedITDeclarations.length > 0 ? (
          <div className="table-responsive-wrapper">
            <table className="declarations-history-table">
              <thead>
                <tr>
                  <th>Submitted</th>
                  <th>Type</th>
                  <th>Amount ($)</th>
                  <th>Proof File</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {submittedITDeclarations.map(dec => (
                  <tr key={dec.id}>
                    <td>{new Date(dec.submissionDate).toLocaleDateString()}</td>
                    <td>{dec.itemLabel}</td>
                    <td>{dec.declaredAmount}</td>
                    <td>{dec.proofFileName}</td>
                    <td><span className={`status-badge status-${dec.status.toLowerCase()}`}>{dec.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No IT declarations submitted yet.</p>
        )}
      </div>
    </div>
  );
};

// Constants for FBP Declaration
const FBP_COMPONENT_TYPES = [
    { value: 'lta', label: 'Leave Travel Allowance (LTA)' },
    { value: 'meal_vouchers', label: 'Meal Vouchers / Food Coupons' },
    { value: 'telephone_internet', label: 'Telephone/Internet Reimbursement' },
    { value: 'fuel_car_maintenance', label: 'Fuel/Car Maintenance' },
    { value: 'books_periodicals', label: 'Books & Periodicals Allowance' },
    { value: 'other_fbp', label: 'Other FBP Component' }
];

const FBPDeclarationSection = ({ userName }) => { // Accept userName as prop
  const [componentType, setComponentType] = useState(FBP_COMPONENT_TYPES[0].value);
  const [fbpDeclaredAmount, setFbpDeclaredAmount] = useState('');
  const [fbpProofFileName, setFbpProofFileName] = useState('');
  const [fbpFormError, setFbpFormError] = useState('');
  const [fbpFormSuccess, setFbpFormSuccess] = useState('');
  const [submittedFBPDeclarations, setSubmittedFBPDeclarations] = useState([]);

  useEffect(() => {
    loadFBPDeclarations();
  }, []);

  const loadFBPDeclarations = () => {
    const stored = localStorage.getItem('fbpDeclarations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        parsed.sort((a,b) => new Date(b.submissionDate) - new Date(a.submissionDate));
        setSubmittedFBPDeclarations(parsed);
      } catch (e) { console.error("Failed to parse FBP declarations", e); }
    }
  };

  const handleFbpFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFbpProofFileName(e.target.files[0].name);
    } else {
      setFbpProofFileName('');
    }
  };

  const handleSubmitFBP = (e) => {
    e.preventDefault();
    setFbpFormError('');
    setFbpFormSuccess('');

    if (!componentType || !fbpDeclaredAmount.trim()) {
      setFbpFormError('FBP Component and Declared Amount are required.');
      return;
    }
     if (isNaN(parseFloat(fbpDeclaredAmount)) || parseFloat(fbpDeclaredAmount) <= 0) {
        setFbpFormError('Declared Amount must be a positive number.');
        return;
    }

    const loggedInUserData = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
    const newDeclaration = {
      id: Date.now(),
      employeeId: loggedInUserData.id || 'unknown_emp_id', // Add employeeId
      employeeName: loggedInUserData.name || userName, // Ensure employeeName is stored (userName is from page state)
      componentType,
      componentLabel: FBP_COMPONENT_TYPES.find(fbp => fbp.value === componentType)?.label || componentType,
      declaredAmount: parseFloat(fbpDeclaredAmount).toFixed(2),
      proofFileName: fbpProofFileName || 'N/A',
      submissionDate: new Date().toISOString(),
      status: 'Submitted'
    };

    const updatedDeclarations = [newDeclaration, ...submittedFBPDeclarations];
    updatedDeclarations.sort((a,b) => new Date(b.submissionDate) - new Date(a.submissionDate));

    localStorage.setItem('fbpDeclarations', JSON.stringify(updatedDeclarations));
    setSubmittedFBPDeclarations(updatedDeclarations);

    setFbpFormSuccess(`FBP Declaration for ${newDeclaration.componentLabel} submitted successfully.`);
    setComponentType(FBP_COMPONENT_TYPES[0].value);
    setFbpDeclaredAmount('');
    setFbpProofFileName('');
    const fileInput = document.getElementById('fbpProofFile');
    if (fileInput) fileInput.value = null;
  };

 return (
    <div className="declaration-section">
      <h4>Flexible Benefit Plan (FBP) Declarations</h4>
      <p>Declare your choices for various components under the Flexible Benefit Plan offered by the company.</p>
      <form onSubmit={handleSubmitFBP} className="declaration-form-item">
        {fbpFormError && <p className="form-message error-message">{fbpFormError}</p>}
        {fbpFormSuccess && <p className="form-message success-message">{fbpFormSuccess}</p>}

        <div className="form-group">
          <label htmlFor="fbpComponentType">FBP Component:</label>
          <select id="fbpComponentType" value={componentType} onChange={(e) => setComponentType(e.target.value)} required>
            {FBP_COMPONENT_TYPES.map(fbp => <option key={fbp.value} value={fbp.value}>{fbp.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fbpDeclaredAmount">Declared Amount ($):</label>
          <input type="number" id="fbpDeclaredAmount" value={fbpDeclaredAmount} onChange={(e) => setFbpDeclaredAmount(e.target.value)} placeholder="e.g., 500.00" step="0.01" required />
        </div>
        <div className="form-group">
          <label htmlFor="fbpProofFile">Upload Supporting Document (Optional):</label>
          <input type="file" id="fbpProofFile" onChange={handleFbpFileChange} />
          {fbpProofFileName && <p className="file-name-display">Selected file: {fbpProofFileName}</p>}
        </div>
        <button type="submit" className="submit-button">Submit FBP Declaration</button>
      </form>

      <div className="submitted-declarations">
        <h5>My Submitted FBP Declarations:</h5>
        {submittedFBPDeclarations.length > 0 ? (
          <div className="table-responsive-wrapper">
            <table className="declarations-history-table">
              <thead>
                <tr>
                  <th>Submitted</th>
                  <th>Component</th>
                  <th>Amount ($)</th>
                  <th>Proof File</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {submittedFBPDeclarations.map(dec => (
                  <tr key={dec.id}>
                    <td>{new Date(dec.submissionDate).toLocaleDateString()}</td>
                    <td>{dec.componentLabel}</td>
                    <td>{dec.declaredAmount}</td>
                    <td>{dec.proofFileName}</td>
                    <td><span className={`status-badge status-${dec.status.toLowerCase()}`}>{dec.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No FBP declarations submitted yet.</p>
        )}
      </div>
    </div>
  );
};


function DeclarationsPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee');
  const [activeTab, setActiveTab] = useState('it'); // 'it' or 'fbp'

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || 'Employee');
      } catch (e) { console.error(e); }
    }
    speakText("Tax and Benefit Declarations");
  }, []);

  const handleLogout = () => {
    speakLogoutMessage(userName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="dashboard-container declarations-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>{userName}'s Declarations</p>
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

        <h2>My Declarations</h2>

        <nav className="declaration-tabs">
          <button
            className={`declaration-tab-button ${activeTab === 'it' ? 'active' : ''}`}
            onClick={() => setActiveTab('it')}>
            IT Declarations
          </button>
          <button
            className={`declaration-tab-button ${activeTab === 'fbp' ? 'active' : ''}`}
            onClick={() => setActiveTab('fbp')}>
            FBP Declarations
          </button>
        </nav>

        <div className="declaration-content-container dashboard-card">
          {activeTab === 'it' && <ITDeclarationSection userName={userName} />}
          {activeTab === 'fbp' && <FBPDeclarationSection userName={userName} />}
        </div>
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default DeclarationsPage;

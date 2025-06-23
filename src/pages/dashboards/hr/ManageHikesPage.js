import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import AddEditHikeModal from '../../../components/hrDashboard/AddEditHikeModal';
import { INITIAL_MASTER_EMPLOYEE_LIST } from '../../../utils/constants'; // For employee list
import './ManageHikesPage.css';

function ManageHikesPage() {
  const navigate = useNavigate();
  const [hrUserName, setHrUserName] = useState('HR Admin');
  const [hikeRecords, setHikeRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [masterEmployeeList, setMasterEmployeeList] = useState([]);

  const [isHikeModalOpen, setIsHikeModalOpen] = useState(false);
  const [editingHike, setEditingHike] = useState(null); // null for Add, hike object for Edit
  const [successMessage, setSuccessMessage] = useState('');


  const loadHikeRecords = () => {
    setIsLoading(true);
    const itemStr = localStorage.getItem('employeeHikeRecords');
    let records = [];
    if (itemStr && itemStr !== 'undefined') {
      try {
        records = JSON.parse(itemStr);
      } catch (e) {
        console.error("Failed to parse 'employeeHikeRecords' from localStorage:", e);
      }
    }
    records.sort((a, b) => new Date(b.submissionDate || b.effectiveDate) - new Date(a.submissionDate || a.effectiveDate));
    setHikeRecords(records);
    setIsLoading(false);
  };

  const loadMasterEmployees = () => {
      const storedMasterList = localStorage.getItem('masterEmployeeList');
      if (storedMasterList && storedMasterList !== 'undefined') {
          try {
              setMasterEmployeeList(JSON.parse(storedMasterList));
          } catch(e) {
              console.error("Error parsing masterEmployeeList for ManageHikesPage", e);
              setMasterEmployeeList(INITIAL_MASTER_EMPLOYEE_LIST); // Fallback
          }
      } else {
          setMasterEmployeeList(INITIAL_MASTER_EMPLOYEE_LIST); // Fallback
      }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setHrUserName(userData.name || 'HR Admin');
      } catch (e) { console.error(e); }
    }
    loadMasterEmployees();
    loadHikeRecords();
    speakText("Manage Employee Hikes");
  }, []);

  const handleLogout = () => {
    speakLogoutMessage(hrUserName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const handleOpenHikeModal = (hike = null) => {
    setSuccessMessage('');
    setEditingHike(hike);
    setIsHikeModalOpen(true);
  };

  const handleCloseHikeModal = () => {
    setIsHikeModalOpen(false);
    setEditingHike(null);
  };

  const handleSaveHike = (hikeData) => {
    setSuccessMessage('');
    let updatedHikeRecords;
    const employee = masterEmployeeList.find(emp => emp.id === hikeData.employeeId);

    if (editingHike) { // Edit existing draft hike
      updatedHikeRecords = hikeRecords.map(h =>
        h.id === editingHike.id ? { ...h, ...hikeData, employeeName: employee?.name || hikeData.employeeId } : h
      );
    } else { // Add new draft hike
      const newHike = {
        ...hikeData,
        id: `hike_${hikeData.employeeId}_${Date.now()}`,
        employeeName: employee?.name || hikeData.employeeId,
        status: 'Draft',
        submissionDate: new Date().toISOString()
      };
      updatedHikeRecords = [newHike, ...hikeRecords];
    }

    updatedHikeRecords.sort((a, b) => new Date(b.submissionDate || b.effectiveDate) - new Date(a.submissionDate || a.effectiveDate));
    localStorage.setItem('employeeHikeRecords', JSON.stringify(updatedHikeRecords));
    setHikeRecords(updatedHikeRecords);
    handleCloseHikeModal();
    setSuccessMessage(editingHike ? "Hike record updated successfully." : "New hike record added as Draft.");
    speakText(editingHike ? "Hike record updated." : "New hike record added.");

    // Potentially update masterEmployeeList if a 'Published' hike changes currentGross
    // For now, this is not implemented to avoid complexity. Assumes HR updates master list separately or after publishing.
  };

  const handleDeleteHike = (hikeId, employeeName) => {
    if (window.confirm(`Are you sure you want to delete this DRAFT hike record for ${employeeName}? Only drafts can be deleted.`)) {
      const recordToDelete = hikeRecords.find(h => h.id === hikeId);
      if (recordToDelete && recordToDelete.status !== 'Draft') {
        alert("Only 'Draft' hike records can be deleted.");
        return;
      }
      const updatedHikeRecords = hikeRecords.filter(h => h.id !== hikeId);
      localStorage.setItem('employeeHikeRecords', JSON.stringify(updatedHikeRecords));
      setHikeRecords(updatedHikeRecords);
      setSuccessMessage(`Draft hike record for ${employeeName} deleted.`);
      speakText("Draft hike record deleted.");
    }
  };


  const handleSimulatedCSVUpload = (event) => {
    setSuccessMessage('');
    const file = event.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      console.log(`CSV File Selected: ${file.name}. Simulating processing of hike records...`);
      speakText(`CSV file ${file.name} selected for bulk hike upload simulation.`);
      // In a real app, parse CSV and update records.
      // For simulation, maybe add a few dummy "Draft" records to localStorage and refresh.
      setSuccessMessage(`Simulated processing of ${file.name}. Check console for details.`);
    } else if (file) {
      alert("Please select a valid .csv file.");
    }
    event.target.value = null; // Reset file input
  };

  const handlePublishAllDrafts = () => {
    setSuccessMessage('');
    let count = 0;
    const updatedHikeRecords = hikeRecords.map(hike => {
      if (hike.status === 'Draft') {
        count++;
        // In a real app, here you might also update the employee's salary in masterEmployeeList
        // For now, we just update the hike record.
        const employeeForHike = masterEmployeeList.find(emp => emp.id === hike.employeeId);
        if (employeeForHike) {
            console.log(`Simulating salary update for ${employeeForHike.name} from ${hike.previousGrossSalary} to ${hike.newGrossSalary}. Effective: ${hike.effectiveDate}`);
            // Example: Update masterEmployeeList (this part is complex and needs careful state management if done live)
            // For now, this is just a simulation.
        }
        return { ...hike, status: 'Published', publishDate: new Date().toISOString() };
      }
      return hike;
    });

    if (count > 0) {
      localStorage.setItem('employeeHikeRecords', JSON.stringify(updatedHikeRecords));
      setHikeRecords(updatedHikeRecords);
      const message = `${count} draft hike record(s) published. Simulated notifications sent.`;
      setSuccessMessage(message);
      console.log(message);
      speakText(message);
    } else {
      const message = "No draft hike records found to publish.";
      setSuccessMessage(message); // Use success message for info too
      speakText(message);
    }
  };

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-CA') : 'N/A';


  return (
    <div className="dashboard-container manage-hikes-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title"><h1>EmpowerFlow</h1><p>Employee Hike & Compensation Management</p></div>
          <div className="header-actions"><ThemeSwitcher /><button onClick={handleLogout} className="logout-button">Logout</button></div>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="page-actions">
            <Link to="/dashboard/hr" className="action-button secondary-action-button">&larr; Back to HR Dashboard</Link>
            <button onClick={() => handleOpenHikeModal()} className="action-button">&#43; Add Manual Hike Record</button>
        </div>

        <h2>Manage Hike Records</h2>
        {successMessage && <p className="form-message success-message">{successMessage}</p>}

        <div className="bulk-actions-section dashboard-card">
            <h4>Bulk Operations (Simulated)</h4>
            <div className="form-group">
                <label htmlFor="csvUpload">Upload Bulk Hikes CSV:</label>
                <input type="file" id="csvUpload" accept=".csv" onChange={handleSimulatedCSVUpload} />
            </div>
            <button onClick={handlePublishAllDrafts} className="action-button publish-all-btn">Publish All Draft Hikes</button>
        </div>

        {isLoading ? <p>Loading hike records...</p> : (
            <div className="table-responsive-wrapper">
            <table className="hikes-table">
                <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Effective Date</th>
                    <th>Hike %</th>
                    <th>Prev. Gross ($)</th>
                    <th>New Gross ($)</th>
                    <th>Status</th>
                    <th>Submitted On</th>
                    <th>Published On</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {hikeRecords.length > 0 ? hikeRecords.map(hike => (
                    <tr key={hike.id}>
                    <td>{hike.employeeName} ({hike.employeeId})</td>
                    <td>{formatDate(hike.effectiveDate)}</td>
                    <td>{hike.hikePercentage}</td>
                    <td>{hike.previousGrossSalary?.toLocaleString()}</td>
                    <td>{hike.newGrossSalary?.toLocaleString()}</td>
                    <td><span className={`status-badge status-${hike.status?.toLowerCase()}`}>{hike.status}</span></td>
                    <td>{formatDate(hike.submissionDate)}</td>
                    <td>{formatDate(hike.publishDate)}</td>
                    <td className="actions-cell">
                        {hike.status === 'Draft' ? (
                            <>
                              <button onClick={() => handleOpenHikeModal(hike)} className="action-btn edit-btn" title="Edit Draft">&#9998;</button>
                              <button onClick={() => handleDeleteHike(hike.id, hike.employeeName)} className="action-btn delete-btn" title="Delete Draft">&#10006;</button>
                            </>
                        ) : (
                            <button className="action-btn view-btn" title="View Published Record" onClick={() => handleOpenHikeModal(hike)}>&#x1F441;</button> /* Eye icon */
                        )}
                    </td>
                    </tr>
                )) : (
                    <tr><td colSpan="9">No hike records found.</td></tr>
                )}
                </tbody>
            </table>
            </div>
        )}
        {isHikeModalOpen && (
            <AddEditHikeModal
                hike={editingHike}
                onSave={handleSaveHike}
                onClose={handleCloseHikeModal}
                masterEmployeeList={masterEmployeeList}
            />
        )}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ManageHikesPage;

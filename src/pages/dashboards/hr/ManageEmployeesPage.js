import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import './ManageEmployeesPage.css';

// Dummy Add/Edit Modal (simplified, real modal would be a separate component)
const EmployeeFormModal = ({ employee, onSave, onClose, allReportingManagers }) => {
    const [formData, setFormData] = useState(
        employee || { id: '', name: '', email: '', role: '', designation: '', dateOfJoining: '', reportingManagerName: '', status: 'Active' }
    );
    const [formError, setFormError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');
        if (!formData.id || !formData.name || !formData.email || !formData.role || !formData.designation || !formData.dateOfJoining || !formData.status) {
            setFormError('All fields except Reporting Manager are required.');
            return;
        }
        // Basic email validation
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setFormError('Invalid email format.');
            return;
        }
        onSave(formData);
    };

    const today = new Date().toISOString().split('T')[0];


    return (
        <div className="modal-backdrop">
            <div className="modal-content employee-form-modal-content">
                <h3>{employee ? 'Edit Employee' : 'Add New Employee'}</h3>
                {formError && <p className="form-message error-message">{formError}</p>}
                <form onSubmit={handleSubmit}>
                    {!employee && ( // Only allow editing ID for new employees for simplicity
                        <div className="form-group">
                            <label>Employee ID:</label>
                            <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="e.g., emp009" required />
                        </div>
                    )}
                    {employee && <p><strong>Employee ID:</strong> {formData.id}</p>}

                    <div className="form-group">
                        <label>Full Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                     <div className="form-row">
                        <div className="form-group">
                            <label>Role:</label>
                            <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g., Software Engineer" required />
                        </div>
                        <div className="form-group">
                            <label>Designation:</label>
                            <input type="text" name="designation" value={formData.designation} placeholder="e.g., SE II" required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Date of Joining:</label>
                            <input type="date" name="dateOfJoining" value={formData.dateOfJoining} onChange={handleChange} max={today} required />
                        </div>
                        <div className="form-group">
                            <label>Status:</label>
                            <select name="status" value={formData.status} onChange={handleChange} required>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                {/* More statuses can be added later e.g. 'Offboarding' */}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Reporting Manager:</label>
                        <select name="reportingManagerName" value={formData.reportingManagerName} onChange={handleChange}>
                            <option value="">-- Select Manager --</option>
                            {allReportingManagers.map(manager => (
                                <option key={manager} value={manager}>{manager}</option>
                            ))}
                             <option value="System">System (No Direct Manager)</option> {/* For top level */}
                        </select>
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="submit-button">{employee ? 'Save Changes' : 'Add Employee'}</button>
                        <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


function ManageEmployeesPage() {
  const navigate = useNavigate();
  const [hrUserName, setHrUserName] = useState('HR Admin');
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Active', 'Inactive'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null); // null for Add, employee object for Edit

  const loadEmployees = () => {
    const itemStr = localStorage.getItem('masterEmployeeList');
    let storedEmployees = [];
    if (itemStr && itemStr !== 'undefined') {
      try {
        storedEmployees = JSON.parse(itemStr);
      } catch (e) {
        console.error("Failed to parse 'masterEmployeeList' from localStorage:", e);
        storedEmployees = [];
      }
    }
    // Sort by ID by default
    storedEmployees.sort((a,b) => a.id.localeCompare(b.id));
    setAllEmployees(storedEmployees);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setHrUserName(userData.name || 'HR Admin');
      } catch (e) { console.error(e); }
    }
    loadEmployees();
    speakText("Manage Employees");
  }, []);

  useEffect(() => {
    let tempEmployees = [...allEmployees];
    if (statusFilter !== 'All') {
      tempEmployees = tempEmployees.filter(emp => emp.status === statusFilter);
    }
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      tempEmployees = tempEmployees.filter(emp =>
        emp.name.toLowerCase().includes(lowerSearch) ||
        emp.id.toLowerCase().includes(lowerSearch) ||
        emp.email.toLowerCase().includes(lowerSearch) ||
        emp.role.toLowerCase().includes(lowerSearch) ||
        emp.designation.toLowerCase().includes(lowerSearch)
      );
    }
    setFilteredEmployees(tempEmployees);
  }, [searchTerm, statusFilter, allEmployees]);


  const handleLogout = () => {
    speakLogoutMessage(hrUserName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const handleOpenModal = (employee = null) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSaveEmployee = (employeeData) => {
    let updatedEmployees;
    if (editingEmployee) { // Edit existing
        // Ensure ID is not changed for existing employees if form allows it
        const dataToSave = {...employeeData, id: editingEmployee.id};
        updatedEmployees = allEmployees.map(emp => emp.id === editingEmployee.id ? dataToSave : emp);
    } else { // Add new
        // Check for duplicate ID before adding
        if (allEmployees.some(emp => emp.id === employeeData.id)) {
            // This error should be handled within the modal, but as a fallback:
            alert(`Error: Employee ID ${employeeData.id} already exists.`);
            return;
        }
        updatedEmployees = [...allEmployees, employeeData];
    }
    updatedEmployees.sort((a,b) => a.id.localeCompare(b.id));
    localStorage.setItem('masterEmployeeList', JSON.stringify(updatedEmployees));
    setAllEmployees(updatedEmployees); // This will trigger the filter useEffect
    handleCloseModal();
    speakText(editingEmployee ? "Employee details updated." : "New employee added.");
  };

  const toggleEmployeeStatus = (employeeId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    if (window.confirm(`Are you sure you want to change status of ${employeeId} to ${newStatus}?`)) {
      const updatedEmployees = allEmployees.map(emp =>
        emp.id === employeeId ? { ...emp, status: newStatus } : emp
      );
      localStorage.setItem('masterEmployeeList', JSON.stringify(updatedEmployees));
      setAllEmployees(updatedEmployees);
      speakText(`Employee ${employeeId} status changed to ${newStatus}.`);
    }
  };

  // Memoize the list of possible reporting managers to avoid recalculating on every render
  const reportingManagerOptions = useMemo(() => {
    const managerNames = new Set(allEmployees
        .filter(emp => emp.status === 'Active' && (emp.role.toLowerCase().includes('lead') || emp.role.toLowerCase().includes('manager')))
        .map(emp => emp.name)
    );
    return Array.from(managerNames).sort();
  }, [allEmployees]);


  return (
    <div className="dashboard-container manage-employees-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>Employee Records Management</p>
          </div>
          <div className="header-actions">
            <ThemeSwitcher />
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="page-actions">
            <Link to="/dashboard/hr" className="action-button secondary-action-button">
                &larr; Back to HR Dashboard
            </Link>
            <button onClick={() => handleOpenModal()} className="action-button">
                &#43; Add New Employee
            </button>
        </div>

        <h2>Master Employee List</h2>

        <div className="filters-section">
          <input
            type="text"
            placeholder="Search by Name, ID, Email, Role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="table-responsive-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Designation</th>
                <th>DOJ</th>
                <th>Manager</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.role}</td>
                  <td>{emp.designation}</td>
                  <td>{new Date(emp.dateOfJoining).toLocaleDateString()}</td>
                  <td>{emp.reportingManagerName || 'N/A'}</td>
                  <td>
                    <span className={`status-badge status-${emp.status.toLowerCase()}`}>{emp.status}</span>
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleOpenModal(emp)} className="action-btn edit-btn" title="Edit">&#9998;</button>
                    <button
                        onClick={() => toggleEmployeeStatus(emp.id, emp.status)}
                        className={`action-btn ${emp.status === 'Active' ? 'deactivate-btn' : 'activate-btn'}`}
                        title={emp.status === 'Active' ? 'Deactivate' : 'Activate'}
                    >
                        {emp.status === 'Active' ? <>&#10006;</> : <>&#10004;</> }
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="9">No employees found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {isModalOpen && <EmployeeFormModal employee={editingEmployee} onSave={handleSaveEmployee} onClose={handleCloseModal} allReportingManagers={reportingManagerOptions} />}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ManageEmployeesPage;

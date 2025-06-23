import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import AddEditResumeModal from '../../../components/hrDashboard/AddEditResumeModal';
import { CANDIDATE_STATUSES } from '../../../utils/constants';
import './ManageResumesPage.css';

function ManageResumesPage() {
  const navigate = useNavigate();
  const [hrUserName, setHrUserName] = useState('HR Admin');
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResume, setEditingResume] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Filters
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const loadResumes = () => {
    setIsLoading(true);
    const itemStr = localStorage.getItem('candidateResumes');
    let records = [];
    if (itemStr && itemStr !== 'undefined') {
      try {
        records = JSON.parse(itemStr);
      } catch (e) {
        console.error("Failed to parse 'candidateResumes' from localStorage:", e);
      }
    }
    records.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
    setResumes(records);
    setIsLoading(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setHrUserName(userData.name || 'HR Admin');
      } catch (e) { console.error(e); }
    }
    loadResumes();
    speakText("Manage Candidate Resumes");
  }, []);

  const uniqueRoles = useMemo(() => {
    const roles = new Set(resumes.map(r => r.roleAppliedFor));
    return Array.from(roles).sort();
  }, [resumes]);

  const filteredResumes = useMemo(() => {
    return resumes.filter(r => {
        const roleMatch = filterRole ? r.roleAppliedFor === filterRole : true;
        const statusMatch = filterStatus !== 'All' ? r.status === filterStatus : true;
        return roleMatch && statusMatch;
    });
  }, [resumes, filterRole, filterStatus]);


  const handleLogout = () => {
    speakLogoutMessage(hrUserName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const handleOpenModal = (resume = null) => {
    setSuccessMessage('');
    setEditingResume(resume);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResume(null);
  };

  const handleSaveResume = (resumeData) => {
    setSuccessMessage('');
    let updatedResumes;

    if (editingResume) { // Edit existing
      updatedResumes = resumes.map(r =>
        r.id === editingResume.id ? { ...editingResume, ...resumeData } : r // Ensure ID and submissionDate are preserved from original if not in resumeData
      );
    } else { // Add new
      const newResume = {
        ...resumeData,
        id: `resume_${Date.now()}`,
        submissionDate: new Date().toISOString().split('T')[0]
      };
      updatedResumes = [newResume, ...resumes];
    }

    updatedResumes.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
    localStorage.setItem('candidateResumes', JSON.stringify(updatedResumes));
    setResumes(updatedResumes);
    handleCloseModal();
    setSuccessMessage(editingResume ? "Resume details updated successfully." : "New resume added successfully.");
    speakText(editingResume ? "Resume updated." : "Resume added.");
  };

  const handleDeleteResume = (resumeId, candidateName) => {
    if (window.confirm(`Are you sure you want to delete the resume for ${candidateName}?`)) {
      const updatedResumes = resumes.filter(r => r.id !== resumeId);
      localStorage.setItem('candidateResumes', JSON.stringify(updatedResumes));
      setResumes(updatedResumes);
      setSuccessMessage(`Resume for ${candidateName} deleted.`);
      speakText("Resume deleted.");
    }
  };

  const handleStatusUpdate = (resumeId, newStatus) => {
    const updatedResumes = resumes.map(r =>
        r.id === resumeId ? { ...r, status: newStatus } : r
    );
    // No re-sort needed if only status changes, unless primary sort is by status
    localStorage.setItem('candidateResumes', JSON.stringify(updatedResumes));
    setResumes(updatedResumes);
    speakText(`Status updated to ${newStatus}.`);
  };


  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-CA') : 'N/A';

  return (
    <div className="dashboard-container manage-resumes-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title"><h1>EmpowerFlow</h1><p>Candidate Resume Management</p></div>
          <div className="header-actions"><ThemeSwitcher /><button onClick={handleLogout} className="logout-button">Logout</button></div>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="page-actions">
            <Link to="/dashboard/hr" className="action-button secondary-action-button">&larr; Back to HR Dashboard</Link>
            <button onClick={() => handleOpenModal()} className="action-button">&#43; Add New Resume</button>
        </div>

        <h2>Manage Resumes</h2>
        {successMessage && <p className="form-message success-message">{successMessage}</p>}

        <div className="filters-section resume-filters">
            <div className="form-group">
                <label htmlFor="filterRole">Filter by Role:</label>
                <select id="filterRole" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                    <option value="">All Roles</option>
                    {uniqueRoles.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="filterStatusResume">Filter by Status:</label>
                <select id="filterStatusResume" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="All">All Statuses</option>
                    {CANDIDATE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
            </div>
        </div>

        {isLoading ? <p>Loading resumes...</p> : (
            <div className="table-responsive-wrapper">
            <table className="resumes-table">
                <thead>
                <tr>
                    <th>Candidate Name</th>
                    <th>Role Applied For</th>
                    <th>Resume Link</th>
                    <th>Source</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredResumes.length > 0 ? filteredResumes.map(res => (
                    <tr key={res.id}>
                    <td>{res.candidateName}</td>
                    <td>{res.roleAppliedFor}</td>
                    <td><a href={res.resumeLink} target="_blank" rel="noopener noreferrer" className="external-doc-link">View Resume</a></td>
                    <td>{res.source || 'N/A'}</td>
                    <td>{formatDate(res.submissionDate)}</td>
                    <td>
                        <select
                            value={res.status}
                            onChange={(e) => handleStatusUpdate(res.id, e.target.value)}
                            className="status-select-inline"
                            title="Update Status"
                        >
                            {CANDIDATE_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </td>
                    <td className="actions-cell">
                        <button onClick={() => handleOpenModal(res)} className="action-btn edit-btn" title="Edit Details">&#9998;</button>
                        <button onClick={() => handleDeleteResume(res.id, res.candidateName)} className="action-btn delete-btn" title="Delete">&#10006;</button>
                    </td>
                    </tr>
                )) : (
                    <tr><td colSpan="7">No resumes found matching your criteria.</td></tr>
                )}
                </tbody>
            </table>
            </div>
        )}
        {isModalOpen && (
            <AddEditResumeModal
                resume={editingResume}
                onSave={handleSaveResume}
                onClose={handleCloseModal}
            />
        )}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ManageResumesPage;

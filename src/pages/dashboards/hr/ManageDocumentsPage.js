import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
// import { DOCUMENT_CATEGORIES } from '../../../utils/constants'; // DOCUMENT_CATEGORIES is used in modal
import AddEditDocumentModal from '../../../components/hrDashboard/AddEditDocumentModal';
import './ManageDocumentsPage.css';

function ManageDocumentsPage() {
  const navigate = useNavigate();
  const [hrUserName, setHrUserName] = useState('HR Admin');
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null); // null for Add, document object for Edit

  const loadDocuments = () => {
    setIsLoading(true);
    const itemStr = localStorage.getItem('companyDocuments');
    let docs = [];
    if (itemStr && itemStr !== 'undefined') {
      try {
        docs = JSON.parse(itemStr);
      } catch (e) {
        console.error("Failed to parse 'companyDocuments' from localStorage:", e);
        docs = [];
      }
    }
    // Sort by uploadDate descending (most recent first)
    docs.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    setDocuments(docs);
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
    loadDocuments();
    speakText("Manage Company Documents");
  }, []);

  const handleLogout = () => {
    speakLogoutMessage(hrUserName);
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  const handleOpenModal = (doc = null) => {
    setEditingDocument(doc);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDocument(null);
  };

  const handleSaveDocument = (documentData) => {
    let updatedDocuments;
    if (editingDocument) { // Edit existing
      updatedDocuments = documents.map(doc =>
        doc.id === editingDocument.id ? { ...documentData, id: editingDocument.id, uploadDate: editingDocument.uploadDate } : doc
      );
       // If it was an item from initial constants without an ID, we might need a different match or ensure IDs are always present.
       // For simplicity, assuming IDs are present or generated upon first load/modification.
       // If uploadDate is to be updated on edit, change `uploadDate: editingDocument.uploadDate` to `uploadDate: new Date().toISOString()`
    } else { // Add new
      const newDocument = {
        ...documentData,
        id: `doc${Date.now()}`, // Generate unique ID
        uploadDate: new Date().toISOString().split('T')[0] // Set upload date
      };
      updatedDocuments = [newDocument, ...documents];
    }
    // Re-sort after add/edit
    updatedDocuments.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    localStorage.setItem('companyDocuments', JSON.stringify(updatedDocuments));
    setDocuments(updatedDocuments);
    handleCloseModal();
    speakText(editingDocument ? "Document updated successfully." : "Document added successfully.");
  };


  const handleDeleteDocument = (docId, docTitle) => {
    if (window.confirm(`Are you sure you want to delete the document: "${docTitle}"?`)) {
      const updatedDocuments = documents.filter(doc => doc.id !== docId);
      localStorage.setItem('companyDocuments', JSON.stringify(updatedDocuments));
      setDocuments(updatedDocuments); // This will re-render the table
      speakText("Document deleted successfully.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };


  return (
    <div className="dashboard-container manage-documents-page fade-in-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title"><h1>EmpowerFlow</h1><p>Company Document Management</p></div>
          <div className="header-actions"><ThemeSwitcher /><button onClick={handleLogout} className="logout-button">Logout</button></div>
        </div>
      </header>
      <main className="dashboard-content">
        <div className="page-actions">
            <Link to="/dashboard/hr" className="action-button secondary-action-button">&larr; Back to HR Dashboard</Link>
            <button onClick={() => handleOpenModal()} className="action-button">&#43; Add New Document</button>
        </div>

        <h2>Manage Company Documents</h2>

        {isLoading ? <p>Loading documents...</p> : (
            <div className="table-responsive-wrapper">
            <table className="documents-table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Upload Date</th>
                    <th className="description-col">Description</th>
                    <th>File/Link</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {documents.length > 0 ? documents.map(doc => (
                    <tr key={doc.id}>
                    <td>{doc.title}</td>
                    <td>{doc.category}</td>
                    <td>{formatDate(doc.uploadDate)}</td>
                    <td className="description-col" title={doc.description}>
                        {doc.description.length > 70 ? `${doc.description.substring(0, 70)}...` : doc.description}
                    </td>
                    <td>
                        {doc.externalUrl ?
                            <a href={doc.externalUrl} target="_blank" rel="noopener noreferrer" className="external-doc-link">External Link</a> :
                            (doc.fileName || (doc.simulatedContent ? `${doc.title.replace(/\s+/g, '_')}.txt` : 'N/A'))
                        }
                    </td>
                    <td className="actions-cell">
                        <button onClick={() => handleOpenModal(doc)} className="action-btn edit-btn" title="Edit">&#9998;</button>
                        <button onClick={() => handleDeleteDocument(doc.id, doc.title)} className="action-btn delete-btn" title="Delete">&#10006;</button>
                    </td>
                    </tr>
                )) : (
                    <tr><td colSpan="6">No documents found. Add some documents to get started.</td></tr>
                )}
                </tbody>
            </table>
            </div>
        )}
        {isModalOpen && <AddEditDocumentModal document={editingDocument} onSave={handleSaveDocument} onClose={handleCloseModal} />}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ManageDocumentsPage;

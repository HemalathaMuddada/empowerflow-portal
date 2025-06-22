import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../../../components/ThemeSwitcher';
import { speakLogoutMessage, speakText } from '../../../utils/speech';
import { DUMMY_DOCUMENTS, DOCUMENT_CATEGORIES } from '../../../utils/constants';
import './DocumentCenterPage.css';

const simulateDocAction = (doc) => {
  if (doc.externalUrl) {
    window.open(doc.externalUrl, '_blank', 'noopener,noreferrer');
    speakText(`Opening document: ${doc.title}`);
  } else if (doc.simulatedContent) {
    let content = `****************************************\n`;
    content += `        EmpowerFlow Document\n`;
    content += `****************************************\n\n`;
    content += `Title: ${doc.title}\n`;
    content += `Category: ${doc.category}\n`;
    content += `Upload Date: ${doc.uploadDate}\n`;
    content += `----------------------------------------\n\n`;
    content += doc.simulatedContent;
    content += `\n\n----------------------------------------\n`;
    content += `This is a system-generated document view.\n`;
    content += `EmpowerFlow Inc.\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.download = doc.fileName || `${doc.title.replace(/\s+/g, '_')}.txt`;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    speakText(`Downloading document: ${doc.title}`);
  } else {
    alert(`No content or external link available for: ${doc.title}`);
    speakText(`No content available for: ${doc.title}`);
  }
};

function DocumentCenterPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Employee');
  const [allDocuments, setAllDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.name || 'Employee');
      } catch (e) { console.error(e); }
    }
    // Sort documents by uploadDate descending (most recent first)
    const sortedDocs = [...DUMMY_DOCUMENTS].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    setAllDocuments(sortedDocs);
    setFilteredDocuments(sortedDocs);
    speakText("Document Center");
  }, []);

  useEffect(() => {
    let docs = [...allDocuments];
    if (selectedCategory !== 'all') {
      docs = docs.filter(doc => doc.category === selectedCategory);
    }
    if (searchTerm.trim() !== '') {
      const lowerSearchTerm = searchTerm.toLowerCase();
      docs = docs.filter(doc =>
        doc.title.toLowerCase().includes(lowerSearchTerm) ||
        doc.description.toLowerCase().includes(lowerSearchTerm) ||
        doc.category.toLowerCase().includes(lowerSearchTerm)
      );
    }
    setFilteredDocuments(docs);
  }, [selectedCategory, searchTerm, allDocuments]);


  const handleLogout = () => {
    // Standard logout logic
    speakLogoutMessage(userName); // Use the state userName for potentially better hint
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <div className="dashboard-container document-center-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-and-title">
            <h1>EmpowerFlow</h1>
            <p>{userName}'s Document Center</p>
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

        <h2>Company Documents</h2>

        <div className="document-filters">
          <div className="form-group">
            <label htmlFor="doc-search">Search Documents:</label>
            <input
              type="text"
              id="doc-search"
              placeholder="Search by title, description, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="doc-category-filter">Filter by Category:</label>
            <select
              id="doc-category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {DOCUMENT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="document-list">
            {filteredDocuments.map(doc => (
              <div key={doc.id} className="document-item dashboard-card">
                <h3>{doc.title}</h3>
                <p className="doc-category"><strong>Category:</strong> {doc.category}</p>
                <p className="doc-date"><strong>Uploaded:</strong> {new Date(doc.uploadDate).toLocaleDateString()}</p>
                <p className="doc-description">{doc.description}</p>
                <button
                  onClick={() => simulateDocAction(doc)}
                  className="action-button view-download-button">
                  View/Download
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No documents found matching your criteria.</p>
        )}
      </main>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} EmpowerFlow Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default DocumentCenterPage;

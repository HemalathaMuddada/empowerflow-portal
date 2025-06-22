import React, { useState, useEffect } from 'react';
import { DOCUMENT_CATEGORIES } from '../../utils/constants';
import './AddEditDocumentModal.css';

function AddEditDocumentModal({ document, onSave, onClose }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(DOCUMENT_CATEGORIES.find(cat => cat.value !== 'all')?.value || ''); // Default to first actual category
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [simulatedContent, setSimulatedContent] = useState(''); // For .txt content
  const [externalUrl, setExternalUrl] = useState('');
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'url'
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (document) {
      setTitle(document.title || '');
      setCategory(document.category || DOCUMENT_CATEGORIES.find(cat => cat.value !== 'all')?.value || '');
      setDescription(document.description || '');
      setFileName(document.fileName || '');
      setSimulatedContent(document.simulatedContent || '');
      setExternalUrl(document.externalUrl || '');
      setUploadType(document.externalUrl ? 'url' : 'file');
    } else {
        // Defaults for new document
        setTitle('');
        setCategory(DOCUMENT_CATEGORIES.find(cat => cat.value !== 'all')?.value || '');
        setDescription('');
        setFileName('');
        setSimulatedContent('');
        setExternalUrl('');
        setUploadType('file');
    }
  }, [document]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      // For actual .txt simulation, could read file content here if it's a .txt
      // For now, just capturing name. We'll use a textarea for simulated content.
    } else {
      setFileName('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!title.trim() || !category || !description.trim()) {
      setFormError('Title, Category, and Description are required.');
      return;
    }
    if (uploadType === 'file' && !fileName.trim() && !simulatedContent.trim()) {
        setFormError('For File Upload type, please provide a File Name (simulated by typing or selecting a file) or enter Simulated Content.');
        return;
    }
    if (uploadType === 'url' && !externalUrl.trim()) {
        setFormError('For URL type, please provide the External URL.');
        return;
    }
     if (uploadType === 'url') {
        try {
            new URL(externalUrl); // Validate URL format
        } catch (_) {
            setFormError('Please enter a valid External URL (e.g., http://example.com/doc.pdf).');
            return;
        }
    }


    const documentData = {
      ...(document || {}), // Preserve ID and other fields if editing
      title: title.trim(),
      category,
      description: description.trim(),
      fileName: uploadType === 'file' ? (fileName.trim() || (simulatedContent.trim() ? `${title.trim().replace(/\s+/g, '_')}.txt` : '')) : '',
      simulatedContent: uploadType === 'file' ? simulatedContent.trim() : '',
      externalUrl: uploadType === 'url' ? externalUrl.trim() : '',
      // uploadDate will be set/updated in ManageDocumentsPage onSave
    };
    onSave(documentData);
  };

  const actualCategories = DOCUMENT_CATEGORIES.filter(cat => cat.value !== 'all');


  return (
    <div className="modal-backdrop">
      <div className="modal-content add-edit-document-modal-content">
        <h3>{document ? 'Edit Document' : 'Add New Document'}</h3>
        {formError && <p className="form-message error-message">{formError}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="docTitle">Title:</label>
            <input type="text" id="docTitle" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="docCategory">Category:</label>
            <select id="docCategory" value={category} onChange={(e) => setCategory(e.target.value)} required>
              {actualCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="docDescription">Description:</label>
            <textarea id="docDescription" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" required />
          </div>

          <div className="form-group">
            <label>Document Type:</label>
            <div>
              <label className="radio-label">
                <input type="radio" name="uploadType" value="file" checked={uploadType === 'file'} onChange={() => setUploadType('file')} />
                File (Simulated Upload / Content)
              </label>
              <label className="radio-label">
                <input type="radio" name="uploadType" value="url" checked={uploadType === 'url'} onChange={() => setUploadType('url')} />
                External URL
              </label>
            </div>
          </div>

          {uploadType === 'file' && (
            <>
              <div className="form-group">
                <label htmlFor="docFile">Simulated File Upload:</label>
                <input type="file" id="docFile" onChange={handleFileChange} />
                {fileName && <p className="file-name-display">Selected file (simulated): {fileName}</p>}
                 <p className="form-hint"><small>This simulates a file selection. Actual file upload is not implemented. Enter content below for a .txt file.</small></p>
              </div>
              <div className="form-group">
                <label htmlFor="docSimulatedContent">Simulated .txt Content (Optional, if no file selected):</label>
                <textarea id="docSimulatedContent" value={simulatedContent} onChange={(e) => setSimulatedContent(e.target.value)} rows="5" placeholder="Enter content for the .txt file to be generated."/>
              </div>
            </>
          )}

          {uploadType === 'url' && (
            <div className="form-group">
              <label htmlFor="docExternalUrl">External URL:</label>
              <input type="url" id="docExternalUrl" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="e.g., https://example.com/document.pdf" />
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="submit-button">{document ? 'Save Changes' : 'Add Document'}</button>
            <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEditDocumentModal;

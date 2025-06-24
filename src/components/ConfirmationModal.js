import React from 'react';
import './ConfirmationModal.css'; // We'll create this CSS file next

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop confirmation-modal-backdrop">
      <div className="modal-content confirmation-modal-content">
        <p>{message}</p>
        <div className="modal-actions confirmation-modal-actions">
          <button onClick={onConfirm} className="button confirm-button">{confirmText}</button>
          <button onClick={onCancel} className="button cancel-button">{cancelText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

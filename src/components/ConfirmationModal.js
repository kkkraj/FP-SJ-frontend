import React from 'react';
import '../ConfirmationModal.css';

export default function ConfirmationModal({ isOpen, onConfirm, onCancel, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{title}</h3>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button 
                        className="btn btn-secondary" 
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button 
                        className="btn btn-danger" 
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
} 
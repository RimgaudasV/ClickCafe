import React from "react";
import "../../confirmModal.css"; 

const ConfirmModal = ({ show, onConfirm, onCancel, message }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3>Confirm Navigation</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onCancel}>Cancel</button>
                    <button className="danger" onClick={onConfirm}>Yes, go back</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

import React from 'react';
import '../css/confirmationPopup.css';

const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="confirmation-popup-overlay">
            <div className="confirmation-popup-content">
                <p>{message}</p>
                <div className='btn-yes-no'>
                    <button onClick={onConfirm}>כן</button>
                    <button onClick={onCancel}>לא</button>
                </div>

            </div>
        </div>
    );
};

export default ConfirmationPopup;

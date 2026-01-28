import React from 'react';
import '../styles/Modal.css';

function Modal({ isOpen, title, children, onClose, buttons = [] }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {buttons.length > 0 && (
          <div className="modal-footer">
            {buttons.map((btn, index) => (
              <button
                key={index}
                className={`modal-btn ${btn.variant || 'default'}`}
                onClick={btn.onClick}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.css';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoading(true); // Reset loading state when modal opens
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <div className={styles.modalBody}>
          {isLoading && (
            <div className={styles.loader}>
              <div className={styles.spinner}></div>
              <p>Loading feedback form...</p>
            </div>
          )}
          <iframe 
            className="airtable-embed" 
            src="https://airtable.com/embed/appEVqkGfPR0H6XLF/pagGiCQ5jrswCq04Y/form" 
            frameBorder="0" 
            width="100%" 
            height="700" 
            style={{
              background: 'white', 
              border: '1px solid #ccc',
              display: isLoading ? 'none' : 'block'
            }}
            allow="clipboard-write"
            title="Feedback Form"
            loading="eager"
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default FeedbackModal;
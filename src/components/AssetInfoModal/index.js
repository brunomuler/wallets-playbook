import React from 'react';
import styles from './styles.module.css';

export default function AssetInfoModal({ asset, isOpen, onClose }) {
  if (!isOpen) return null;

  // Simple markdown-to-HTML converter for basic formatting
  const renderMarkdown = (text) => {
    if (!text) return '';
    
    // Convert markdown links [text](url) to HTML links
    return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{asset.name} Information</h3>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className={styles.modalBody}>
          {asset.description && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Description</h4>
              <div 
                className={styles.content}
                dangerouslySetInnerHTML={{ 
                  __html: renderMarkdown(asset.description) 
                }}
              />
            </div>
          )}
          {asset.information && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Information</h4>
              <div 
                className={styles.content}
                dangerouslySetInnerHTML={{ 
                  __html: renderMarkdown(asset.information) 
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import styles from './styles.module.css';
import sharedStyles from '../shared/websiteButton.module.css';
import { getLogoUrl } from '@site/src/utils/imageMapper';

export default function AssetInfoModal({ asset, isOpen, onClose }) {
  if (!isOpen) return null;

  // Helper function to generate initials from issuer name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Helper function to generate consistent color based on issuer name
  const getInitialsColor = (name) => {
    const lightColors = [
      '#E5E7EB', // gray-200
      '#E2E8F0', // slate-200
      '#E4E4E7', // zinc-200
      '#E5E5E5', // neutral-200
      '#E7E5E4', // stone-200
      '#DBEAFE', // blue-100
      '#D1FAE5', // emerald-100
      '#EDE9FE', // violet-100
    ];
    
    const darkColors = [
      '#6B7280', // gray-500
      '#64748B', // slate-500
      '#71717A', // zinc-500
      '#737373', // neutral-500
      '#78716C', // stone-500
      '#6B7280', // gray-500
      '#64748B', // slate-500
      '#71717A', // zinc-500
    ];
    
    // Create a simple hash from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return {
      light: lightColors[Math.abs(hash) % lightColors.length],
      dark: darkColors[Math.abs(hash) % darkColors.length]
    };
  };

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

  const issuer = asset.issuers && asset.issuers[0];

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderContent}>
            {issuer && (
              <div className={styles.modalHeaderLogo}>
                {issuer.logo ? (
                  <img
                    src={getLogoUrl(issuer.logo)}
                    alt={`${issuer.name} logo`}
                    className={styles.headerLogo}
                  />
                ) : (
                  <div 
                    className={styles.headerInitialsLogo}
                    style={{ 
                      '--light-bg': getInitialsColor(issuer.name).light,
                      '--dark-bg': getInitialsColor(issuer.name).dark
                    }}
                  >
                    {getInitials(issuer.name)}
                  </div>
                )}
              </div>
            )}
            <div className={styles.modalHeaderText}>
              <h3 className={styles.modalTitle}>
                <span className={styles.assetName}>{asset.name}</span>
                {issuer && <span className={styles.issuerName}>by {issuer.name}</span>}
              </h3>
            </div>
          </div>
          <div className={styles.modalHeaderActions}>
            {asset.yield_bearing && (
              <span className={styles.headerYieldBadge}>Yield-Bearing</span>
            )}
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
        </div>
        <div className={styles.modalBody}>
          {asset.fiat_asset && (
            <div className={styles.section}>
              <div className={styles.anchorInfo}>
                <span className={styles.anchorLabel}>Anchored to</span>
                <span className={styles.fiatBadge}>{asset.fiat_asset}</span>
              </div>
            </div>
          )}
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
        {((asset.website || (asset.issuers && asset.issuers[0] && asset.issuers[0].website)) || asset.issuer_address) && (
          <div className={styles.modalFooter}>
            {asset.issuer_address && (
              <a
                href={`https://stellar.expert/explorer/public/asset/${asset.name}-${asset.issuer_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className={sharedStyles.websiteLink}
              >
                View on StellarExpert
                <svg
                  className={sharedStyles.externalIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
            {(asset.website || (asset.issuers && asset.issuers[0] && asset.issuers[0].website)) && (
              <a
                href={asset.website || (asset.issuers && asset.issuers[0] && asset.issuers[0].website)}
                target="_blank"
                rel="noopener noreferrer"
                className={sharedStyles.websiteLink}
              >
                Website
                <svg
                  className={sharedStyles.externalIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
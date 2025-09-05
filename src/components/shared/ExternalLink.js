import React from 'react';
import styles from './ExternalLink.module.css';

const ExternalIcon = () => (
  <svg
    className={styles.externalIcon}
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
);

const ExternalLink = ({ 
  href, 
  children,
  text,
  icon,
  className = '',
  showExternalIcon = true
}) => {
  if (!href) return null;
  
  const content = children || text;
  
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.externalLink} ${className}`}
    >
      {icon && <span className={styles.iconWrapper}>{icon}</span>}
      {content}
      {showExternalIcon && <ExternalIcon />}
    </a>
  );
};

export default ExternalLink;
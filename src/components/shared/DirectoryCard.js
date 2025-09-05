import React from 'react';
import styles from './DirectoryCard.module.css';

const DirectoryCard = ({ 
  children, 
  className = '',
  onClick,
  hoverable = true
}) => {
  const cardClass = `${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`;
  
  return (
    <div 
      className={cardClass}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`${styles.cardHeader} ${className}`}>
    {children}
  </div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={`${styles.cardBody} ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`${styles.cardFooter} ${className}`}>
    {children}
  </div>
);

DirectoryCard.Header = CardHeader;
DirectoryCard.Body = CardBody;
DirectoryCard.Footer = CardFooter;

export default DirectoryCard;
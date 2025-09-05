import React from 'react';
import { getLogoUrl } from '@site/src/utils/imageMapper';
import styles from './Logo.module.css';

const Logo = ({ 
  src, 
  alt, 
  name, 
  size = 'medium',
  showPlaceholder = true,
  className = '',
  placeholderClassName = ''
}) => {
  const sizeClass = styles[size] || styles.medium;
  
  if (src) {
    return (
      <img
        src={getLogoUrl(src)}
        alt={alt || `${name} logo`}
        className={`${styles.logo} ${sizeClass} ${className}`}
      />
    );
  }
  
  if (showPlaceholder) {
    return (
      <div 
        className={`${styles.logoPlaceholder} ${sizeClass} ${placeholderClassName}`}
      />
    );
  }
  
  return null;
};

export default Logo;
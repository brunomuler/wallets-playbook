import React from 'react';
import styles from './TypeTag.module.css';

export default function TypeTag({ type, className = '' }) {
  if (!type) return null;
  
  return (
    <span className={`${styles.typeTag} ${className}`}>
      {type}
    </span>
  );
}
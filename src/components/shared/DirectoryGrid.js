import React from 'react';
import styles from './DirectoryGrid.module.css';

const DirectoryGrid = ({ 
  children, 
  columns = 'auto-fill',
  minWidth = '320px',
  gap = '16px',
  className = ''
}) => {
  const gridStyle = {
    '--grid-template-columns': columns === 'auto-fill' 
      ? `repeat(auto-fill, minmax(${minWidth}, 1fr))`
      : columns,
    '--grid-gap': gap
  };
  
  return (
    <div 
      className={`${styles.directoryGrid} ${className}`}
      style={gridStyle}
    >
      {children}
    </div>
  );
};

export default DirectoryGrid;
import React, { useState, useMemo } from 'react';
import { FaGlobe, FaGithub, FaChartBar } from 'react-icons/fa';
import defiDataRaw from '@site/src/data/defi.json';
import styles from './styles.module.css';

const DefiDirectory = () => {
  // Handle both wrapper format { data: [...] } and direct array format
  const defiData = (defiDataRaw.data || defiDataRaw) || [];
  
  // Handle empty or malformed data
  if (!Array.isArray(defiData) || defiData.length === 0) {
    return (
      <div>
        <p>No DeFi data available.</p>
      </div>
    );
  }
  
  const [selectedType, setSelectedType] = useState('All');

  const uniqueTypes = useMemo(() => {
    const allTypes = defiData.map(d => d.type);
    return ['All', ...[...new Set(allTypes)]];
  }, [defiData]);

  const filteredData = useMemo(() => {
    if (selectedType === 'All') {
      return defiData;
    }
    return defiData.filter(d => d.type === selectedType);
  }, [selectedType]);

  return (
    <div>
      <div className={styles.filterContainer}>
        <div className={styles.filterOptions}>
          {uniqueTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`${styles.filterButton} ${
                selectedType === type ? styles.activeFilter : ''
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <br />
      <div>
        {filteredData.map(item => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{item.title}</h3>
              <span className={styles.cardType}>{item.type}</span>
            </div>
            <div className={styles.cardBody}>
              <p>{item.description}</p>
            </div>
            <div className={styles.cardFooter}>
              {item.website && <a href={item.website} target="_blank" rel="noopener noreferrer" className={styles.link}><FaGlobe /> Website</a>}
              {item.github && <a href={item.github} target="_blank" rel="noopener noreferrer" className={styles.link}><FaGithub /> GitHub</a>}
              {item.analytics && <a href={item.analytics} target="_blank" rel="noopener noreferrer" className={styles.link}><FaChartBar /> Analytics</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DefiDirectory; 
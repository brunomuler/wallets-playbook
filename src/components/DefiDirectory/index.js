import React, { useState, useMemo } from 'react';
import { FaGlobe, FaGithub, FaChartBar } from 'react-icons/fa';
import defiDataRaw from '@site/src/data/defi.json';
import ContributeNotice from '../ContributeNotice';
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
  const [expandedItems, setExpandedItems] = useState({});

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

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  const shouldTruncate = (text, maxLength = 150) => {
    return text && text.length > maxLength;
  };

  return (
    <div>
      <ContributeNotice />
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
      <div className={styles.cardsGrid}>
        {filteredData.map(item => {
          const isExpanded = expandedItems[item.id];
          const description = item.description || '';
          const shouldShowToggle = shouldTruncate(description);
          const displayText = isExpanded || !shouldShowToggle 
            ? description 
            : truncateText(description);

          return (
            <div key={item.id} className={styles.card}>
              <div className={styles.thumbnailContainer}>
                {item.thumbnail && (
                  <img
                    src={`/img/thumbnails/${item.thumbnail}`}
                    alt={`${item.title} thumbnail`}
                    className={styles.thumbnail}
                  />
                )}
              </div>
              <div className={styles.cardHeader}>
                <h3>{item.title}</h3>
                <span className={styles.cardType}>{item.type}</span>
              </div>
              <div className={styles.cardBody}>
                <p>
                  {displayText}
                  {shouldShowToggle && !isExpanded && '...'}
                  {shouldShowToggle && (
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={styles.showMoreButton}
                    >
                      {isExpanded ? ' Show less' : ' Show more'}
                    </button>
                  )}
                </p>
              </div>
              <div className={styles.cardFooter}>
                {item.website && <a href={item.website} target="_blank" rel="noopener noreferrer" className={styles.link}><FaGlobe /> Website</a>}
                {item.github && <a href={item.github} target="_blank" rel="noopener noreferrer" className={styles.link}><FaGithub /> GitHub</a>}
                {item.analytics && <a href={item.analytics} target="_blank" rel="noopener noreferrer" className={styles.link}><FaChartBar /> Analytics</a>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DefiDirectory; 
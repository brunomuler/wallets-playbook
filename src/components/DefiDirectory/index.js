import React, { useState, useMemo } from 'react';
import { FaGlobe, FaGithub, FaChartBar } from 'react-icons/fa';
import defiDataRaw from '@site/src/data/defi.json';
import bridgesDataRaw from '@site/src/data/bridges.json';
import ContributeNotice from '../ContributeNotice';
import styles from './styles.module.css';

const DefiDirectory = ({ 
  dataSource = 'defi', 
  filterTypes = [], 
  showFilters = true,
  title = null 
}) => {
  // Select data source based on prop
  const rawData = dataSource === 'bridges' ? bridgesDataRaw : defiDataRaw;
  
  // Handle both wrapper format { data: [...] } and direct array format
  const allData = (rawData.data || rawData) || [];
  
  // Normalize data structure to handle differences between defi and bridges data
  const normalizedData = useMemo(() => {
    return allData.map(item => ({
      id: item.id,
      title: item.title || item.name, // bridges use 'name', defi uses 'title'
      type: item.type,
      description: item.description?.[0] || item.description || '', // Handle array or string
      website: Array.isArray(item.website) ? item.website[0] : item.website,
      github: Array.isArray(item.github) ? item.github[0] : item.github,
      analytics: item.analytics,
      logo: item.logo || item.thumbnail,
      sub_type: item.sub_type
    }));
  }, [allData]);
  
  // Apply custom type filters if provided
  const filteredByCustomTypes = useMemo(() => {
    if (filterTypes.length === 0) {
      return normalizedData;
    }
    return normalizedData.filter(item => filterTypes.includes(item.type));
  }, [normalizedData, filterTypes]);
  
  // Handle empty or malformed data
  if (!Array.isArray(filteredByCustomTypes) || filteredByCustomTypes.length === 0) {
    return (
      <div>
        <p>No data available.</p>
      </div>
    );
  }
  
  const [selectedType, setSelectedType] = useState('All');
  const [expandedItems, setExpandedItems] = useState({});

  const uniqueTypes = useMemo(() => {
    if (!showFilters) return [];
    const allTypes = filteredByCustomTypes.map(d => d.type);
    return ['All', ...[...new Set(allTypes)]];
  }, [filteredByCustomTypes, showFilters]);

  const filteredData = useMemo(() => {
    if (!showFilters || selectedType === 'All') {
      return filteredByCustomTypes;
    }
    return filteredByCustomTypes.filter(d => d.type === selectedType);
  }, [selectedType, filteredByCustomTypes, showFilters]);

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Check if text should be truncated based on line count (approximate)
  const shouldTruncate = (text) => {
    if (!text) return false;
    // Rough estimate: assume ~80 characters per line for 2 lines = 160 chars
    // This is approximate and CSS will handle the actual visual truncation
    return text.length > 160;
  };

  return (
    <div>
      <ContributeNotice />
      {showFilters && uniqueTypes.length > 1 && (
        <>
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
        </>
      )}
      <div className={styles.cardsGrid}>
        {filteredData.map(item => {
          const isExpanded = expandedItems[item.id];
          const description = item.description || '';
          const shouldShowToggle = shouldTruncate(description);

          // Determine correct image path based on data source
          const imagePath = dataSource === 'bridges' 
            ? `/img/logos/${item.logo}` 
            : `/img/thumbnails/${item.logo}`;

          return (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  {item.logo ? (
                    <img
                      src={imagePath}
                      alt={`${item.title} logo`}
                      className={styles.logo}
                    />
                  ) : (
                    <div className={styles.logoPlaceholder}></div>
                  )}
                  <div className={styles.titleContainer}>
                    <h3>{item.title}</h3>
                    <span className={styles.cardType}>{item.type}</span>
                  </div>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.descriptionContainer}>
                  <p className={`${styles.description} ${!isExpanded ? styles.clamped : ''}`}>
                    {description}
                  </p>
                  {shouldShowToggle && (
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={styles.showMoreButton}
                    >
                      {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
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
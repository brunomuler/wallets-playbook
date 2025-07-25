import React from 'react';
import bridgesData from '@site/src/data/bridges.json';
import ContributeNotice from '../ContributeNotice';
import styles from './styles.module.css';

export default function BridgesDirectory() {
  // Handle both wrapper format { data: [...] } and direct array format
  const bridges = (bridgesData.data || bridgesData) || [];
  
  // Handle empty or malformed data
  if (!Array.isArray(bridges) || bridges.length === 0) {
    return (
      <div className={styles.gridContainer}>
        <p>No bridges data available.</p>
      </div>
    );
  }

  return (
    <div>
      <ContributeNotice />

      <div className={styles.gridContainer}>
        {bridges.map(bridge => (
          <div key={bridge.id} className={styles.card}>
            <div className={styles.cardHeader}>
              {bridge.logo && (
                <img
                  src={`/img/logos/${bridge.logo}`}
                  alt={`${bridge.name} logo`}
                  className={styles.logo}
                />
              )}
              <h3 className={styles.cardName}>{bridge.name}</h3>
            </div>

            {bridge.sub_type && bridge.sub_type.length > 0 && (
              <div className={styles.cardBody}>
                <div className={styles.subTypesContainer}>
                  {bridge.sub_type.map((subType, index) => (
                    <span key={index} className={styles.subTypeTag}>
                      {subType}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {bridge.website && (
              <div className={styles.cardFooter}>
                <a
                  href={bridge.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.websiteButton}
                >
                  Visit Website
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
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 
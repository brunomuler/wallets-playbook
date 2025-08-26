import React from 'react';
import dexDataRaw from '@site/src/data/dex.json';
import ContributeNotice from '../ContributeNotice';
import styles from './styles.module.css';

export default function DexDirectory() {
  // Handle both wrapper format { data: [...] } and direct array format
  const dexes = (dexDataRaw.data || dexDataRaw) || [];

  // Handle empty or malformed data
  if (!Array.isArray(dexes) || dexes.length === 0) {
    return (
      <div className={styles.gridContainer}>
        <ContributeNotice />
        <p>No DEX data available.</p>
      </div>
    );
  }

  return (
    <div>
      <ContributeNotice />

      <div className={styles.gridContainer}>
        {dexes.map((dex) => (
          <div key={dex.id || dex.name} className={styles.card}>
            <div className={styles.cardHeader}>
              {dex.logo ? (
                <img
                  src={`/img/logos/${dex.logo}`}
                  alt={`${dex.name} logo`}
                  className={styles.logo}
                />
              ) : (
                <div className={styles.logoPlaceholder}></div>
              )}
              <h3 className={styles.cardName}>{dex.name}</h3>
            </div>

            {/* Category removed as requested */}

            {dex.website && (
              <div className={styles.cardFooter}>
                <a
                  href={dex.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.websiteButton}
                >
                  Website
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



import React from 'react';
import defiDataRaw from '@site/src/data/defi.json';
import ContributeNotice from '../ContributeNotice';
import styles from './styles.module.css';

export default function DexDirectory() {
  // Get all defi data and filter for DEX type only
  const allDefiData = (defiDataRaw.data || defiDataRaw) || [];
  const dexes = Array.isArray(allDefiData) ? allDefiData.filter(item => item.type === 'DEX') : [];

  // Handle empty or malformed data
  if (dexes.length === 0) {
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
        {dexes.map((dex) => {
          // Handle website field - it's an array in defi.json
          const websiteUrl = Array.isArray(dex.website) ? dex.website[0] : dex.website;
          // Use title field from defi.json instead of name
          const dexName = dex.title || dex.name;
          
          return (
            <div key={dex.id} className={styles.card}>
              <div className={styles.cardHeader}>
                {dex.logo ? (
                  <img
                    src={`/img/thumbnails/${dex.logo}`}
                    alt={`${dexName} logo`}
                    className={styles.logo}
                  />
                ) : (
                  <div className={styles.logoPlaceholder}></div>
                )}
                <h3 className={styles.cardName}>{dexName}</h3>
              </div>

              {/* Add description if available */}
              {dex.description && Array.isArray(dex.description) && dex.description[0] && (
                <div className={styles.cardDescription}>
                  <p>{dex.description[0]}</p>
                </div>
              )}

              {websiteUrl && (
                <div className={styles.cardFooter}>
                  <a
                    href={websiteUrl}
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
          );
        })}
      </div>
    </div>
  );
}



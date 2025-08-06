import React from 'react';
import assetsData from '@site/src/data/assets.json';
import ContributeNotice from '../ContributeNotice';
import styles from './styles.module.css';

export default function AssetsDirectory() {
  // Handle both wrapper format { data: [...] } and direct array format
  const assets = (assetsData.data || assetsData) || [];
  
  // Handle empty or malformed data
  if (!Array.isArray(assets) || assets.length === 0) {
    return (
      <div className={styles.gridContainer}>
        <p>No assets data available.</p>
      </div>
    );
  }
  
  // Helper function to get the asset logo or fallback to issuer logo
  const getAssetLogo = (asset) => {
    if (asset.logo) {
      return asset.logo;
    }
    // If no asset logo, find the first issuer with a logo
    if (asset.issuers && asset.issuers.length > 0) {
      const issuerWithLogo = asset.issuers.find(issuer => issuer.logo);
      return issuerWithLogo ? issuerWithLogo.logo : null;
    }
    return null;
  };
  
  return (
    <div>
      <ContributeNotice />
      <div className={styles.gridContainer}>
        {assets.map(asset => {
        const assetLogo = getAssetLogo(asset);
        
        return (
          <div key={asset.id} className={styles.card}>
            {asset.yield_bearing && (
              <div className={styles.tagContainer}>
                <span className={styles.tag}>Yield Bearing</span>
              </div>
            )}
            <div className={styles.cardHeader}>
              {assetLogo ? (
                <img
                  src={`/img/logos/${assetLogo}`}
                  alt={`${asset.name} logo`}
                  className={styles.logo}
                />
              ) : (
                <div className={styles.logoPlaceholder}></div>
              )}
              <h3 className={styles.assetName}>{asset.name}</h3>
            </div>
            <div className={styles.cardBody}>
              {asset.issuers && asset.issuers.length > 0 && (
                <div className={styles.infoRow}>
                  <strong>Issuer:</strong>
                  <div className={styles.issuersContainer}>
                    {asset.issuers.map((issuer, index) => (
                      <span key={issuer.name} className={styles.issuer}>
                        {issuer.logo && (
                          <img
                            src={`/img/logos/${issuer.logo}`}
                            alt={`${issuer.name} logo`}
                            className={styles.issuerLogo}
                          />
                        )}
                        {issuer.website ? (
                          <a
                            href={issuer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {issuer.name}
                          </a>
                        ) : (
                          issuer.name
                        )}
                        {index < asset.issuers.length - 1 && ','}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {asset.fiat_asset && (
                <div className={styles.infoRow}>
                  <strong>Anchored to:</strong> {asset.fiat_asset}
                </div>
              )}
            </div>
            <div className={styles.cardFooter}>
              {asset.website && (
                <a
                  href={`https://${asset.website}`}
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
              )}
              {asset.issuer_address && (
                <a
                  href={`https://stellar.expert/explorer/public/asset/${asset.name}-${asset.issuer_address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.detailsButton}
                >
                  View on Stellar.Expert
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
              )}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
} 
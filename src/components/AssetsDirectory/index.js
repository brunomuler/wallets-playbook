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
              {assetLogo && (
                <img
                  src={`/img/logos/${assetLogo}`}
                  alt={`${asset.name} logo`}
                  className={styles.logo}
                />
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
              {asset.website && (
                <div className={styles.infoRow}>
                  <strong>Website:</strong>{' '}
                  <a
                    href={`https://${asset.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.websiteLink}
                  >
                    {asset.website}
                  </a>
                </div>
              )}
            </div>
            {asset.issuer_address && (
              <div className={styles.cardFooter}>
                <a
                  href={`https://stellar.expert/explorer/public/asset/${asset.name}-${asset.issuer_address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.detailsLink}
                >
                  View Details on Stellar Expert
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
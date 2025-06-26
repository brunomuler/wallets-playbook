import React from 'react';
import assets from '@site/src/data/assets.json';
import styles from './styles.module.css';

export default function AssetsDirectory() {
  return (
    <div className={styles.gridContainer}>
      {assets.map(asset => (
        <div key={asset.id} className={styles.card}>
          {asset.yield_bearing && (
            <div className={styles.tagContainer}>
              <span className={styles.tag}>Yield Bearing</span>
            </div>
          )}
          <div className={styles.cardHeader}>
            {asset.logo && (
              <img
                src={asset.logo}
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
                          src={issuer.logo}
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
                <strong>Fiat Asset:</strong> {asset.fiat_asset}
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
      ))}
    </div>
  );
} 
import React, { useState } from 'react';
import assetsData from '@site/src/data-remote/assets.json';
import ContributeNotice from '../ContributeNotice';
import AssetInfoModal from '../AssetInfoModal';
import { getLogoUrl } from '@site/src/utils/imageMapper';
import styles from './styles.module.css';

export default function AssetsDirectory({ yieldBearingOnly = false }) {
  const [expandedIssuers, setExpandedIssuers] = useState({});
  const [modalData, setModalData] = useState({ isOpen: false, asset: null });
  
  // Helper functions for modal
  const openModal = (asset) => {
    setModalData({ isOpen: true, asset });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, asset: null });
  };

  const hasAssetInfo = (asset) => {
    return asset.description || asset.information;
  };
  
  // Helper function to generate initials from issuer name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };
  
  // Helper function to generate consistent color based on issuer name
  const getInitialsColor = (name) => {
    const lightColors = [
      '#E5E7EB', // gray-200
      '#E2E8F0', // slate-200
      '#E4E4E7', // zinc-200
      '#E5E5E5', // neutral-200
      '#E7E5E4', // stone-200
      '#DBEAFE', // blue-100
      '#D1FAE5', // emerald-100
      '#EDE9FE', // violet-100
    ];
    
    const darkColors = [
      '#6B7280', // gray-500
      '#64748B', // slate-500
      '#71717A', // zinc-500
      '#737373', // neutral-500
      '#78716C', // stone-500
      '#6B7280', // gray-500
      '#64748B', // slate-500
      '#71717A', // zinc-500
    ];
    
    // Create a simple hash from the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return {
      light: lightColors[Math.abs(hash) % lightColors.length],
      dark: darkColors[Math.abs(hash) % darkColors.length]
    };
  };
  
  // Handle both wrapper format { data: [...] } and direct array format
  const allAssets = (assetsData.data || assetsData) || [];
  
  // Filter assets based on yieldBearingOnly prop
  const assets = yieldBearingOnly 
    ? allAssets.filter(asset => asset.yield_bearing === true)
    : allAssets;
  
  // Handle empty or malformed data
  if (!Array.isArray(assets) || assets.length === 0) {
    return (
      <div className={styles.gridContainer}>
        <p>{yieldBearingOnly ? 'No yield-bearing assets data available.' : 'No assets data available.'}</p>
      </div>
    );
  }
  
  // Group assets by issuer
  const groupedByIssuer = assets.reduce((acc, asset) => {
    if (asset.issuers && asset.issuers.length > 0) {
      const issuer = asset.issuers[0]; // Take the first issuer
      const issuerKey = issuer.name;
      
      if (!acc[issuerKey]) {
        acc[issuerKey] = {
          issuer: issuer,
          assets: []
        };
      }
      
      acc[issuerKey].assets.push(asset);
    }
    return acc;
  }, {});
  
  // Convert to array and sort by issuer name
  const issuerGroups = Object.values(groupedByIssuer).sort((a, b) => 
    a.issuer.name.localeCompare(b.issuer.name)
  );
  
  return (
    <div>
      <ContributeNotice />
      <div className={styles.gridContainer}>
        {issuerGroups.map(group => {
          const { issuer, assets: issuerAssets } = group;
          
          const isExpanded = expandedIssuers[issuer.name] || false;
          const shouldShowCollapse = issuerAssets.length > 3;
          const assetsToShow = shouldShowCollapse && !isExpanded 
            ? issuerAssets.slice(0, 3) 
            : issuerAssets;
          
          const toggleExpanded = () => {
            setExpandedIssuers(prev => ({
              ...prev,
              [issuer.name]: !prev[issuer.name]
            }));
          };
          
          return (
            <div key={issuer.name} className={styles.card}>
              <div className={styles.cardHeader}>
                {issuer.logo ? (
                  <img
                    src={getLogoUrl(issuer.logo)}
                    alt={`${issuer.name} logo`}
                    className={styles.logo}
                  />
                ) : (
                  <div 
                    className={styles.initialsLogo}
                    style={{ 
                      '--light-bg': getInitialsColor(issuer.name).light,
                      '--dark-bg': getInitialsColor(issuer.name).dark
                    }}
                  >
                    {getInitials(issuer.name)}
                  </div>
                )}
                <div className={styles.issuerTitleContainer}>
                  <h3 className={styles.issuerName}>
                    {issuer.website ? (
                      <a
                        href={issuer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.titleLink}
                        title={`Visit ${issuer.name} website`}
                      >
{issuer.name}
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
                    ) : (
                      issuer.name
                    )}
                  </h3>
                  <p className={styles.assetCount}>
                    {yieldBearingOnly 
                      ? `${issuerAssets.length} yield-bearing asset${issuerAssets.length !== 1 ? 's' : ''}` 
                      : `${issuerAssets.length} asset${issuerAssets.length !== 1 ? 's' : ''}`
                    }
                  </p>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.assetsGrid}>
                  {assetsToShow.map(asset => {
                    return (
                      <div 
                        key={asset.id} 
                        className={`${styles.assetItem} ${styles.clickableAsset}`}
                        onClick={() => openModal(asset)}
                        title="Click to view asset information"
                      >
                        <div className={styles.assetItemInfo}>
                          <div className={styles.assetNameRow}>
                            <span className={styles.assetItemName}>{asset.name}</span>
                            {asset.fiat_asset && (
                              <span 
                                className={styles.fiatBadge}
                                data-tooltip={`Anchored to ${asset.fiat_asset}`}
                              >
                                {asset.fiat_asset}
                              </span>
                            )}
                          </div>
                          {asset.yield_bearing && (
                            <div className={styles.yieldBadgeRow}>
                              <span className={styles.yieldBadge}>Yield-Bearing</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {shouldShowCollapse && (
                  <button 
                    className={styles.collapseButton}
                    onClick={toggleExpanded}
                  >
                    {isExpanded ? (
                      <>
                        Show less
                        <svg
                          className={styles.collapseIcon}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 15l7-7 7 7"
                          />
                        </svg>
                      </>
                    ) : (
                      <>
                        Show {issuerAssets.length - 3} more asset{issuerAssets.length - 3 !== 1 ? 's' : ''}
                        <svg
                          className={styles.collapseIcon}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <AssetInfoModal 
        asset={modalData.asset} 
        isOpen={modalData.isOpen} 
        onClose={closeModal} 
      />
    </div>
  );
} 
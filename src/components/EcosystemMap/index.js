import React, { useState } from 'react';
import styles from './styles.module.css';

// Import data files
import exchangesData from '../../data/exchanges.json';
import rampsData from '../../data/ramps.json';
import defiData from '../../data/defi.json';
import bridgesData from '../../data/bridges.json';
import assetsData from '../../data/assets.json';
import cardsData from '../../data/cards.json';

// Process and organize the data
const processEcosystemData = () => {
  // Helper function to ensure URL has protocol
  const ensureHttps = (url) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // Process exchanges
  const exchanges = exchangesData.data
    .filter(item => item.name && item.website)
    .slice(0, 20) // Limit to first 20 for performance
    .map(item => ({
      name: item.name,
      type: item.type || "Exchange",
      url: ensureHttps(item.website),
      logo: item.logo
    }));

  // Process ramps
  const ramps = rampsData.data
    .filter(item => item.name && item.website)
    .slice(0, 20) // Limit to first 20 for performance
    .map(item => ({
      name: item.name,
      type: item.type || "Ramp",
      url: ensureHttps(item.website),
      logo: item.logo
    }));

  // Process DeFi protocols
  const defi = defiData.data
    .filter(item => item.title && item.website)
    .map(item => ({
      name: item.title,
      type: item.type || "DeFi Protocol",
      url: ensureHttps(item.website),
      description: item.description
    }));

  // Process bridges
  const bridges = bridgesData.data
    .filter(item => item.name && item.website)
    .map(item => ({
      name: item.name,
      type: item.type || "Bridge",
      url: ensureHttps(item.website),
      logo: item.logo
    }));

  // Process assets (top issuers)
  const assets = assetsData.data
    .filter(item => item.name && item.issuers && item.issuers.length > 0)
    .slice(0, 15) // Limit for display
    .map(item => ({
      name: item.name,
      type: `${item.fiat_asset || 'Digital'} Asset`,
      url: ensureHttps(item.website || item.home_domain),
      issuer: item.issuers[0]?.name
    }));

  // Process cards/applications
  const cards = cardsData.data
    .filter(item => item.name && item.website)
    .map(item => ({
      name: item.name,
      type: item.sub_type?.join(", ") || item.type,
      url: ensureHttps(item.website),
      logo: item.logo
    }));

  return {
    exchanges: {
      title: "Exchanges & Trading",
      color: "#2196F3",
      icon: "📈",
      items: exchanges
    },
    ramps: {
      title: "On/Off Ramps",
      color: "#FF9800",
      icon: "🌉",
      items: ramps
    },
    defi: {
      title: "DeFi Protocols",
      color: "#9C27B0",
      icon: "🏛️",
      items: defi
    },
    bridges: {
      title: "Bridges & Interop",
      color: "#E91E63",
      icon: "🔗",
      items: bridges
    },
    assets: {
      title: "Assets & Issuers",
      color: "#4CAF50",
      icon: "💰",
      items: assets
    },
    cards: {
      title: "Cards & Applications",
      color: "#607D8B",
      icon: "💳",
      items: cards
    }
  };
};

const ecosystemData = processEcosystemData();

export default function EcosystemMap() {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div className={styles.ecosystemMap}>
      <div className={styles.header}>
        <h2>Stellar Ecosystem Map</h2>
        <p>Explore the Stellar ecosystem - hover over items for details and click to visit websites</p>
      </div>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{backgroundColor: '#2196F3'}}></span>
          Exchanges & Trading
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{backgroundColor: '#FF9800'}}></span>
          On/Off Ramps
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{backgroundColor: '#9C27B0'}}></span>
          DeFi Protocols
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{backgroundColor: '#E91E63'}}></span>
          Bridges & Interop
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{backgroundColor: '#4CAF50'}}></span>
          Assets & Issuers
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{backgroundColor: '#607D8B'}}></span>
          Cards & Applications
        </div>
      </div>

      <div className={styles.mapContainer}>
        {Object.entries(ecosystemData).map(([categoryKey, category]) => (
          <div
            key={categoryKey}
            className={styles.categorySection}
            style={{ borderColor: category.color }}
          >
            <div
              className={styles.categoryHeader}
              style={{ backgroundColor: category.color }}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <h3>{category.title}</h3>
              <span className={styles.itemCount}>{category.items.length} services</span>
            </div>
            
            <div className={styles.itemsGrid}>
              {category.items.map((item, index) => (
                <div
                  key={index}
                  className={`${styles.ecosystemItem} ${hoveredItem === `${categoryKey}-${index}` ? styles.hovered : ''}`}
                  onMouseEnter={() => setHoveredItem(`${categoryKey}-${index}`)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => window.open(item.url, '_blank')}
                >
                  {item.logo && (
                    <div className={styles.itemLogo}>
                      <img src={`/img/logos/${item.logo}`} alt={item.name} />
                    </div>
                  )}
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemType}>
                    {item.type}
                    {item.issuer && <span className={styles.issuer}> • {item.issuer}</span>}
                  </div>
                  {hoveredItem === `${categoryKey}-${index}` && (
                    <div className={styles.itemTooltip}>
                      {item.description ? 
                        item.description.substring(0, 100) + (item.description.length > 100 ? '...' : '') :
                        `Click to visit ${item.name}`
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <p>
          <strong>Note:</strong> This ecosystem map represents a selection of key projects and services. 
          The Stellar ecosystem is constantly evolving with new projects and integrations.
        </p>
      </div>
    </div>
  );
} 
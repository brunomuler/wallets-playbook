import React from 'react';
import virtualAccountsData from '@site/src/data-remote/virtual-accounts.json';
import ContributeNotice from '../ContributeNotice';
import { getLogoUrl } from '@site/src/utils/imageMapper';
import styles from './styles.module.css';
import sharedStyles from '../shared/websiteButton.module.css';

export default function VirtualAccountsDirectory() {
  // Handle both wrapper format { data: [...] } and direct array format
  const virtualAccounts = (virtualAccountsData.data || virtualAccountsData) || [];
  
  // Handle empty or malformed data
  if (!Array.isArray(virtualAccounts) || virtualAccounts.length === 0) {
    return (
      <div className={styles.gridContainer}>
        <p>No virtual accounts data available.</p>
      </div>
    );
  }

  return (
    <div>
      <ContributeNotice />

      <div className={styles.gridContainer}>
        {virtualAccounts.map(account => (
          <div key={account.id} className={styles.card}>
            <div className={styles.cardHeader}>
              {account.logo ? (
                <img
                  src={getLogoUrl(account.logo)}
                  alt={`${account.name} logo`}
                  className={styles.logo}
                />
              ) : (
                <div className={styles.logoPlaceholder}></div>
              )}
              <div className={sharedStyles.nameContainer}>
                <h3 className={styles.cardName}>{account.name}</h3>
                {account.website && (
                  <a
                    href={account.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={sharedStyles.websiteLink}
                  >
                    Website
                    <svg
                      className={sharedStyles.externalIcon}
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
          </div>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import virtualAccountsData from '@site/src/data-remote/virtual-accounts.json';
import ContributeNotice from '../ContributeNotice';
import DirectoryCard from '../shared/DirectoryCard';
import DirectoryGrid from '../shared/DirectoryGrid';
import Logo from '../shared/Logo';
import ExternalLink from '../shared/ExternalLink';
import { useDirectoryData } from '../shared/dataUtils';
import styles from './styles.module.css';

export default function VirtualAccountsDirectory() {
  const { data: virtualAccounts, isValid, EmptyState } = useDirectoryData(
    virtualAccountsData, 
    'No virtual accounts data available.'
  );
  
  if (!isValid) {
    return (
      <div>
        <ContributeNotice />
        <EmptyState />
      </div>
    );
  }

  return (
    <div>
      <ContributeNotice />

      <DirectoryGrid>
        {virtualAccounts.map(account => (
          <DirectoryCard key={account.id}>
            <DirectoryCard.Header>
              <Logo 
                src={account.logo} 
                name={account.name}
                size="medium"
              />
              <div className={styles.nameContainer}>
                <h3 className={styles.cardName}>{account.name}</h3>
                <ExternalLink href={account.website} text="Website" />
              </div>
            </DirectoryCard.Header>
          </DirectoryCard>
        ))}
      </DirectoryGrid>
    </div>
  );
}
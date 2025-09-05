import React from 'react';
import keyManagementData from '@site/src/data-remote/key-management.json';
import ContributeNotice from '../ContributeNotice';
import DirectoryCard from '../shared/DirectoryCard';
import DirectoryGrid from '../shared/DirectoryGrid';
import Logo from '../shared/Logo';
import ExternalLink from '../shared/ExternalLink';
import { useDirectoryData } from '../shared/dataUtils';
import styles from './styles.module.css';

export default function KeyManagementDirectory() {
  const { data: keyManagementEntities, isValid, EmptyState } = useDirectoryData(
    keyManagementData, 
    'No key management entities available at this time.'
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
        {keyManagementEntities.map(entity => (
          <DirectoryCard key={entity.id}>
            <DirectoryCard.Header>
              <Logo 
                src={entity.logo} 
                name={entity.name}
                size="medium"
              />
              <div className={styles.nameContainer}>
                <h3 className={styles.cardName}>{entity.name}</h3>
                <ExternalLink href={entity.website} text="Website" />
              </div>
            </DirectoryCard.Header>
          </DirectoryCard>
        ))}
      </DirectoryGrid>
    </div>
  );
}

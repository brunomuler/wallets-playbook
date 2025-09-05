import React from 'react';
import dexDataRaw from '@site/src/data-remote/dex.json';
import ContributeNotice from '../ContributeNotice';
import DirectoryCard from '../shared/DirectoryCard';
import DirectoryGrid from '../shared/DirectoryGrid';
import Logo from '../shared/Logo';
import ExternalLink from '../shared/ExternalLink';
import { useDirectoryData } from '../shared/dataUtils';
import styles from './styles.module.css';

export default function DexDirectory() {
  const { data: dexes, isValid, EmptyState } = useDirectoryData(
    dexDataRaw, 
    'No DEX data available.'
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

      <DirectoryGrid columns="repeat(2, 1fr)">
        {dexes.map((dex) => (
          <DirectoryCard key={dex.id || dex.name}>
            <DirectoryCard.Header>
              <Logo 
                src={dex.logo} 
                name={dex.name}
                size="large"
              />
              <div className={styles.nameContainer}>
                <h3 className={styles.cardName}>{dex.name}</h3>
                <ExternalLink href={dex.website} text="Website" />
              </div>
            </DirectoryCard.Header>
          </DirectoryCard>
        ))}
      </DirectoryGrid>
    </div>
  );
}



import React from 'react';
import exchangesDataRaw from '@site/src/data-remote/exchanges.json';
import ContributeNotice from '../ContributeNotice';
import DirectoryCard from '../shared/DirectoryCard';
import DirectoryGrid from '../shared/DirectoryGrid';
import Logo from '../shared/Logo';
import ExternalLink from '../shared/ExternalLink';
import { useDirectoryData } from '../shared/dataUtils';
import styles from './styles.module.css';

export default function ExchangesDirectory() {
  const { data: exchanges, isValid, EmptyState } = useDirectoryData(
    exchangesDataRaw, 
    'No exchanges data available.'
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
        {exchanges.map(exchange => (
          <DirectoryCard key={exchange.id}>
            <DirectoryCard.Header>
              <Logo 
                src={exchange.logo} 
                name={exchange.name}
                size="large"
              />
              <div className={styles.nameContainer}>
                <h3 className={styles.exchangeName}>{exchange.name}</h3>
                <ExternalLink href={exchange.website} text="Website" />
              </div>
            </DirectoryCard.Header>
          </DirectoryCard>
        ))}
      </DirectoryGrid>
    </div>
  );
}
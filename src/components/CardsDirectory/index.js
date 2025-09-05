import React from 'react';
import cardsData from '@site/src/data-remote/cards.json';
import ContributeNotice from '../ContributeNotice';
import DirectoryCard from '../shared/DirectoryCard';
import DirectoryGrid from '../shared/DirectoryGrid';
import Logo from '../shared/Logo';
import ExternalLink from '../shared/ExternalLink';
import { useDirectoryData } from '../shared/dataUtils';
import styles from './styles.module.css';

export default function CardsDirectory() {
  const { data: cards, isValid, EmptyState } = useDirectoryData(
    cardsData, 
    'No cards data available.'
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
        {cards.map(card => (
          <DirectoryCard key={card.id}>
            <DirectoryCard.Header>
              <Logo 
                src={card.logo} 
                name={card.name}
                size="medium"
              />
              <div className={styles.nameContainer}>
                <h3 className={styles.cardName}>{card.name}</h3>
                <ExternalLink href={card.website} text="Website" />
              </div>
            </DirectoryCard.Header>
          </DirectoryCard>
        ))}
      </DirectoryGrid>
    </div>
  );
} 
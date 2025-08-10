import React from 'react';
import { FaGithub } from 'react-icons/fa';
import styles from './styles.module.css';

const ContributeNotice = () => {
  return (
    <div className={styles.contributeNotice}>
      <div className={styles.contributeContent}>
        <div className={styles.contributeText}>
          <strong>See something missing or incorrect?</strong>
          <a 
            href="https://github.com/brunomuler/wallets-playbook/pulls" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.contributeButton}
          >
            <FaGithub className={styles.buttonIcon} />
            Contribute on GitHub
          </a>
        </div>
      </div>
      <div className={styles.disclaimer}>
        <em>Note: This is not a comprehensive list and information may be incomplete or outdated.</em>
      </div>
    </div>
  );
};

export default ContributeNotice; 
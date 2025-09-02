import React, { useState } from 'react';
import { FaComment } from 'react-icons/fa';
import FeedbackModal from '../FeedbackModal';
import contributeStyles from '../ContributeNotice/styles.module.css';

const FeedbackButton = ({ className }) => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  return (
    <>
      <a 
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setIsFeedbackModalOpen(true);
        }}
        className={`${contributeStyles.contributeButton} ${className || ''}`}
      >
        <FaComment className={contributeStyles.buttonIcon} />
        Leave Feedback
      </a>
      
      <FeedbackModal 
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
};

export default FeedbackButton;
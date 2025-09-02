import { createRoot } from 'react-dom/client';
import React from 'react';
import FeedbackModal from '../components/FeedbackModal';

let isModalOpen = false;
let modalRoot = null;

function openModal() {
  if (!isModalOpen) {
    isModalOpen = true;
    const modalContainer = document.createElement('div');
    document.body.appendChild(modalContainer);
    modalRoot = createRoot(modalContainer);
    
    modalRoot.render(
      React.createElement(FeedbackModal, {
        isOpen: true,
        onClose: closeModal
      })
    );
  }
}

function closeModal() {
  if (isModalOpen && modalRoot) {
    isModalOpen = false;
    modalRoot.unmount();
    modalRoot = null;
    // Remove the modal container
    const modalContainers = document.querySelectorAll('body > div:last-child');
    const lastContainer = modalContainers[modalContainers.length - 1];
    if (lastContainer && lastContainer.querySelector('[class*="modalOverlay"]')) {
      lastContainer.remove();
    }
  }
}

function attachClickHandler() {
  const button = document.querySelector('.feedback-navbar-button');
  if (button && !button.dataset.handlerAttached) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
    button.dataset.handlerAttached = 'true';
  }
}

export function onRouteDidUpdate() {
  attachClickHandler();
}

// Also attach on initial load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setTimeout(attachClickHandler, 100);
  });
}
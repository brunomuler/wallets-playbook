// Add Iconify icons to sidebar categories and pages using the span approach like in footer
// Define the icon mappings for each category
const categoryIcons = {
  'category-wallets': 'heroicons--wallet',
  'category-tokens': 'heroicons--currency-dollar', 
  'category-ramps': 'heroicons--arrows-up-down',
  'category-exchanges': 'heroicons--chart-bar',
  'category-tradfi': 'heroicons--building-library',
  'category-defi': 'heroicons--squares-2x2',
  'category-yield': 'heroicons--chart-pie',
  'category-disbursements': 'heroicons--paper-airplane',
  'category-programs': 'heroicons--wallet'
};

// Define icon mappings for first-level pages (by page slug/path)
const pageIcons = {
  'programs-for-builders': 'heroicons--rocket-launch'
};

function addIconsToSidebar() {
  // Find all category items
  Object.entries(categoryIcons).forEach(([className, iconName]) => {
    const categoryElement = document.querySelector(`.theme-doc-sidebar-item-category-level-1.${className} > .menu__list-item-collapsible > .menu__link`);
    
    if (categoryElement && !categoryElement.querySelector('.sidebar-category-icon')) {
      // Create icon element using span like in footer
      const iconElement = document.createElement('span');
      iconElement.className = `icon-[${iconName}] sidebar-category-icon`;
      iconElement.style.display = 'inline-block';
      iconElement.style.width = '16px';
      iconElement.style.height = '16px';
      iconElement.style.marginRight = '8px';
      iconElement.style.verticalAlign = 'middle';
      
      // Insert icon at the beginning of the link
      categoryElement.insertBefore(iconElement, categoryElement.firstChild);
    }
  });

  // Find all first-level page items
  Object.entries(pageIcons).forEach(([pageSlug, iconName]) => {
    // Try multiple possible selectors for first-level pages
    const pageSelectors = [
      `a.menu__link[href="/${pageSlug}"]`,
      `a.menu__link[href="/${pageSlug}/"]`,
      `.theme-doc-sidebar-item-link a[href="/${pageSlug}"]`,
      `.theme-doc-sidebar-item-link a[href="/${pageSlug}/"]`
    ];
    
    for (const selector of pageSelectors) {
      const pageElement = document.querySelector(selector);
      if (pageElement && !pageElement.querySelector('.sidebar-page-icon')) {
        // Create icon element
        const iconElement = document.createElement('span');
        iconElement.className = `icon-[${iconName}] sidebar-page-icon`;
        iconElement.style.display = 'inline-block';
        iconElement.style.width = '16px';
        iconElement.style.height = '16px';
        iconElement.style.marginRight = '8px';
        iconElement.style.verticalAlign = 'middle';
        
        // Insert icon at the beginning of the link
        pageElement.insertBefore(iconElement, pageElement.firstChild);
        break; // Found and processed, no need to try other selectors
      }
    }
  });
}

// Run when DOM is loaded
if (typeof window !== 'undefined') {
  // Initial load
  document.addEventListener('DOMContentLoaded', addIconsToSidebar);
  
  // Also run after navigation (for SPA routing)
  let timeoutId;
  const observer = new MutationObserver(() => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(addIconsToSidebar, 100);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });
}
// Structured data for Stellar Wallet Playbook
// This script adds JSON-LD structured data to improve SEO

function addStructuredData() {
  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Stellar Wallet Playbook",
    "url": "https://stellarplaybook.com",
    "description": "A comprehensive guide for wallet builders on Stellar network",
    "sameAs": [
      "https://github.com/brunomuler/wallets-playbook"
    ]
  };

  // Website schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Stellar Wallet Playbook",
    "url": "https://stellarplaybook.com",
    "description": "A comprehensive guide for wallet builders on Stellar. Learn about Classic vs Smart Wallets, custody models, key management, DeFi integrations, and best practices.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://stellarplaybook.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // TechArticle schema for documentation pages
  if (window.location.pathname !== '/' && !window.location.pathname.includes('/search')) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": document.title,
      "description": document.querySelector('meta[name="description"]')?.content || "",
      "author": {
        "@type": "Organization",
        "name": "Stellar Wallet Playbook"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Stellar Wallet Playbook"
      },
      "url": window.location.href,
      "datePublished": "2024-01-01",
      "dateModified": new Date().toISOString().split('T')[0]
    };

    addSchema('article-schema', articleSchema);
  }

  // Add schemas to page
  addSchema('organization-schema', organizationSchema);
  addSchema('website-schema', websiteSchema);
}

function addSchema(id, schema) {
  // Remove existing schema if present
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Create new script element
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

// Run when DOM is loaded and ensure we don't conflict with other scripts
function initStructuredData() {
  // Small delay to ensure other scripts (like gtag) have loaded
  setTimeout(addStructuredData, 100);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStructuredData);
} else {
  initStructuredData();
}

// Re-run on route changes (for SPA navigation)
if (typeof window !== 'undefined') {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(addStructuredData, 100); // Small delay to ensure content is loaded
    }
  }).observe(document, { subtree: true, childList: true });
}
const { fetchRemoteData } = require('../scripts/fetch-remote-data-authenticated');
const path = require('path');

/**
 * Docusaurus plugin to fetch remote data before build
 */
function fetchRemoteDataPlugin(context, options) {
  return {
    name: 'fetch-remote-data-plugin',
    
    async loadContent() {
      console.log('🔄 Fetching remote data for build...');
      
      try {
        const success = await fetchRemoteData();
        if (!success) {
          console.warn('⚠️  Remote data fetch failed, using local fallback');
        }
        
        return { success };
      } catch (error) {
        console.error('❌ Plugin failed to fetch remote data:', error);
        throw error;
      }
    },
    
    async contentLoaded({ content, actions }) {
      const { success } = content;
      
      if (success) {
        console.log('✅ Remote data fetching completed');
      } else {
        console.log('🔄 Using local data fallback');
      }
    },
    
    configureWebpack(config, isServer, utils) {
      // Add alias for data-remote directory
      return {
        resolve: {
          alias: {
            '@site/src/data-remote': path.resolve(context.siteDir, 'src/data-remote'),
          },
        },
      };
    }
  };
}

module.exports = fetchRemoteDataPlugin;

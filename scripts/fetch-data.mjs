import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your R2 public development URL
const R2_BASE_URL = 'https://pub-983fe765e6bf4e04957f078cd2eb8d1a.r2.dev';

async function fetchDataFromR2() {
  const files = ['assets.json', 'ramps.json', 'exchanges.json', 'defi.json'];
  
  const outputDir = path.join(__dirname, '../src/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`🔄 Fetching data from R2: ${R2_BASE_URL}`);

  for (const file of files) {
    try {
      console.log(`📥 Fetching ${file}...`);
      
      const response = await fetch(`${R2_BASE_URL}/${file}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Extract just the data array for backward compatibility
      // (since the new format wraps data with metadata)
      const outputData = data.data || data;
      
      fs.writeFileSync(
        path.join(outputDir, file),
        JSON.stringify(outputData, null, 2)
      );
      
      const count = Array.isArray(outputData) ? outputData.length : 'N/A';
      const generatedAt = data.metadata?.generatedAt || 'Unknown';
      
      console.log(`✅ ${file} downloaded (${count} items, generated: ${generatedAt})`);
    } catch (error) {
      console.error(`❌ Failed to fetch ${file}:`, error);
      
      // Create empty file to prevent build failures
      fs.writeFileSync(
        path.join(outputDir, file),
        JSON.stringify([], null, 2)
      );
      
      console.log(`⚠️  Created empty ${file} as fallback`);
    }
  }
  
  console.log('🎉 Data fetch completed!');
}

// Allow running as standalone script
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchDataFromR2().catch(error => {
    console.error('❌ Fetch process failed:', error);
    process.exit(1);
  });
}

export { fetchDataFromR2 }; 
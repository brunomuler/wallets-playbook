#!/usr/bin/env node

// Load environment variables from .env file
require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { fromEnv } = require('@aws-sdk/credential-provider-env');

// Manifest will be fetched from R2 using authenticated access
const MANIFEST_KEY = 'manifest.json';
const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const TEMP_DATA_DIR = path.join(__dirname, '..', 'src', 'data-remote');

// R2 Configuration - support multiple environment variable names
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || process.env.CLOUDFLARE_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || process.env.CLOUDFLARE_BUCKET_NAME || 'wallets-playbook';

/**
 * Check if R2 credentials are available
 */
function hasR2Credentials() {
  return R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY;
}

/**
 * Create S3 client for Cloudflare R2
 */
function createR2Client() {
  if (!hasR2Credentials()) {
    throw new Error('R2 credentials not found in environment variables');
  }

  return new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}



/**
 * Fetch data from R2 using authenticated S3 API
 */
async function fetchFromR2(s3Client, key) {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    const body = await response.Body.transformToString();
    return JSON.parse(body);
  } catch (error) {
    throw new Error(`Failed to fetch ${key} from R2: ${error.message}`);
  }
}

/**
 * Create directory if it doesn't exist
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Write JSON data to file with pretty formatting
 */
function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * Create image URL mapper configuration
 */
function createImageMapper(manifest) {
  const imageMap = {};
  const PUBLIC_R2_BASE_URL = 'https://pub-983fe765e6bf4e04957f078cd2eb8d1a.r2.dev';
  
  // Process static assets (images) - use public URLs since authenticated URLs aren't accessible via HTTP
  manifest.staticAssets.forEach(asset => {
    const key = asset.key.replace('static/', ''); // Remove 'static/' prefix
    // Use public R2.dev URLs for images since they're accessible
    const publicUrl = `${PUBLIC_R2_BASE_URL}/${asset.key}`;
    imageMap[key] = publicUrl;
  });

  return {
    baseUrl: PUBLIC_R2_BASE_URL,
    imageMap,
    authenticated: false, // Images use public URLs
    generatedAt: new Date().toISOString()
  };
}

/**
 * Main function to fetch all remote data
 */
async function fetchRemoteData() {
  try {
    console.log('🚀 Fetching remote data using authenticated R2 access...');
    
    // Check if we have R2 credentials
    if (!hasR2Credentials()) {
      throw new Error('R2 credentials not found. Please set CLOUDFLARE_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables.');
    }

    console.log('🔐 Using authenticated R2 access');

    // Initialize R2 client
    const s3Client = createR2Client();
    console.log('✅ R2 client initialized successfully');

    // Fetch the manifest from R2
    console.log('📋 Fetching manifest from R2...');
    const manifest = await fetchFromR2(s3Client, MANIFEST_KEY);
    console.log(`📋 Manifest loaded with ${manifest.dataFiles.length} data files and ${manifest.staticAssets.length} static assets`);

    // Ensure directories exist
    ensureDir(TEMP_DATA_DIR);

    // Fetch each data file
    console.log('📥 Fetching data files...');
    for (const dataFile of manifest.dataFiles) {
      console.log(`  - Fetching ${dataFile.category}...`);
      
      try {
        console.log(`    Using authenticated R2 access for ${dataFile.key}`);
        const data = await fetchFromR2(s3Client, dataFile.key);
        
        const fileName = `${dataFile.category}.json`;
        const filePath = path.join(TEMP_DATA_DIR, fileName);
        
        writeJsonFile(filePath, data);
        console.log(`  ✅ Saved ${fileName} (${data.data ? data.data.length : 'unknown'} items)`);
      } catch (error) {
        console.error(`  ❌ Failed to fetch ${dataFile.category}: ${error.message}`);
        
        // Try to use local fallback if it exists
        const localPath = path.join(DATA_DIR, `${dataFile.category}.json`);
        if (fs.existsSync(localPath)) {
          const localData = JSON.parse(fs.readFileSync(localPath, 'utf8'));
          const fallbackPath = path.join(TEMP_DATA_DIR, `${dataFile.category}.json`);
          writeJsonFile(fallbackPath, localData);
          console.log(`  🔄 Used local fallback for ${dataFile.category}`);
        }
      }
    }

    // Create image mapper configuration
    console.log('🖼️  Creating image URL mapper...');
    const imageMapper = createImageMapper(manifest);
    const imageMapperPath = path.join(TEMP_DATA_DIR, 'image-mapper.json');
    writeJsonFile(imageMapperPath, imageMapper);

    // Save manifest for reference
    const manifestPath = path.join(TEMP_DATA_DIR, 'manifest.json');
    writeJsonFile(manifestPath, manifest);

    console.log('✅ All remote data fetched successfully!');
    console.log(`📁 Data saved to: ${TEMP_DATA_DIR}`);
    console.log('🔐 Used authenticated access for original Cloudflare URLs');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to fetch remote data:', error.message);
    
    // Check if we have local data as fallback
    if (fs.existsSync(DATA_DIR)) {
      console.log('🔄 Falling back to local data...');
      
      ensureDir(TEMP_DATA_DIR);
      
      // Copy local data files to temp directory
      const localFiles = fs.readdirSync(DATA_DIR).filter(file => file.endsWith('.json'));
      for (const file of localFiles) {
        const srcPath = path.join(DATA_DIR, file);
        const destPath = path.join(TEMP_DATA_DIR, file);
        fs.copyFileSync(srcPath, destPath);
        console.log(`  📋 Copied ${file}`);
      }
      
      // Create a basic image mapper for local images
      const localImageMapper = {
        baseUrl: '/img',
        imageMap: {},
        authenticated: false,
        generatedAt: new Date().toISOString(),
        fallback: true
      };
      writeJsonFile(path.join(TEMP_DATA_DIR, 'image-mapper.json'), localImageMapper);
      
      console.log('✅ Local fallback data prepared');
      return true;
    }
    
    return false;
  }
}

// Run the script if called directly
if (require.main === module) {
  fetchRemoteData()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { fetchRemoteData };

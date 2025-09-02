import imageMapperData from '@site/src/data-remote/image-mapper.json';

/**
 * Get the full URL for an image from either Cloudflare or local fallback
 * @param {string} imagePath - The relative image path (e.g., "logos/partners/allbridge.png")
 * @param {string} category - The image category (e.g., "logos", "thumbnails")
 * @returns {string} - The full URL to the image
 */
export function getImageUrl(imagePath, category = 'logos') {
  if (!imagePath) return '';
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  // Remove "img/" prefix if present (since our paths in the data don't include it)
  const normalizedPath = cleanPath.startsWith('img/') ? cleanPath.substring(4) : cleanPath;
  
  // Add category prefix if not already present
  const fullPath = normalizedPath.startsWith(`${category}/`) ? normalizedPath : `${category}/${normalizedPath}`;
  
  // Check if we have a mapped URL for this image
  if (imageMapperData.imageMap && imageMapperData.imageMap[`img/${fullPath}`]) {
    return imageMapperData.imageMap[`img/${fullPath}`];
  }
  
  // Fallback to local image if no mapping found
  if (imageMapperData.fallback) {
    return `/img/${fullPath}`;
  }
  
  // If we have a base URL but no specific mapping, try constructing the URL
  if (imageMapperData.baseUrl && imageMapperData.baseUrl !== '/img') {
    return `${imageMapperData.baseUrl}/static/img/${fullPath}`;
  }
  
  // Final fallback to local
  return `/img/${fullPath}`;
}

/**
 * Get the logo URL for a partner/issuer
 * @param {string} logoPath - The logo path from the data (e.g., "partners/allbridge.png" or "assets/usdc.png")
 * @returns {string} - The full URL to the logo
 */
export function getLogoUrl(logoPath) {
  if (!logoPath) return '';
  
  // Handle Airtable URLs - extract just the filename before the parenthesis
  if (logoPath.includes('(https://dl.airtable.com/')) {
    const filename = logoPath.split(' (')[0];
    // Skip invalid filenames
    if (!filename || filename.includes('Frame')) {
      return '';
    }
    logoPath = filename;
  }
  
  // Handle both "partners/allbridge.png" and "logos/partners/allbridge.png" formats
  const normalizedPath = logoPath.startsWith('logos/') ? logoPath : `logos/${logoPath}`;
  
  return getImageUrl(normalizedPath);
}

/**
 * Get the thumbnail URL
 * @param {string} thumbnailPath - The thumbnail path from the data
 * @returns {string} - The full URL to the thumbnail
 */
export function getThumbnailUrl(thumbnailPath) {
  if (!thumbnailPath) return '';
  
  // Handle both "thumbnails/defi/blend.png" and "img/thumbnails/defi/blend.png" formats
  const normalizedPath = thumbnailPath.startsWith('thumbnails/') ? thumbnailPath : `thumbnails/${thumbnailPath}`;
  
  return getImageUrl(normalizedPath, 'thumbnails');
}

export default {
  getImageUrl,
  getLogoUrl,
  getThumbnailUrl
};

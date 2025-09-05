/**
 * Normalizes data from various formats (wrapper vs direct array)
 * @param {Object|Array} rawData - The raw data to normalize
 * @returns {Array} - Normalized array of data
 */
export const normalizeData = (rawData) => {
  return (rawData?.data || rawData) || [];
};

/**
 * Checks if data is valid and not empty
 * @param {Array} data - The data array to validate
 * @returns {boolean} - Whether the data is valid
 */
export const isValidData = (data) => {
  return Array.isArray(data) && data.length > 0;
};

/**
 * Hook for common data normalization pattern used in directory components
 * @param {Object|Array} rawData - The raw data to normalize
 * @param {string} emptyMessage - Message to show when no data is available
 * @returns {Object} - Object containing normalized data, isValid flag, and error component
 */
export const useDirectoryData = (rawData, emptyMessage = 'No data available.') => {
  const normalizedData = normalizeData(rawData);
  const isValid = isValidData(normalizedData);
  
  const EmptyState = () => (
    <div>
      <p>{emptyMessage}</p>
    </div>
  );
  
  return {
    data: normalizedData,
    isValid,
    EmptyState
  };
};
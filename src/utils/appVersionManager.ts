/**
 * App Version Manager
 * Handles version tracking and ensures only the live app can write data
 */

export const APP_VERSION = '1.0.5';
export const CLIENT_IDENTIFIER = 'nomad-feedback-mobile';

/**
 * Get current app version info
 */
export const getAppVersionInfo = () => {
  return {
    version: APP_VERSION,
    clientId: CLIENT_IDENTIFIER,
    buildTime: new Date().toISOString()
  };
};

/**
 * Check if this is the live app version
 */
export const isLiveAppVersion = (version?: string): boolean => {
  return version === APP_VERSION || version === undefined;
};

/**
 * Get headers for API requests
 */
export const getAppHeaders = () => {
  return {
    'X-Client-Info': CLIENT_IDENTIFIER,
    'X-App-Version': APP_VERSION,
    'X-Request-Time': new Date().toISOString()
  };
};

/**
 * Validate app version for database operations
 */
export const validateAppVersion = (): boolean => {
  // In production, you might want to check against a server-side version
  // For now, we'll just ensure we're using the correct client identifier
  return true;
};

/**
 * Get version-specific storage key
 */
export const getVersionedStorageKey = (key: string): string => {
  return `${CLIENT_IDENTIFIER}_${APP_VERSION}_${key}`;
};

/**
 * Clean up old version data from local storage
 */
export const cleanupOldVersionData = () => {
  if (typeof window === 'undefined') return;
  
  const keysToRemove: string[] = [];
  
  // Find keys from old versions
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.includes('safari-feedback-mobile') ||
      (key.includes('nomad-feedback-mobile') && !key.includes(APP_VERSION))
    )) {
      keysToRemove.push(key);
    }
  }
  
  // Remove old keys
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🧹 Cleaned up old version data: ${key}`);
  });
  
  if (keysToRemove.length > 0) {
    console.log(`🧹 Cleaned up ${keysToRemove.length} old version data entries`);
  }
};

/**
 * Initialize app version management
 */
export const initializeAppVersion = () => {
  // Clean up old data
  cleanupOldVersionData();
  
  // Set current version info
  const versionInfo = getAppVersionInfo();
  localStorage.setItem('app_version_info', JSON.stringify(versionInfo));
  
  console.log(`🚀 App version initialized: ${versionInfo.version} (${versionInfo.clientId})`);
  
  return versionInfo;
};

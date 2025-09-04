import { useState, useEffect } from 'react';

export interface AppInfo {
  isNativeApp: boolean;
  platform: 'web' | 'ios' | 'android';
  version: string;
}

export const useAppInfo = (): AppInfo => {
  const [appInfo, setAppInfo] = useState<AppInfo>({
    isNativeApp: false,
    platform: 'web',
    version: '1.0.0'
  });

  useEffect(() => {
    const checkPlatform = async () => {
      // Check if running in Capacitor
      const isCapacitor = !!(window as any).Capacitor;
      
      if (isCapacitor) {
        try {
          const { Device } = await import('@capacitor/device');
          const info = await Device.getInfo();
          
          setAppInfo({
            isNativeApp: true,
            platform: info.platform as 'ios' | 'android',
            version: '1.0.0' // You can get this from package.json or Capacitor config
          });
        } catch (error) {
          console.log('Device info not available:', error);
          setAppInfo({
            isNativeApp: true,
            platform: 'android', // fallback
            version: '1.0.0'
          });
        }
      }
    };

    checkPlatform();
  }, []);

  return appInfo;
};
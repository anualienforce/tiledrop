import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tpgames.tiledrop',
  appName: 'TileDrop',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  }
};

export default config;

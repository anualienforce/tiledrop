import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tpgames.tiledrop',
  appName: 'TileDrop',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
	url: 'http://192.168.196.249:5000', // or :3000 if you changed it
    cleartext: true,  
  }
};

export default config;

import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdMobRewardItem, RewardAdOptions } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Google's test ad unit IDs
const TEST_AD_UNITS = {
  banner: {
    android: 'ca-app-pub-3940256099942544/6300978111',
    ios: 'ca-app-pub-3940256099942544/2934735716',
  },
  interstitial: {
    android: 'ca-app-pub-3940256099942544/1033173712',
    ios: 'ca-app-pub-3940256099942544/4411468910',
  },
  rewarded: {
    android: 'ca-app-pub-3940256099942544/5224354917',
    ios: 'ca-app-pub-3940256099942544/1712485313',
  }
};

// Production ad unit IDs (commented out - using test IDs)
// const PRODUCTION_AD_UNITS = {
//   banner: {
//     android: 'ca-app-pub-3742022551288656/1027602327',
//     ios: 'ca-app-pub-3742022551288656/1027602327',
//   },
//   interstitial: {
//     android: 'ca-app-pub-3742022551288656/2888189346',
//     ios: 'ca-app-pub-3742022551288656/2888189346',
//   },
//   rewarded: {
//     android: 'ca-app-pub-3742022551288656/8798265226',
//     ios: 'ca-app-pub-3742022551288656/8798265226',
//   }
// };

// Using TEST ad unit IDs (switch to PRODUCTION_AD_UNITS for release)
const AD_UNITS = {
  banner: {
    android: import.meta.env.VITE_ADMOB_ANDROID_BANNER || TEST_AD_UNITS.banner.android,
    ios: import.meta.env.VITE_ADMOB_IOS_BANNER || TEST_AD_UNITS.banner.ios,
  },
  interstitial: {
    android: import.meta.env.VITE_ADMOB_ANDROID_INTERSTITIAL || TEST_AD_UNITS.interstitial.android,
    ios: import.meta.env.VITE_ADMOB_IOS_INTERSTITIAL || TEST_AD_UNITS.interstitial.ios,
  },
  rewarded: {
    android: import.meta.env.VITE_ADMOB_ANDROID_REWARDED || TEST_AD_UNITS.rewarded.android,
    ios: import.meta.env.VITE_ADMOB_IOS_REWARDED || TEST_AD_UNITS.rewarded.ios,
  }
};

class AdMobService {
  private isInitialized = false;
  private isMobile = Capacitor.isNativePlatform();

  async initialize(): Promise<void> {
    console.log('AdMob initialize called - isNativePlatform:', this.isMobile, 'Platform:', Capacitor.getPlatform());
    
    if (!this.isMobile || this.isInitialized) {
      console.log('AdMob initialization skipped - isMobile:', this.isMobile, 'isInitialized:', this.isInitialized);
      return;
    }

    try {
      // Detect test mode by comparing resolved ad IDs against test IDs
      // This works both in dev (with env vars) and in production builds (with baked values)
      const usingTestIds = 
        AD_UNITS.banner.android === TEST_AD_UNITS.banner.android &&
        AD_UNITS.banner.ios === TEST_AD_UNITS.banner.ios &&
        AD_UNITS.interstitial.android === TEST_AD_UNITS.interstitial.android &&
        AD_UNITS.interstitial.ios === TEST_AD_UNITS.interstitial.ios &&
        AD_UNITS.rewarded.android === TEST_AD_UNITS.rewarded.android &&
        AD_UNITS.rewarded.ios === TEST_AD_UNITS.rewarded.ios;

      console.log('Initializing AdMob with:', {
        usingTestIds,
        platform: Capacitor.getPlatform(),
        bannerAdId: Capacitor.getPlatform() === 'ios' ? AD_UNITS.banner.ios : AD_UNITS.banner.android
      });

      // Automatically use test mode only when all IDs match Google's test IDs
      await AdMob.initialize({
        testingDevices: usingTestIds ? ['YOUR_DEVICE_ID'] : [],
        initializeForTesting: usingTestIds,
      });
      
      this.isInitialized = true;
      console.log(`AdMob initialized successfully using ${usingTestIds ? 'TEST' : 'PRODUCTION'} ad IDs`);
    } catch (error) {
      console.error('AdMob initialization failed:', error);
    }
  }

  async showBanner(): Promise<void> {
    if (!this.isMobile) {
      console.log('showBanner skipped - not a native platform');
      return;
    }

    const platform = Capacitor.getPlatform();
    const adId = platform === 'ios' ? AD_UNITS.banner.ios : AD_UNITS.banner.android;

    const options: BannerAdOptions = {
      adId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
    };

    console.log('Attempting to show banner ad:', { platform, adId, isInitialized: this.isInitialized });

    try {
      await AdMob.showBanner(options);
      console.log('Banner ad shown successfully');
    } catch (error) {
      console.error('Failed to show banner ad:', error);
    }
  }

  async hideBanner(): Promise<void> {
    if (!this.isMobile) return;

    try {
      await AdMob.hideBanner();
      console.log('Banner ad hidden');
    } catch (error) {
      console.error('Failed to hide banner ad:', error);
    }
  }

  async removeBanner(): Promise<void> {
    if (!this.isMobile) return;

    try {
      await AdMob.removeBanner();
      console.log('Banner ad removed');
    } catch (error) {
      console.error('Failed to remove banner ad:', error);
    }
  }

  async showInterstitial(): Promise<void> {
    if (!this.isMobile) return;

    const platform = Capacitor.getPlatform();
    const adId = platform === 'ios' ? AD_UNITS.interstitial.ios : AD_UNITS.interstitial.android;

    try {
      await AdMob.prepareInterstitial({ adId });
      await AdMob.showInterstitial();
      console.log('Interstitial ad shown');
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
    }
  }

  async showRewardedAd(): Promise<AdMobRewardItem | null> {
    if (!this.isMobile) {
      // Return null on web to trigger the simulated ad countdown in ReviveAd component
      return null;
    }

    const platform = Capacitor.getPlatform();
    const adId = platform === 'ios' ? AD_UNITS.rewarded.ios : AD_UNITS.rewarded.android;

    const options: RewardAdOptions = {
      adId,
    };

    try {
      await AdMob.prepareRewardVideoAd(options);
      const result = await AdMob.showRewardVideoAd();
      console.log('Rewarded ad shown, reward:', result);
      return result;
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      return null;
    }
  }
}

export const adMobService = new AdMobService();

# TileDrop - Ads Integration Guide

## 🎯 Overview

This guide will help you add ads to TileDrop for monetization. The best ad network for mobile games is **Google AdMob**, which works seamlessly with React Native/Expo apps.

---

## 📊 Recommended Ad Strategy for TileDrop

### **1. Rewarded Video Ads** (Highest Priority) ✨
- **Where to use**: Game Over screen - "Watch ad to revive"
- **Benefit**: Players get a second chance, you get revenue
- **Revenue**: $5-15 CPM (per 1000 views)
- **User experience**: Positive - players choose to watch

### **2. Interstitial Ads** (Medium Priority)
- **Where to use**: Between games (after game over, before new game)
- **Benefit**: High visibility, good revenue
- **Revenue**: $3-10 CPM
- **User experience**: Slightly intrusive but acceptable if not too frequent
- **Frequency**: Every 3-5 games maximum

### **3. Banner Ads** (Low Priority)
- **Where to use**: Bottom of gameplay screen (non-intrusive)
- **Benefit**: Constant passive revenue
- **Revenue**: $0.50-2 CPM
- **User experience**: Low impact but always visible

---

## 🚀 Step-by-Step Integration

### Step 1: Create AdMob Account (15 minutes)

1. Go to https://admob.google.com
2. Sign in with Google account
3. Click "Get Started"
4. Create your app:
   - **App name**: TileDrop
   - **Platform**: iOS and Android (create both)
   - **App Store URL**: Will add later after publishing

5. Create Ad Units for each ad type:

**For iOS App:**
- Rewarded Ad Unit: "TileDrop iOS Rewarded"
- Interstitial Ad Unit: "TileDrop iOS Interstitial"
- Banner Ad Unit: "TileDrop iOS Banner"

**For Android App:**
- Rewarded Ad Unit: "TileDrop Android Rewarded"
- Interstitial Ad Unit: "TileDrop Android Interstitial"
- Banner Ad Unit: "TileDrop Android Banner"

6. Copy all Ad Unit IDs (you'll need these later)

---

### Step 2: Install AdMob Package (5 minutes)

In your Expo project, install the AdMob package:

```bash
npx expo install expo-ads-admob
```

Or if using newer Expo SDK (48+):

```bash
npx expo install react-native-google-mobile-ads
```

---

### Step 3: Configure AdMob IDs (10 minutes)

**Update `app.json`:**

```json
{
  "expo": {
    "name": "TileDrop",
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
          "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX"
        }
      ]
    ]
  }
}
```

Replace the app IDs with your AdMob App IDs from Step 1.

---

### Step 4: Create Ad Hook (20 minutes)

Create `client/src/hooks/useAds.tsx`:

```tsx
import { useEffect, useState } from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  InterstitialAd,
  AdEventType,
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

// REPLACE WITH YOUR ACTUAL AD UNIT IDs BEFORE PUBLISHING
const REWARDED_AD_UNIT_ID = __DEV__ 
  ? TestIds.REWARDED 
  : Platform.OS === 'ios' 
    ? 'ca-app-pub-XXXXX/YYYYY' // Your iOS rewarded ad unit
    : 'ca-app-pub-XXXXX/YYYYY'; // Your Android rewarded ad unit

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.OS === 'ios'
    ? 'ca-app-pub-XXXXX/YYYYY' // Your iOS interstitial ad unit
    : 'ca-app-pub-XXXXX/YYYYY'; // Your Android interstitial ad unit

export function useAds() {
  const [rewardedAdLoaded, setRewardedAdLoaded] = useState(false);
  const [interstitialAdLoaded, setInterstitialAdLoaded] = useState(false);
  
  const rewardedAd = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID);
  const interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);

  useEffect(() => {
    // Load rewarded ad
    const unsubscribeRewardedLoaded = rewardedAd.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setRewardedAdLoaded(true)
    );

    const unsubscribeRewardedEarned = rewardedAd.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        console.log('User earned reward:', reward);
      }
    );

    // Load interstitial ad
    const unsubscribeInterstitialLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => setInterstitialAdLoaded(true)
    );

    // Start loading ads
    rewardedAd.load();
    interstitialAd.load();

    return () => {
      unsubscribeRewardedLoaded();
      unsubscribeRewardedEarned();
      unsubscribeInterstitialLoaded();
    };
  }, []);

  const showRewardedAd = async (onRewarded: () => void) => {
    if (rewardedAdLoaded) {
      rewardedAd.show();
      
      const unsubscribe = rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
          onRewarded();
          unsubscribe();
          // Load next ad
          rewardedAd.load();
        }
      );
    } else {
      console.log('Rewarded ad not loaded yet');
    }
  };

  const showInterstitialAd = async () => {
    if (interstitialAdLoaded) {
      interstitialAd.show();
      // Load next ad after showing
      interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        interstitialAd.load();
      });
    } else {
      console.log('Interstitial ad not loaded yet');
    }
  };

  return {
    showRewardedAd,
    showInterstitialAd,
    rewardedAdLoaded,
    interstitialAdLoaded,
  };
}
```

---

### Step 5: Integrate Into Game (30 minutes)

**A. Add Rewarded Ad for Revival**

Update your `GameOver.tsx` component:

```tsx
import { useAds } from '../hooks/useAds';

export function GameOver({ onRevive, hasUsedRevive, ...otherProps }) {
  const { showRewardedAd, rewardedAdLoaded } = useAds();
  
  const handleWatchAdToRevive = () => {
    showRewardedAd(() => {
      // Ad watched successfully - revive the player
      onRevive();
    });
  };

  return (
    <div className="game-over-modal">
      {/* ... existing code ... */}
      
      {!hasUsedRevive && rewardedAdLoaded && (
        <button 
          className="watch-ad-button"
          onClick={handleWatchAdToRevive}
        >
          <PlayCircle size={20} />
          Watch Ad to Revive
        </button>
      )}
      
      {/* ... rest of component ... */}
    </div>
  );
}
```

**B. Add Interstitial Ad Between Games**

Update your `App.tsx`:

```tsx
const { showInterstitialAd } = useAds();
const [gamesPlayed, setGamesPlayed] = useState(0);

const handleRestartWithAd = () => {
  const newGamesCount = gamesPlayed + 1;
  setGamesPlayed(newGamesCount);
  
  // Show interstitial ad every 3 games
  if (newGamesCount % 3 === 0) {
    showInterstitialAd();
  }
  
  restartGame();
};
```

**C. Add Banner Ad (Optional)**

Add to bottom of your game screen:

```tsx
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// In your render
<BannerAd
  unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-XXXXX/YYYYY'}
  size={BannerAdSize.BANNER}
  requestOptions={{
    requestNonPersonalizedAdsOnly: true,
  }}
/>
```

---

### Step 6: Update Privacy Policy (15 minutes)

**IMPORTANT:** AdMob collects user data. You MUST update your privacy policy.

Add to `PRIVACY_POLICY.md`:

```markdown
## Advertising

We use Google AdMob to display advertisements in TileDrop. AdMob may collect 
and use the following data:

- Device information (model, OS version)
- IP address
- Ad interaction data
- App usage data

For more information about how Google uses data, visit:
https://policies.google.com/technologies/partner-sites

You can opt-out of personalized advertising by visiting:
https://adssettings.google.com
```

---

### Step 7: Configure App Store Listings (10 minutes)

**Apple App Store:**
- In App Store Connect, check "Uses Advertising Identifier"
- Select "Serve advertisements within the app"

**Google Play Store:**
- In the Data Safety section, declare that you collect advertising data
- Indicate data is shared with AdMob

---

### Step 8: Test Ads (30 minutes)

**Important Testing Steps:**

1. **Use Test Ads in Development:**
   - Test ads are automatically used when `__DEV__` is true
   - Never use real ad unit IDs during testing (can get banned)

2. **Test Each Ad Type:**
   - Rewarded ad: Trigger game over, click "Watch Ad to Revive"
   - Interstitial ad: Play 3 games in a row
   - Banner ad: Should appear at bottom of screen

3. **Test on Real Devices:**
   - Android: Install APK, test all ad types
   - iOS: Install via TestFlight, test all ad types

4. **Switch to Production Ads:**
   - Update ad unit IDs in `useAds.tsx`
   - Build production versions
   - Test once more to ensure ads show

---

## 💰 Expected Revenue

Based on typical mobile game metrics:

**With 1,000 Daily Active Users:**
- Rewarded Ads (50% watch rate): $25-75/day
- Interstitial Ads (every 3 games): $15-50/day
- Banner Ads (constant display): $5-20/day

**Total: $45-145/day = $1,350-$4,350/month**

**With 10,000 Daily Active Users:**
- **$13,500-$43,500/month** 🚀

---

## 🎨 Design Recommendations

### Rewarded Ad Button Styling
```css
.watch-ad-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.watch-ad-button:hover {
  transform: scale(1.05);
}

.watch-ad-button:active {
  transform: scale(0.95);
}
```

---

## ⚠️ Important Guidelines

### DO:
✅ Use test ads during development  
✅ Show rewarded ads as optional (player choice)  
✅ Limit interstitial ad frequency (max every 3 games)  
✅ Update privacy policy  
✅ Declare ad usage in app store listings  

### DON'T:
❌ Click your own ads (can get banned)  
❌ Use real ad IDs during testing  
❌ Show interstitial ads too frequently (annoys users)  
❌ Force ads without player benefit  
❌ Hide that ads collect data  

---

## 🐛 Troubleshooting

**Ads not showing:**
- Check internet connection
- Verify ad unit IDs are correct
- Ensure AdMob account is approved (can take 24 hours)
- Check console for error messages

**"AdMob account under review":**
- Normal for new accounts
- Can take 24-48 hours
- Test ads still work during review

**Low fill rate (ads not always available):**
- Normal when starting out
- Improves as app gets more users
- AdMob needs data to optimize

---

## 📋 Quick Checklist

- [ ] Create AdMob account
- [ ] Create iOS and Android apps in AdMob
- [ ] Create ad units (Rewarded, Interstitial, Banner)
- [ ] Install `react-native-google-mobile-ads` package
- [ ] Configure `app.json` with AdMob app IDs
- [ ] Create `useAds.tsx` hook
- [ ] Replace test ad unit IDs with real ones
- [ ] Integrate rewarded ad into GameOver screen
- [ ] Add interstitial ad between games (every 3 games)
- [ ] (Optional) Add banner ad to game screen
- [ ] Update Privacy Policy with AdMob disclosure
- [ ] Update App Store data collection declarations
- [ ] Test all ad types on real devices
- [ ] Switch to production ad unit IDs
- [ ] Submit updated app to stores

---

## 🎯 Next Steps After This Guide

1. **Complete Steps 1-3** (30 min) - Set up AdMob account and install package
2. **Complete Steps 4-5** (50 min) - Create hook and integrate into game
3. **Complete Steps 6-7** (25 min) - Update legal docs and app listings
4. **Complete Step 8** (30 min) - Test thoroughly

**Total Time: ~2.5 hours** to add full ad monetization! 💰

---

Good luck monetizing TileDrop! Ads are the easiest way to generate revenue from free games. 🚀

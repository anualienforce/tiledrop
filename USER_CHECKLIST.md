# TileDrop - App Store Submission Checklist

## ✅ What's Already Done

The following are complete and ready to use:

- ✅ **Privacy Policy** - See `PRIVACY_POLICY.md`
- ✅ **Terms of Service** - See `TERMS_OF_SERVICE.md`
- ✅ **App Store Descriptions** - See `APP_STORE_DESCRIPTIONS.md`
- ✅ **Analytics Tracking** - Built-in event tracking system
- ✅ **Error Logging** - Crash reporting with error boundary
- ✅ **Rate Prompts** - Automatic rating requests after achievements
- ✅ **Premium UI** - Polished tiles, power-ups, and animations
- ✅ **Accessibility Features** - Color-blind mode, high contrast, reduced motion
- ✅ **Game Mechanics** - Progressive difficulty, power-ups, combos

---

## 📋 What You Need To Do

### 1. **Update Legal Documents** (15 minutes)

**Files to Edit:**
- `PRIVACY_POLICY.md`
- `TERMS_OF_SERVICE.md`

**Replace These Placeholders:**
- `[YOUR_EMAIL_HERE]` → Your support email
- `[YOUR_WEBSITE_HERE]` → Your website URL
- `[YOUR_JURISDICTION]` → Your country/state (e.g., "California, USA")

**Upload Privacy Policy:**
- Host `PRIVACY_POLICY.md` on your website
- Get the public URL (required for app stores)

---

### 2. **Update App Store Descriptions** (10 minutes)

**File to Edit:**
- `APP_STORE_DESCRIPTIONS.md`

**Replace These Placeholders:**
- `[YOUR_EMAIL]` → Your support email
- `[YOUR_WEBSITE]` → Your website
- `[YOUR_APP_ID]` → Apple App ID (get this after creating app in App Store Connect)

**Optional Customizations:**
- Adjust keywords based on your target audience
- Translate descriptions for other languages
- Update "What's New" section for future updates

---

### 3. **Update Rate Prompt URLs** (5 minutes)

**File to Edit:**
- `client/src/components/RatePrompt.tsx`

**Lines to Update:**
```typescript
// Line 21 - Apple App Store URL
window.open('https://apps.apple.com/app/tiledrop/id[YOUR_APP_ID]?action=write-review', '_blank');

// Line 23 - Google Play Store URL  
window.open('https://play.google.com/store/apps/details?id=com.tpgames.tiledrop&reviewId=0', '_blank');
```

**Replace:**
- `[YOUR_APP_ID]` → Your Apple App ID
- `com.tpgames.tiledrop` → Your Android package name

---

### 4. **Create App Icon** (1-2 hours)

**Requirements:**

**For Apple App Store:**
- Size: 1024x1024px
- Format: PNG
- DPI: 72
- Color: RGB (no transparency)
- Content: No text, badges, or rounded corners

**For Google Play:**
- Size: 512x512px
- Format: PNG, 32-bit with alpha
- Max size: 1 MB

**Design Tips:**
- Use "TileDrop" branding
- Make it recognizable at small sizes (29x29px)
- Use vibrant colors from your gradient theme
- Consider a simple tile or drop icon
- Test at different sizes

**Tools:**
- Canva (free templates)
- Figma (professional design)
- Adobe Illustrator
- Or hire on Fiverr ($5-50)

---

### 5. **Take Screenshots** (30 minutes)

**Required Sizes:**

**iPhone (iOS):**
- 6.7" (1290x2796) - iPhone 15 Pro Max
- 6.5" (1284x2778) - iPhone 14 Plus
- 5.5" (1242x2208) - Older iPhones

**iPad (iOS):**
- 12.9" (2048x2732) - iPad Pro
- Optional but recommended

**Android:**
- Phone: 1080x1920 minimum
- 7" Tablet: 1024x600 minimum
- 10" Tablet: 1280x800 minimum

**What to Capture:**
- Main gameplay screen showing tiles
- High score achievement
- Power-ups in action
- Settings/accessibility features
- Combo animations (4 or 5 match)

**Tips:**
- Use browser dev tools to simulate devices
- Capture exciting moments (big scores, combos)
- Keep UI elements visible
- Show the game's best features
- No personal info in screenshots

---

### 6. **Register Developer Accounts** (30 minutes)

**Apple Developer Account:**
- Cost: $99/year
- Website: https://developer.apple.com
- Requirements: Apple ID with 2FA enabled
- Processing: Instant to 48 hours
- EU traders: D-U-N-S number required

**Google Play Developer:**
- Cost: $25 one-time
- Website: https://play.google.com/console
- Requirements: Google account
- Processing: Instant to 24 hours
- Organization: May need verification

---

### 7. **Set Up Expo/React Native** (2-4 hours)

**Option A: Use Replit's Expo Template**
- Remix the Expo template on Replit
- Copy your game code into the template
- Configure `app.json` with your app details

**Option B: Manual Setup**
```bash
npx create-expo-app tiledrop-mobile
cd tiledrop-mobile
# Copy your client/src files
# Configure app.json
```

**Configure app.json:**
```json
{
  "expo": {
    "name": "TileDrop",
    "slug": "tiledrop",
    "version": "1.0.0",
    "platforms": ["ios", "android"],
    "ios": {
      "bundleIdentifier": "com.tpgames.tiledrop",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.tpgames.tiledrop",
      "versionCode": 1
    }
  }
}
```

---

### 8. **Build Mobile Apps** (1-2 hours)

**Install EAS CLI:**
```bash
npm install -g eas-cli
eas login
```

**Configure Build:**
```bash
eas build:configure
```

**Build for iOS:**
```bash
eas build --platform ios
```

**Build for Android:**
```bash
eas build --platform android
```

**Note:** First build can take 20-30 minutes

---

### 9. **Test on Physical Devices** (1-2 hours)

**iOS Testing:**
- Install TestFlight app
- Submit build to TestFlight
- Share with yourself/testers
- Test all features thoroughly

**Android Testing:**
- Download APK from EAS
- Install on Android device
- Test all features thoroughly

**Test Checklist:**
- ✅ Game loads correctly
- ✅ Touch controls work
- ✅ Power-ups function
- ✅ Sound toggles
- ✅ Settings save
- ✅ Rate prompt appears
- ✅ Share functionality
- ✅ Accessibility features
- ✅ No crashes or freezes

---

### 10. **Submit to App Stores** (1-2 hours)

**Apple App Store:**
1. Go to https://appstoreconnect.apple.com
2. Create new app
3. Fill in app information
4. Upload icon and screenshots
5. Add description and keywords
6. Set pricing (free)
7. Upload build from EAS
8. Submit for review

**Google Play Store:**
1. Go to https://play.google.com/console
2. Create new app
3. Fill in store listing
4. Upload graphics
5. Complete content rating questionnaire
6. Upload APK/AAB from EAS
7. Submit for review

**Review Times:**
- Apple: 24-48 hours
- Google: Few hours to 2 days

---

## 🎯 Quick Start Guide (In Order)

1. **Day 1 - Prep Work (2-3 hours)**
   - Update legal documents
   - Update app descriptions
   - Create app icon design

2. **Day 2 - Assets (2-3 hours)**
   - Finalize app icon
   - Take all screenshots
   - Register developer accounts

3. **Day 3 - Development (3-4 hours)**
   - Set up Expo project
   - Build iOS app
   - Build Android app
   - (Optional) Add ads for monetization - See `ADS_INTEGRATION_GUIDE.md` (+2.5 hours)

4. **Day 4 - Testing (2-3 hours)**
   - Test on iPhone
   - Test on Android
   - Fix any issues

5. **Day 5 - Launch (2-3 hours)**
   - Submit to Apple
   - Submit to Google
   - Wait for approval

**Total Time Estimate: 11-16 hours spread over 5 days**

---

## 📞 Support Resources

**If You Need Help:**

**Expo Documentation:**
- https://docs.expo.dev

**App Store Connect:**
- https://developer.apple.com/help/app-store-connect/

**Google Play Console:**
- https://support.google.com/googleplay/android-developer

**Community Support:**
- Expo Discord: https://chat.expo.dev
- Stack Overflow: Tag with `expo`, `react-native`

---

## 💡 Pro Tips

1. **Start with Android** - Approval is faster, gives you practice
2. **Use EAS Build** - No need for Mac to build iOS apps
3. **Test thoroughly** - One rejection adds 1-7 days
4. **Prepare screenshots early** - Most time-consuming part
5. **Read rejection reasons** - Apple/Google provide specific feedback
6. **Update regularly** - Monthly updates keep users engaged
7. **Monitor analytics** - Built-in tracking helps improve game

---

## 🚀 After Launch

**Day 1:**
- Share on social media
- Ask friends/family to download
- Respond to first reviews

**Week 1:**
- Monitor crash reports (error logs)
- Check analytics data
- Plan first update based on feedback

**Month 1:**
- Release update with improvements
- Add new features
- Optimize based on user data

---

## ✨ Optional Enhancements

**Before Launch:**
- Add more tile colors/themes
- Create daily challenges system
- Add leaderboards (global)
- **Add monetization with ads** - See `ADS_INTEGRATION_GUIDE.md` for complete setup (~2.5 hours)

**After Launch:**
- Add more power-ups
- Create seasonal events
- Add achievements/badges
- Implement multiplayer mode

---

## 📊 Current App Features

Your app already includes:

✅ Core puzzle mechanics  
✅ Progressive difficulty  
✅ Power-up system (Undo, Row Clear, Number Clear)  
✅ Combo multipliers  
✅ Coin economy  
✅ Shop system  
✅ High score tracking  
✅ Professional UI/UX  
✅ Accessibility features  
✅ Sound effects & music  
✅ Analytics tracking  
✅ Error logging  
✅ Rate prompts  
✅ Share functionality  
✅ Settings menu  
✅ How to play tutorial  
✅ Welcome screen  
✅ TP GAMES branding  

**You're 90% ready for launch!** 🎉

---

## 🎬 Final Checklist Before Submission

- [ ] Privacy Policy uploaded to website
- [ ] All placeholder text replaced
- [ ] App icon created (1024x1024)
- [ ] Screenshots taken (all required sizes)
- [ ] Developer accounts registered
- [ ] Expo project set up
- [ ] iOS build successful
- [ ] Android build successful
- [ ] Tested on iPhone
- [ ] Tested on Android
- [ ] No crashes or major bugs
- [ ] App Store Connect listing complete
- [ ] Google Play Console listing complete
- [ ] Submitted for review

**Once all checked, you're ready to launch! 🚀**

---

Good luck with your launch! Your game is polished and ready. The hard technical work is done - now it's just paperwork and assets! 💪

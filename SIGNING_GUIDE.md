# TileDrop App Signing Guide

## ✅ Signing Setup Complete

Your Android app has been configured for signing and is ready for Play Store publishing.

---

## 📋 What Was Done

### 1. Keystore Created
- **File**: `android/tiledrop-release-key.keystore`
- **Company**: LTS
- **Validity**: 10,000 days (27+ years)
- **Algorithm**: RSA 2048-bit
- **Alias**: tiledrop-key

### 2. Build Configuration Updated
- **File**: `android/app/build.gradle`
- Added `signingConfigs` block with your keystore credentials
- Configured release build to use the signing config
- All release builds will now be automatically signed

---

## 🔐 Credentials

| Item | Value |
|------|-------|
| **Keystore File** | `android/tiledrop-release-key.keystore` |
| **Keystore Password** | `Tiledrop@123` |
| **Key Alias** | `tiledrop-key` |
| **Key Password** | `Tiledrop@123` |
| **Company** | LTS |

---

## 🚀 Building Signed Release APK/AAB

### Option 1: Command Line (Recommended for CI/CD)

```bash
# Navigate to android directory
cd android

# Build signed APK
./gradlew assembleRelease

# Build signed AAB (for Play Store)
./gradlew bundleRelease
```

**Output locations:**
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### Option 2: Android Studio GUI

1. Open the project in Android Studio
2. Go to **Build** → **Generate Signed Bundle / APK**
3. Select **Android App Bundle** (for Play Store)
4. Choose the keystore file: `tiledrop-release-key.keystore`
5. Enter credentials when prompted
6. Select **Release** build type
7. Click **Finish**

---

## 📦 Uploading to Google Play Store

### Prerequisites
- Google Play Developer Account ($25 one-time fee)
- Signed AAB file (not APK)

### Steps
1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app listing
3. Upload your signed AAB file
4. Fill in app details (description, screenshots, etc.)
5. Submit for review

---

## ⚠️ IMPORTANT: Keystore Backup

**CRITICAL**: Your keystore file is essential for all future app updates.

### What to Do
1. **Backup the keystore file** to a secure location
2. **Never lose or delete** `tiledrop-release-key.keystore`
3. **Keep the password safe** - you'll need it for every update
4. **Don't commit to git** - it's already in `.gitignore`

### Why It Matters
- If you lose the keystore, you **cannot update your app** on Play Store
- Google Play requires the same keystore for all versions of the same app
- You'll have to create a new app listing if you lose it

---

## 🔍 Verify Signing Configuration

To verify your keystore is valid:

```bash
cd android
keytool -list -v -keystore tiledrop-release-key.keystore -storepass Tiledrop@123
```

This will display:
- Certificate fingerprints (SHA-1, SHA-256)
- Validity dates
- Key alias details

---

## 📝 Version Updates

When you need to release a new version:

1. Update `versionCode` and `versionName` in `android/app/build.gradle`
2. Rebuild using the same keystore (already configured)
3. Upload new AAB to Play Store

**Example:**
```gradle
versionCode 2        // Increment this
versionName "1.1"    // Update this
```

---

## 🛠️ Troubleshooting

### Build Fails with "Keystore not found"
- Ensure you're running gradle from the `android/` directory
- Check that `tiledrop-release-key.keystore` exists in `android/` folder

### Wrong Password Error
- Verify keystore password: `Tiledrop@123`
- Verify key password: `Tiledrop@123`
- Both are the same in this setup

### Certificate Expired (Future)
- Current certificate is valid for 10,000 days
- You won't need to worry about this for 27+ years

---

## 📚 Next Steps

1. ✅ Signing configured
2. Build signed AAB: `./gradlew bundleRelease`
3. Create Play Store listing
4. Upload AAB file
5. Complete app details and submit for review

---

## 📞 Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android App Signing Guide](https://developer.android.com/studio/publish/app-signing)
- [Gradle Build Documentation](https://developer.android.com/studio/build)

# Setup Guide for Development

This guide helps you set up the development environment for react-native-fast-cache.

## Prerequisites

- Node.js 20+
- React Native development environment set up
- iOS: Xcode 14+, CocoaPods
- Android: Android Studio, JDK 17

## Initial Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. iOS Setup

```bash
cd ios
pod install
cd ..
```

This will install:
- SDWebImage (~> 5.21)
- SDWebImageWebPCoder (~> 0.15)
- All React Native dependencies

### 3. Android Setup

No additional steps needed. Gradle will automatically:
- Download Glide 4.16.0
- Configure Kotlin
- Set up all dependencies

## Running the Example App

### iOS

```bash
npm run ios
# or for specific device
npx react-native run-ios --device "iPhone 15 Pro"
```

### Android

```bash
npm run android
# or for specific device
adb devices  # list devices
npx react-native run-android --deviceId=<device-id>
```

## Development Workflow

### Project Structure

```
ReactNativeImageCache/
├── src/                    # JavaScript/TypeScript source
│   ├── index.js           # Main export
│   ├── FastCacheImage.js  # Component
│   └── index.d.ts         # TypeScript definitions
├── ios/                    # iOS native code
│   ├── FastCacheImageView.swift
│   ├── FastCacheImageManager.swift
│   ├── FastCacheLegacyModule.swift
│   └── *.m (Objective-C bridges)
├── android/                # Android native code
│   ├── build.gradle
│   └── src/main/java/com/fastcache/
│       ├── FastCacheImageView.kt
│       ├── FastCacheImageManager.kt
│       ├── FastCacheModule.kt
│       ├── FastCachePackage.kt
│       └── FastCacheGlideModule.kt
└── App.tsx                 # Example application
```

### Making Changes

1. **JavaScript Changes**: Hot reload works automatically
2. **Native iOS Changes**: 
   - Rebuild in Xcode or `npm run ios`
   - Clean build if needed: `cd ios && xcodebuild clean`
3. **Native Android Changes**:
   - Rebuild with `npm run android`
   - Clean build: `cd android && ./gradlew clean`

## Testing the Module

### Manual Testing

The example app (`App.tsx`) includes comprehensive tests for:
- Different resize modes
- Border radius
- Progress tracking
- GIF loading
- Priority loading
- Cache management
- Tint colors

### Testing Changes

1. Modify the module code
2. Restart the app to see changes
3. Test different scenarios in the example app

## Common Issues

### iOS: Pod Install Fails

```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
```

### Android: Build Fails

```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Metro Bundler Issues

```bash
npm start -- --reset-cache
```

### Native Module Not Found

**iOS:**
- Check that Swift files are added to Xcode project
- Verify bridging header is configured
- Clean and rebuild

**Android:**
- Check `settings.gradle` includes the module
- Verify `build.gradle` has the dependency
- Check `MainApplication.kt` registers the package

## Debugging

### iOS

1. Open `ios/ReactNativeImageCache.xcworkspace` in Xcode
2. Set breakpoints in Swift files
3. Run from Xcode

### Android

1. Open `android/` in Android Studio
2. Set breakpoints in Kotlin files
3. Debug the app from Android Studio

### JavaScript

Use Chrome DevTools or React Native Debugger:
```bash
npm start
# Then enable debugging in the app
```

## Publishing Checklist

Before publishing to npm:

- [ ] Test on iOS device
- [ ] Test on Android device
- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Test installation in a fresh app
- [ ] Review `README.md` is up to date
- [ ] Check `.npmignore` excludes unnecessary files
- [ ] Build successful on both platforms
- [ ] All features working as expected

## Publishing to npm

```bash
# 1. Ensure you're logged in
npm login

# 2. Test the package
npm pack
# This creates a .tgz file you can test in another project

# 3. Publish
npm publish

# 4. Tag the release
git tag v1.0.0
git push origin v1.0.0
```

## CI/CD Setup (Future)

Suggested tools:
- GitHub Actions for automated tests
- Fastlane for iOS builds
- Gradle for Android builds
- Semantic versioning

## Getting Help

- Check `README.md` for documentation
- Review `IMPLEMENTATION_SUMMARY.md` for architecture
- Check `NEW_ARCHITECTURE.md` for roadmap
- Open an issue on GitHub

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

See the well-structured codebase for easy contributions!


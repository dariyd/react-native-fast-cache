# FastCache Example App

This is the example app for testing `react-native-fast-cache` during development.

## Setup

### 1. Install Dependencies

From the example directory:

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

### 3. Run the Example

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## What's Different from a Regular RN App

This example app links to the parent module using:

**package.json:**
```json
{
  "dependencies": {
    "react-native-fast-cache": "file:.."
  }
}
```

**ios/Podfile:**
```ruby
pod 'react-native-fast-cache', :path => '../..'
```

This allows you to test changes to the module in real-time without publishing to npm.

## Testing Workflow

1. Make changes to the module code in the parent directory (`../src`, `../ios`, `../android`)
2. For JavaScript changes: Just reload the app (Fast Refresh works)
3. For native iOS changes: Rebuild with `npm run ios`
4. For native Android changes: Rebuild with `npm run android`

## Features Demonstrated

The example app showcases:
- ✅ Different resize modes
- ✅ Border radius support
- ✅ Progress tracking
- ✅ GIF loading
- ✅ Priority levels
- ✅ Tint colors
- ✅ Cache management (preload, clear, get info)


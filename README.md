# React Native Fast Cache

🚀 High-performance image caching for React Native using [SDWebImage](https://github.com/SDWebImage/SDWebImage) (iOS) and [Glide](https://github.com/bumptech/glide) (Android).

A drop-in replacement for React Native's `Image` component and `react-native-fast-image` with aggressive caching, better performance, and additional features.

## Features

- ✅ **Aggressive caching** - Images are cached efficiently on disk and in memory
- ✅ **High performance** - Native image loading with optimized memory usage
- ✅ **GIF support** - Animated GIF and WebP support
- ✅ **Priority loading** - Set priority for important images
- ✅ **Progress tracking** - Monitor image download progress
- ✅ **Headers support** - Add authorization headers to requests
- ✅ **Border radius** - Native border radius support
- ✅ **Tint color** - Apply color filters to images
- ✅ **Preloading** - Preload images before displaying
- ✅ **Cache management** - Clear cache programmatically
- ✅ **TypeScript** - Full TypeScript definitions included
- ✅ **Old & New Architecture** - Compatible with both React Native architectures

## Installation

```bash
npm install react-native-fast-cache
# or
yarn add react-native-fast-cache
```

### iOS Setup

```bash
cd ios && pod install
```

The package will automatically configure SDWebImage (v5.21+) via CocoaPods.

### Android Setup

No additional setup required. Glide (v4.16+) will be automatically configured via Gradle.

#### Proguard Rules

If you use Proguard, add these lines to `android/app/proguard-rules.pro`:

```proguard
-keep public class com.fastcache.** { *; }
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public enum com.bumptech.glide.load.ImageHeaderParser$** {
  **[] $VALUES;
  public *;
}
```

#### Existing Glide AppGlideModule

If you already have a custom `AppGlideModule` in your app, you may encounter conflicts. In this case:

1. Remove or rename the existing `AppGlideModule`
2. Or configure Glide settings in your module to match your needs

## Usage

### Basic Usage

```jsx
import FastCacheImage from 'react-native-fast-cache';

function MyComponent() {
  return (
    <FastCacheImage
      style={{ width: 200, height: 200 }}
      source={{
        uri: 'https://example.com/image.jpg',
        priority: FastCacheImage.priority.normal,
      }}
      resizeMode={FastCacheImage.resizeMode.cover}
    />
  );
}
```

### With Headers

```jsx
<FastCacheImage
  style={{ width: 200, height: 200 }}
  source={{
    uri: 'https://example.com/protected/image.jpg',
    headers: {
      Authorization: 'Bearer your-token-here',
    },
  }}
/>
```

### With Progress Tracking

```jsx
function ImageWithProgress() {
  const [progress, setProgress] = useState(0);

  return (
    <View>
      <FastCacheImage
        style={{ width: 200, height: 200 }}
        source={{ uri: 'https://example.com/large-image.jpg' }}
        onProgress={(e) => {
          setProgress(e.loaded / e.total);
        }}
      />
      <Text>{Math.round(progress * 100)}%</Text>
    </View>
  );
}
```

### Preloading Images

```jsx
FastCacheImage.preload([
  {
    uri: 'https://example.com/image1.jpg',
    headers: { Authorization: 'Bearer token' },
  },
  {
    uri: 'https://example.com/image2.jpg',
    priority: FastCacheImage.priority.high,
  },
]);
```

### Cache Management

```jsx
// Clear memory cache
await FastCacheImage.clearMemoryCache();

// Clear disk cache
await FastCacheImage.clearDiskCache();

// Get cache size
const { size, fileCount } = await FastCacheImage.getCacheSize();
console.log(`Cache size: ${size} bytes, ${fileCount} files`);

// Get cache path
const path = await FastCacheImage.getCachePath();
console.log(`Cache location: ${path}`);
```

## API Reference

### Props

#### `source`

Object containing image source information.

| Property   | Type     | Description                                    |
| ---------- | -------- | ---------------------------------------------- |
| `uri`      | string   | Remote URL of the image                        |
| `headers`  | object   | HTTP headers to include with the request       |
| `priority` | enum     | Loading priority (low, normal, high)           |
| `cache`    | enum     | Cache control strategy (immutable, web, cacheOnly) |

```jsx
source={{
  uri: 'https://example.com/image.jpg',
  headers: { Authorization: 'Bearer token' },
  priority: FastCacheImage.priority.high,
  cache: FastCacheImage.cacheControl.immutable,
}}
```

#### `defaultSource`

A local image to display while the remote image is loading.

```jsx
defaultSource={require('./placeholder.png')}
```

#### `resizeMode`

How the image should be resized to fit its container.

- `FastCacheImage.resizeMode.contain` - Scale to fit, maintaining aspect ratio
- `FastCacheImage.resizeMode.cover` - Scale to fill, maintaining aspect ratio (default)
- `FastCacheImage.resizeMode.stretch` - Scale to fill, ignoring aspect ratio
- `FastCacheImage.resizeMode.center` - Center without scaling

```jsx
resizeMode={FastCacheImage.resizeMode.contain}
```

#### `tintColor`

Apply a color tint to the image.

```jsx
tintColor="#FF0000"
```

#### `fallback`

If `true`, falls back to React Native's standard `Image` component.

```jsx
fallback={true}
```

#### Event Callbacks

##### `onLoadStart`

Called when the image starts loading.

```jsx
onLoadStart={() => console.log('Loading started')}
```

##### `onProgress`

Called during image download with progress information.

```jsx
onProgress={(event) => {
  console.log(`Progress: ${event.loaded}/${event.total}`);
}}
```

##### `onLoad`

Called when the image successfully loads.

```jsx
onLoad={(event) => {
  console.log(`Loaded: ${event.width}x${event.height}`);
}}
```

##### `onError`

Called when the image fails to load.

```jsx
onError={(event) => {
  console.error(`Error: ${event.error}`);
}}
```

##### `onLoadEnd`

Called when loading finishes (success or failure).

```jsx
onLoadEnd={() => console.log('Loading finished')}
```

### Static Methods

#### `preload(sources: Source[]): void`

Preload images to display later.

```jsx
FastCacheImage.preload([
  { uri: 'https://example.com/image1.jpg' },
  { uri: 'https://example.com/image2.jpg' },
]);
```

#### `clearMemoryCache(): Promise<void>`

Clear all images from memory cache.

```jsx
await FastCacheImage.clearMemoryCache();
```

#### `clearDiskCache(): Promise<void>`

Clear all images from disk cache.

```jsx
await FastCacheImage.clearDiskCache();
```

#### `getCacheSize(): Promise<{ size: number, fileCount: number }>`

Get the current size of the disk cache.

```jsx
const { size, fileCount } = await FastCacheImage.getCacheSize();
console.log(`Cache: ${size} bytes in ${fileCount} files`);
```

#### `getCachePath(): Promise<string>`

Get the path to the cache directory.

```jsx
const path = await FastCacheImage.getCachePath();
```

### Enums

#### Priority

- `FastCacheImage.priority.low`
- `FastCacheImage.priority.normal` (default)
- `FastCacheImage.priority.high`

#### Cache Control

- `FastCacheImage.cacheControl.immutable` - Only updates if URL changes (default)
- `FastCacheImage.cacheControl.web` - Use headers and follow normal caching procedures
- `FastCacheImage.cacheControl.cacheOnly` - Only show images from cache, no network requests

#### Resize Mode

- `FastCacheImage.resizeMode.contain`
- `FastCacheImage.resizeMode.cover` (default)
- `FastCacheImage.resizeMode.stretch`
- `FastCacheImage.resizeMode.center`

## Migration from react-native-fast-image

`react-native-fast-cache` is designed as a drop-in replacement. Simply replace the import:

```diff
- import FastImage from 'react-native-fast-image';
+ import FastCacheImage from 'react-native-fast-cache';

- <FastImage
+ <FastCacheImage
    source={{ uri: 'https://example.com/image.jpg' }}
    style={{ width: 200, height: 200 }}
  />
```

All APIs are compatible, with additional features:

- `getCacheSize()` - Get cache size information
- `getCachePath()` - Get cache directory path
- Better TypeScript support
- Improved GIF/WebP support

## Comparison

### vs React Native Image

| Feature                  | RN Image | FastCacheImage |
| ------------------------ | -------- | -------------- |
| Aggressive disk caching  | ❌        | ✅              |
| Memory management        | Basic    | Optimized      |
| GIF support              | iOS only | ✅              |
| Progress tracking        | ❌        | ✅              |
| Priority loading         | ❌        | ✅              |
| Preloading               | Limited  | ✅              |
| Cache control            | Limited  | Advanced       |

### vs react-native-fast-image

| Feature             | fast-image | FastCacheImage |
| ------------------- | ---------- | -------------- |
| SDWebImage (iOS)    | ✅          | ✅ (v5.21+)     |
| Glide (Android)     | ✅          | ✅ (v4.16+)     |
| Cache size API      | ❌          | ✅              |
| Cache path API      | ❌          | ✅              |
| TypeScript          | Basic      | Full support   |
| New Architecture    | ❌          | In progress    |
| Actively maintained | ⚠️         | ✅              |

## Troubleshooting

### Images not loading on Android

Make sure you have internet permission in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### Build errors with Glide

If you encounter build errors related to Glide:

1. Clean the build: `cd android && ./gradlew clean`
2. Check for conflicting Glide versions in other dependencies
3. Verify kapt is configured correctly

### iOS pod install fails

Try:

```bash
cd ios
pod deintegrate
pod install
```

### Images not updating

If images aren't updating when URLs change:

1. Use `cache: FastCacheImage.cacheControl.web` to respect HTTP cache headers
2. Append a timestamp to the URL: `uri: 'https://example.com/image.jpg?t=' + Date.now()`
3. Clear the cache: `await FastCacheImage.clearDiskCache()`

## Performance Tips

1. **Preload images** before they're needed
2. **Use appropriate priority** for important images
3. **Set cache control** based on your use case
4. **Use correct resize mode** to avoid unnecessary scaling
5. **Clear cache periodically** to manage disk space

## Examples

See the example app in `App.tsx` for comprehensive usage examples including:

- Different resize modes
- Border radius
- Progress indicators
- GIF support
- Priority loading
- Tint colors
- Cache management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Credits

Built with:
- [SDWebImage](https://github.com/SDWebImage/SDWebImage) (iOS)
- [Glide](https://github.com/bumptech/glide) (Android)

Inspired by [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image)

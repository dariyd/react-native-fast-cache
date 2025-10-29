# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-29

### Added
- Initial release of react-native-fast-cache
- iOS implementation with SDWebImage 5.21+
  - Image loading with caching
  - Progress tracking
  - Resize modes (contain, cover, stretch, center)
  - Border radius support
  - Tint color support
  - Priority loading
  - Cache control strategies
  - Event callbacks
- Android implementation with Glide 4.16+
  - Image loading with caching
  - Progress tracking
  - Resize modes
  - Border radius transformations
  - Tint color support
  - Priority loading
  - Cache control strategies
  - Event callbacks
- JavaScript/TypeScript API
  - FastCacheImage component
  - Static methods: preload, clearMemoryCache, clearDiskCache
  - Bonus methods: getCacheSize, getCachePath
  - Full TypeScript definitions
  - Enums for priority, cacheControl, resizeMode
- Comprehensive documentation
  - Installation guide
  - Usage examples
  - API reference
  - Migration guide from react-native-fast-image
  - Troubleshooting section
- Example application with demos
- Support for:
  - JPEG, PNG, GIF (animated), WebP
  - Authorization headers
  - Local placeholder images
  - Fallback to standard Image component

### Compatible With
- React Native 0.60.0 and above
- iOS 13.4+
- Android API 24+

### Notes
- Drop-in replacement for react-native-fast-image
- Old architecture only (new architecture support planned for v2.0)
- 100% API compatible with react-native-fast-image
- Additional features: getCacheSize(), getCachePath()

## [Unreleased]

### Planned
- New Architecture support (Fabric + TurboModules)
- Additional image transformations
- Video thumbnail support (Android)
- More cache control options
- Performance optimizations


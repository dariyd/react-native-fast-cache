# New Architecture Support

This document outlines the status and plans for React Native's New Architecture (Fabric + TurboModules) support in react-native-fast-cache.

## Current Status

✅ **Old Architecture (Bridge)**: Fully implemented and functional
- iOS: RCTViewManager + RCTBridgeModule
- Android: ViewManager + NativeModule

⚠️ **New Architecture (Fabric + TurboModules)**: Planned for future release
- Requires Codegen setup
- Requires C++ JSI bindings
- Requires Fabric ComponentDescriptor implementation

## Why Old Architecture First?

1. **Compatibility**: The old architecture is still the default in React Native 0.82 and will be supported for some time
2. **Stability**: Old architecture is battle-tested and well-documented
3. **Immediate Usability**: Users can start using the package today without waiting for new arch
4. **Gradual Migration**: The new architecture can be added incrementally without breaking changes

## New Architecture Implementation Plan

### iOS (Fabric + TurboModules)

**Files needed:**
```
ios/
├── FastCacheComponentView.swift       # Fabric component view
├── FastCacheComponentDescriptor.h/cpp  # Component descriptor
├── FastCacheSpec.h/cpp                 # TurboModule spec (generated)
├── FastCacheTurboModule.swift/mm       # TurboModule implementation
└── react-native-fast-cache-codegen.json # Codegen config
```

**Key requirements:**
- Implement `RCTFabricComponentsDelegate`
- Create ComponentDescriptor in C++
- Use JSI for synchronous native calls
- Handle props via Codegen

### Android (Fabric + TurboModules)

**Files needed:**
```
android/src/main/java/com/fastcache/
├── FastCacheComponentView.kt          # Fabric component view
├── FastCacheTurboModule.kt            # TurboModule
└── FastCacheSpec.kt                   # Codegen spec
```

**Key requirements:**
- Extend `FabricComponentView`
- Implement `TurboModule` interface
- Use Codegen for type-safe props
- Support ViewProps properly

### JavaScript Codegen

**Files needed:**
```
src/
├── NativeFastCacheImageView.ts        # Codegen view spec
├── NativeFastCacheModule.ts           # Codegen module spec
└── codegen/                           # Generated files (gitignored)
```

**Spec format:**
```typescript
import type { ViewProps } from 'react-native';
import type { HostComponent } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

interface NativeProps extends ViewProps {
  source?: Readonly<{
    uri?: string;
    headers?: Readonly<{[key: string]: string}>;
    priority?: string;
    cache?: string;
  }>;
  resizeMode?: string;
  tintColor?: ColorValue;
  borderRadius?: number;
}

export default codegenNativeComponent<NativeProps>(
  'FastCacheImageView'
) as HostComponent<NativeProps>;
```

## Timeline

- **v1.0.x**: Old architecture support (current)
- **v1.1.x**: New architecture support (iOS)
- **v1.2.x**: New architecture support (Android)
- **v2.0.x**: New architecture as default, old arch as fallback

## Contributing

If you'd like to contribute new architecture support, please:

1. Review React Native's [New Architecture documentation](https://reactnative.dev/docs/the-new-architecture/landing-page)
2. Check existing new arch implementations like `react-native-screens`
3. Open an issue to discuss your approach
4. Submit a PR with tests

## Testing New Architecture

Once implemented, users can enable new architecture:

**iOS:**
```ruby
# ios/Podfile
ENV['RCT_NEW_ARCH_ENABLED'] = '1'
```

**Android:**
```properties
# android/gradle.properties
newArchEnabled=true
```

## References

- [New Architecture Migration Guide](https://reactnative.dev/docs/new-architecture-intro)
- [Fabric Component Guide](https://reactnative.dev/docs/fabric-native-components)
- [TurboModules Guide](https://reactnative.dev/docs/turbomodules-intro)
- [Codegen Specs](https://reactnative.dev/docs/next/the-new-architecture/pillars-codegen)


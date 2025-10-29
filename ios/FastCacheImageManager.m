#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FastCacheImageManager, RCTViewManager)

// Props
RCT_EXPORT_VIEW_PROPERTY(source, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(defaultSource, NSNumber)
RCT_EXPORT_VIEW_PROPERTY(resizeMode, NSString)
RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)

// Events
RCT_EXPORT_VIEW_PROPERTY(onFastCacheLoadStart, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFastCacheProgress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFastCacheLoad, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFastCacheError, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onFastCacheLoadEnd, RCTDirectEventBlock)

@end


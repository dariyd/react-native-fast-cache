#import <React/RCTBridgeModule.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <ReactCommon/RCTTurboModule.h>
#import "reactnativefastcache.h"
#endif

@interface FastCacheModule : NSObject <RCTBridgeModule
#ifdef RCT_NEW_ARCH_ENABLED
, NativeFastCacheModuleSpec
#endif
>
@end


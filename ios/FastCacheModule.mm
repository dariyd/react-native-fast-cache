#import "FastCacheModule.h"
#import <React/RCTConvert.h>
#import <SDWebImage/SDWebImage.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "reactnativefastcache.h"
#endif

@interface FastCacheModule()
@end

@implementation FastCacheModule

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
    return NO;
}

RCT_EXPORT_METHOD(preload:(NSArray *)sources)
{
    SDWebImageManager *manager = [SDWebImageManager sharedManager];
    
    for (NSDictionary *source in sources) {
        NSString *uri = source[@"uri"];
        if (!uri) continue;
        
        NSURL *url = [NSURL URLWithString:uri];
        if (!url) continue;
        
        SDWebImageOptions options = SDWebImageRetryFailed;
        
        // Handle cache control
        NSString *cache = source[@"cache"];
        if ([cache isEqualToString:@"immutable"]) {
            options |= SDWebImageRefreshCached;
        } else if ([cache isEqualToString:@"web"]) {
            options |= SDWebImageRefreshCached;
        } else if ([cache isEqualToString:@"cacheOnly"]) {
            options |= SDWebImageFromCacheOnly;
        }
        
        // Handle headers
        NSMutableDictionary *headersDict = [NSMutableDictionary dictionary];
        id headers = source[@"headers"];
        if ([headers isKindOfClass:[NSArray class]]) {
            for (NSDictionary *entry in headers) {
                NSString *key = entry[@"key"];
                NSString *value = entry[@"value"];
                if (key && value) {
                    headersDict[key] = value;
                }
            }
        } else if ([headers isKindOfClass:[NSDictionary class]]) {
            [headersDict addEntriesFromDictionary:headers];
        }
        
        NSMutableDictionary *context = [NSMutableDictionary dictionary];
        if (headersDict.count > 0) {
            SDWebImageDownloaderRequestModifier *modifier = [[SDWebImageDownloaderRequestModifier alloc] initWithBlock:^NSURLRequest * _Nullable(NSURLRequest * _Nonnull request) {
                NSMutableURLRequest *mutableRequest = [request mutableCopy];
                [headersDict enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSString *value, BOOL *stop) {
                    [mutableRequest setValue:value forHTTPHeaderField:key];
                }];
                return mutableRequest;
            }];
            context[SDWebImageContextDownloadRequestModifier] = modifier;
        }
        
        [manager loadImageWithURL:url options:options context:context progress:nil completed:^(UIImage *image, NSData *data, NSError *error, SDImageCacheType cacheType, BOOL finished, NSURL *imageURL) {
            // Preload completion - no action needed
        }];
    }
}

RCT_EXPORT_METHOD(clearMemoryCache:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [[SDImageCache sharedImageCache] clearMemory];
    resolve(nil);
}

RCT_EXPORT_METHOD(clearDiskCache:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [[SDImageCache sharedImageCache] clearDiskOnCompletion:^{
        resolve(nil);
    }];
}

RCT_EXPORT_METHOD(getCacheSize:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [[SDImageCache sharedImageCache] calculateSizeWithCompletionBlock:^(NSUInteger fileCount, NSUInteger totalSize) {
        resolve(@{
            @"size": @(totalSize),
            @"fileCount": @(fileCount)
        });
    }];
}

RCT_EXPORT_METHOD(getCachePath:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSString *cachePath = [[SDImageCache sharedImageCache] diskCachePath];
    resolve(cachePath);
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeFastCacheModuleSpecJSI>(params);
}
#endif

@end


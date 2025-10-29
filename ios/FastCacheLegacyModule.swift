import Foundation
import React
import SDWebImage

@objc(FastCacheModule)
class FastCacheLegacyModule: NSObject {
    
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc func preload(_ sources: [[String: Any]]) {
        let manager = SDWebImageManager.shared
        
        for source in sources {
            guard let uri = source["uri"] as? String,
                  let url = URL(string: uri) else {
                continue
            }
            
            var options: SDWebImageOptions = [.retryFailed]
            
            // Handle cache control
            if let cache = source["cache"] as? String {
                switch cache {
                case "immutable":
                    options.insert(.refreshCached)
                case "web":
                    options.insert(.refreshCached)
                case "cacheOnly":
                    options.insert(.fromCacheOnly)
                default:
                    break
                }
            }
            
            // Configure context
            var context: [SDWebImageContextOption: Any] = [:]
            
            // Handle headers
            if let headers = source["headers"] as? [String: String], !headers.isEmpty {
                let modifier = SDWebImageDownloaderRequestModifier { request in
                    var mutableRequest = request
                    for (key, value) in headers {
                        mutableRequest.setValue(value, forHTTPHeaderField: key)
                    }
                    return mutableRequest
                }
                context[.downloadRequestModifier] = modifier
            }
            
            manager.loadImage(
                with: url,
                options: options,
                context: context,
                progress: nil
            ) { _, _, _, _, _, _ in
                // Preload completion - no action needed
            }
        }
    }
    
    @objc func clearMemoryCache(_ resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) {
        SDImageCache.shared.clearMemory()
        resolve(nil)
    }
    
    @objc func clearDiskCache(_ resolve: @escaping RCTPromiseResolveBlock,
                              rejecter reject: @escaping RCTPromiseRejectBlock) {
        SDImageCache.shared.clearDisk {
            resolve(nil)
        }
    }
    
    @objc func getCacheSize(_ resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
        SDImageCache.shared.calculateSize { fileCount, totalSize in
            resolve([
                "size": totalSize,
                "fileCount": fileCount
            ])
        }
    }
    
    @objc func getCachePath(_ resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) {
        let cachePath = SDImageCache.shared.diskCachePath
        resolve(cachePath)
    }
}


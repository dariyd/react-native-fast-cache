import UIKit
import React
import SDWebImage

@objc(FastCacheImageView)
class FastCacheImageView: SDAnimatedImageView {
    
    // MARK: - Props
    @objc var source: NSDictionary? {
        didSet {
            loadImage()
        }
    }
    
    @objc var defaultSource: NSNumber? {
        didSet {
            // Note: Default source (local assets) would require React Native's image loading
            // For now, this is a placeholder for future implementation
        }
    }
    
    @objc var resizeMode: String = "cover" {
        didSet {
            updateContentMode()
        }
    }
    
    @objc override var tintColor: UIColor? {
        didSet {
            if let tintColor = tintColor {
                self.image = self.image?.withRenderingMode(.alwaysTemplate)
                super.tintColor = tintColor
            }
        }
    }
    
    @objc var borderRadius: CGFloat = 0 {
        didSet {
            layer.cornerRadius = borderRadius
            layer.masksToBounds = borderRadius > 0
        }
    }
    
    // MARK: - Events
    @objc var onFastCacheLoadStart: RCTDirectEventBlock?
    @objc var onFastCacheProgress: RCTDirectEventBlock?
    @objc var onFastCacheLoad: RCTDirectEventBlock?
    @objc var onFastCacheError: RCTDirectEventBlock?
    @objc var onFastCacheLoadEnd: RCTDirectEventBlock?
    
    // MARK: - Init
    override init(frame: CGRect) {
        super.init(frame: frame)
        setup()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setup()
    }
    
    private func setup() {
        self.clipsToBounds = true
        self.contentMode = .scaleAspectFill
        self.backgroundColor = .clear
    }
    
    // MARK: - Content Mode
    private func updateContentMode() {
        switch resizeMode {
        case "contain":
            self.contentMode = .scaleAspectFit
        case "cover":
            self.contentMode = .scaleAspectFill
        case "stretch":
            self.contentMode = .scaleToFill
        case "center":
            self.contentMode = .center
        default:
            self.contentMode = .scaleAspectFill
        }
    }
    
    // MARK: - Image Loading
    private func loadImage() {
        guard let source = source,
              let uri = source["uri"] as? String,
              let url = URL(string: uri) else {
            return
        }
        
        // Fire onLoadStart
        onFastCacheLoadStart?([:])
        
        // Configure options
        var options: SDWebImageOptions = [.retryFailed, .handleCookies]
        
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
        
        // Handle priority
        var priority: Float = 0.5 // Normal priority
        if let priorityStr = source["priority"] as? String {
            switch priorityStr {
            case "low":
                priority = 0.25
            case "high":
                priority = 1.0
            default:
                priority = 0.5
            }
        }
        
        // Configure context
        var context: [SDWebImageContextOption: Any] = [:]
        
        // Handle headers (supports array of {key,value} or dictionary for back-compat)
        var headersDict: [String: String] = [:]
        if let headerArray = source["headers"] as? [[String: String]] {
            for entry in headerArray {
                if let k = entry["key"], let v = entry["value"] {
                    headersDict[k] = v
                }
            }
        } else if let headers = source["headers"] as? [String: String] {
            headersDict = headers
        }
        if !headersDict.isEmpty {
            let modifier = SDWebImageDownloaderRequestModifier { request in
                var mutableRequest = request
                for (key, value) in headersDict {
                    mutableRequest.setValue(value, forHTTPHeaderField: key)
                }
                return mutableRequest
            }
            context[.downloadRequestModifier] = modifier
        }
        
        // Load image
        self.sd_setImage(
            with: url,
            placeholderImage: self.image,
            options: options,
            context: context,
            progress: { [weak self] receivedSize, expectedSize, _ in
                guard let self = self else { return }
                let progress = expectedSize > 0 ? Double(receivedSize) / Double(expectedSize) : 0
                self.onFastCacheProgress?([
                    "loaded": receivedSize,
                    "total": expectedSize
                ])
            },
            completed: { [weak self] image, error, cacheType, url in
                guard let self = self else { return }
                
                if let error = error {
                    self.onFastCacheError?([
                        "error": error.localizedDescription
                    ])
                } else if let image = image {
                    self.onFastCacheLoad?([
                        "width": image.size.width,
                        "height": image.size.height
                    ])
                }
                
                self.onFastCacheLoadEnd?([:])
            }
        )
    }
    
    override open func layoutSubviews() {
        super.layoutSubviews()
        
        // Apply border radius from layer
        if layer.cornerRadius > 0 {
            self.layer.masksToBounds = true
        }
    }
}

// MARK: - RCTConvert Extensions
// Note: Default source (local assets) support would require additional React Native setup
// For now, we'll just return nil for local assets


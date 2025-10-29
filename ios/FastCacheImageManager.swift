import Foundation
import UIKit
import React

@objc(FastCacheImageManager)
class FastCacheImageManager: RCTViewManager {
    
    override func view() -> UIView! {
        return FastCacheImageView(frame: .zero)
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
}


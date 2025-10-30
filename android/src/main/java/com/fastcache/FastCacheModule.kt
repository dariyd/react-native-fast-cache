package com.fastcache

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray

/**
 * Legacy module for Old Architecture
 */
class FastCacheModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String = "FastCacheModule"
    
    @ReactMethod
    fun preload(sources: ReadableArray) {
        FastCacheModuleImpl.preload(reactContext, sources)
    }
    
    @ReactMethod
    fun clearMemoryCache(promise: Promise) {
        FastCacheModuleImpl.clearMemoryCache(reactContext, promise)
    }
    
    @ReactMethod
    fun clearDiskCache(promise: Promise) {
        FastCacheModuleImpl.clearDiskCache(reactContext, promise)
    }
    
    @ReactMethod
    fun getCacheSize(promise: Promise) {
        FastCacheModuleImpl.getCacheSize(reactContext, promise)
    }
    
    @ReactMethod
    fun getCachePath(promise: Promise) {
        FastCacheModuleImpl.getCachePath(reactContext, promise)
    }
}


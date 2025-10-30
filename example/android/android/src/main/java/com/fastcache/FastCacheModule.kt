package com.fastcache

import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.bumptech.glide.request.RequestOptions
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableNativeMap
import java.io.File

class FastCacheModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String = "FastCacheModule"
    
    @ReactMethod
    fun preload(sources: ReadableArray) {
        val context = reactContext.currentActivity ?: reactContext
        
        for (i in 0 until sources.size()) {
            val source = sources.getMap(i) ?: continue
            val uri = source.getString("uri") ?: continue
            
            var options = RequestOptions()
                .diskCacheStrategy(DiskCacheStrategy.ALL)
            
            // Handle cache control
            if (source.hasKey("cache")) {
                when (source.getString("cache")) {
                    "immutable" -> {
                        options = options.diskCacheStrategy(DiskCacheStrategy.ALL)
                    }
                    "web" -> {
                        options = options.diskCacheStrategy(DiskCacheStrategy.AUTOMATIC)
                    }
                    "cacheOnly" -> {
                        options = options.onlyRetrieveFromCache(true)
                    }
                }
            }
            
            Glide.with(context)
                .load(uri)
                .apply(options)
                .preload()
        }
    }
    
    @ReactMethod
    fun clearMemoryCache(promise: Promise) {
        try {
            val context = reactContext.currentActivity ?: reactContext
            Glide.get(context).clearMemory()
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("CLEAR_MEMORY_CACHE_ERROR", e.message, e)
        }
    }
    
    @ReactMethod
    fun clearDiskCache(promise: Promise) {
        try {
            Thread {
                try {
                    val context = reactContext.currentActivity ?: reactContext
                    Glide.get(context).clearDiskCache()
                    promise.resolve(null)
                } catch (e: Exception) {
                    promise.reject("CLEAR_DISK_CACHE_ERROR", e.message, e)
                }
            }.start()
        } catch (e: Exception) {
            promise.reject("CLEAR_DISK_CACHE_ERROR", e.message, e)
        }
    }
    
    @ReactMethod
    fun getCacheSize(promise: Promise) {
        try {
            Thread {
                try {
                    val cacheDir = reactContext.cacheDir
                    val glideCache = File(cacheDir, "image_manager_disk_cache")
                    val size = calculateDirSize(glideCache)
                    val fileCount = countFiles(glideCache)
                    
                    val result = WritableNativeMap().apply {
                        putDouble("size", size.toDouble())
                        putInt("fileCount", fileCount)
                    }
                    promise.resolve(result)
                } catch (e: Exception) {
                    promise.reject("GET_CACHE_SIZE_ERROR", e.message, e)
                }
            }.start()
        } catch (e: Exception) {
            promise.reject("GET_CACHE_SIZE_ERROR", e.message, e)
        }
    }
    
    @ReactMethod
    fun getCachePath(promise: Promise) {
        try {
            val cacheDir = reactContext.cacheDir
            val glideCache = File(cacheDir, "image_manager_disk_cache")
            promise.resolve(glideCache.absolutePath)
        } catch (e: Exception) {
            promise.reject("GET_CACHE_PATH_ERROR", e.message, e)
        }
    }
    
    private fun calculateDirSize(dir: File): Long {
        if (!dir.exists()) return 0
        var size: Long = 0
        val files = dir.listFiles() ?: return 0
        for (file in files) {
            size += if (file.isDirectory) {
                calculateDirSize(file)
            } else {
                file.length()
            }
        }
        return size
    }
    
    private fun countFiles(dir: File): Int {
        if (!dir.exists()) return 0
        var count = 0
        val files = dir.listFiles() ?: return 0
        for (file in files) {
            count += if (file.isDirectory) {
                countFiles(file)
            } else {
                1
            }
        }
        return count
    }
}


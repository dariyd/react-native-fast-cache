package com.fastcache

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class FastCacheImageManager : SimpleViewManager<FastCacheImageView>() {
    
    override fun getName(): String = "FastCacheImage"
    
    override fun createViewInstance(reactContext: ThemedReactContext): FastCacheImageView {
        return FastCacheImageView(reactContext)
    }
    
    @ReactProp(name = "source")
    fun setSource(view: FastCacheImageView, source: ReadableMap?) {
        view.setSource(source)
    }
    
    @ReactProp(name = "resizeMode")
    fun setResizeMode(view: FastCacheImageView, mode: String?) {
        view.setResizeMode(mode ?: "cover")
    }
    
    @ReactProp(name = "tintColor", customType = "Color")
    fun setTintColor(view: FastCacheImageView, color: Int?) {
        view.setTintColor(color)
    }
    
    // Override BaseViewManager's borderRadius handler so style borderRadius works without conflict
    override fun setBorderRadius(view: FastCacheImageView, radius: Float) {
        view.setBorderRadius(radius)
    }
    
    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any>? {
        return MapBuilder.of(
            "onFastCacheLoadStart", MapBuilder.of("registrationName", "onFastCacheLoadStart"),
            "onFastCacheProgress", MapBuilder.of("registrationName", "onFastCacheProgress"),
            "onFastCacheLoad", MapBuilder.of("registrationName", "onFastCacheLoad"),
            "onFastCacheError", MapBuilder.of("registrationName", "onFastCacheError"),
            "onFastCacheLoadEnd", MapBuilder.of("registrationName", "onFastCacheLoadEnd")
        )
    }
}


package com.fastcache

import android.content.Context
import android.graphics.Color
import android.graphics.PorterDuff
import android.graphics.drawable.Drawable
import androidx.appcompat.widget.AppCompatImageView
import com.bumptech.glide.Glide
import com.bumptech.glide.Priority
import com.bumptech.glide.load.DataSource
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.bumptech.glide.load.engine.GlideException
import com.bumptech.glide.load.resource.bitmap.RoundedCorners
import com.bumptech.glide.request.RequestListener
import com.bumptech.glide.request.RequestOptions
import com.bumptech.glide.request.target.Target
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.events.RCTEventEmitter

class FastCacheImageView(context: Context) : AppCompatImageView(context) {
    
    private var source: ReadableMap? = null
    private var resizeMode: String = "cover"
    private var tintColorValue: Int? = null
    private var borderRadiusValue: Float = 0f
    
    init {
        scaleType = ScaleType.CENTER_CROP
    }
    
    fun setSource(source: ReadableMap?) {
        this.source = source
        loadImage()
    }
    
    fun setResizeMode(mode: String) {
        this.resizeMode = mode
        updateScaleType()
    }
    
    fun setTintColor(color: Int?) {
        this.tintColorValue = color
        if (color != null) {
            setColorFilter(color, PorterDuff.Mode.SRC_IN)
        } else {
            clearColorFilter()
        }
    }
    
    fun setBorderRadius(radius: Float) {
        this.borderRadiusValue = radius
        loadImage() // Reload to apply radius
    }
    
    private fun updateScaleType() {
        scaleType = when (resizeMode) {
            "contain" -> ScaleType.FIT_CENTER
            "cover" -> ScaleType.CENTER_CROP
            "stretch" -> ScaleType.FIT_XY
            "center" -> ScaleType.CENTER_INSIDE
            else -> ScaleType.CENTER_CROP
        }
    }
    
    private fun loadImage() {
        val source = this.source ?: return
        val uri = source.getString("uri") ?: return
        
        // Send onLoadStart event
        sendEvent("onFastCacheLoadStart", Arguments.createMap())
        
        // Configure request options
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
        
        // Handle priority
        if (source.hasKey("priority")) {
            val priority = when (source.getString("priority")) {
                "low" -> Priority.LOW
                "high" -> Priority.HIGH
                else -> Priority.NORMAL
            }
            options = options.priority(priority)
        }
        
        // Handle border radius
        if (borderRadiusValue > 0) {
            options = options.transform(RoundedCorners(borderRadiusValue.toInt()))
        }
        
        // Build Glide request
        val requestBuilder = Glide.with(context)
            .load(uri)
            .apply(options)
            .listener(object : RequestListener<Drawable> {
                override fun onLoadFailed(
                    e: GlideException?,
                    model: Any?,
                    target: Target<Drawable>,
                    isFirstResource: Boolean
                ): Boolean {
                    val errorMap = Arguments.createMap().apply {
                        putString("error", e?.message ?: "Image load failed")
                    }
                    sendEvent("onFastCacheError", errorMap)
                    sendEvent("onFastCacheLoadEnd", Arguments.createMap())
                    return false
                }
                
                override fun onResourceReady(
                    resource: Drawable,
                    model: Any,
                    target: Target<Drawable>?,
                    dataSource: DataSource,
                    isFirstResource: Boolean
                ): Boolean {
                    val loadMap = Arguments.createMap().apply {
                        putInt("width", resource.intrinsicWidth)
                        putInt("height", resource.intrinsicHeight)
                    }
                    sendEvent("onFastCacheLoad", loadMap)
                    sendEvent("onFastCacheLoadEnd", Arguments.createMap())
                    return false
                }
            })
        
        // Handle headers (using custom headers would require a custom ModelLoader)
        // For now, we'll load the image
        requestBuilder.into(this)
    }
    
    private fun sendEvent(eventName: String, params: com.facebook.react.bridge.WritableMap) {
        val reactContext = context as? ReactContext ?: return
        reactContext.getJSModule(RCTEventEmitter::class.java)
            .receiveEvent(id, eventName, params)
    }
}


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
import com.bumptech.glide.load.model.GlideUrl
import com.bumptech.glide.load.model.LazyHeaders

class FastCacheImageView(context: Context) : AppCompatImageView(context) {
    
    private var source: ReadableMap? = null
    private var resizeMode: String = "cover"
    private var tintColorValue: Int? = null
    private var borderRadiusValue: Float = 0f
    private var needsLoad: Boolean = false
    private var currentUri: String? = null
    
    init {
        scaleType = ScaleType.CENTER_CROP
    }
    
    fun setSource(source: ReadableMap?) {
        this.source = source
        needsLoad = true
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
        needsLoad = true
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
    
    fun commitChanges() {
        if (!needsLoad) return
        needsLoad = false
        loadImage()
    }

    private fun loadImage() {
        val source = this.source ?: return
        val uri = source.getString("uri") ?: return
        currentUri = uri
        
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
        
        // Prepare headers if provided
        var model: Any = uri
        if (source.hasKey("headers")) {
            val headersArray = source.getArray("headers")
            if (headersArray != null && headersArray.size() > 0) {
                val builder = LazyHeaders.Builder()
                for (i in 0 until headersArray.size()) {
                    val headerMap = headersArray.getMap(i)
                    if (headerMap != null && headerMap.hasKey("key") && headerMap.hasKey("value")) {
                        val key = headerMap.getString("key") ?: continue
                        val value = headerMap.getString("value") ?: continue
                        builder.addHeader(key, value)
                    }
                }
                model = GlideUrl(uri, builder.build())
            }
        }

        // Register for progress updates
        ProgressInterceptor.expect(uri, object : ProgressInterceptor.Listener {
            override fun onProgress(url: String, bytesRead: Long, contentLength: Long, done: Boolean) {
                val map = Arguments.createMap().apply {
                    putDouble("loaded", bytesRead.toDouble())
                    putDouble("total", if (contentLength > 0) contentLength.toDouble() else 0.0)
                }
                post { sendEvent("onFastCacheProgress", map) }
                if (done) {
                    ProgressInterceptor.forget(url)
                }
            }
        })

        // Build Glide request
        val requestBuilder = Glide.with(context)
            .load(model)
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
                    post { sendEvent("onFastCacheError", errorMap) }
                    ProgressInterceptor.forget(uri)
                    post { sendEvent("onFastCacheLoadEnd", Arguments.createMap()) }
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
                    post { sendEvent("onFastCacheLoad", loadMap) }
                    ProgressInterceptor.forget(uri)
                    post { sendEvent("onFastCacheLoadEnd", Arguments.createMap()) }
                    return false
                }
            })
        
        requestBuilder.into(this)
    }

    override fun onDetachedFromWindow() {
        currentUri?.let { ProgressInterceptor.forget(it) }
        super.onDetachedFromWindow()
    }
    
    private fun sendEvent(eventName: String, params: com.facebook.react.bridge.WritableMap) {
        val reactContext = context as? ReactContext ?: return
        reactContext.getJSModule(RCTEventEmitter::class.java)
            .receiveEvent(id, eventName, params)
    }
}


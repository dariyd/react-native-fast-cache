package com.fastcache

import okhttp3.Interceptor
import okhttp3.MediaType
import okhttp3.Response
import okhttp3.ResponseBody
import okio.Buffer
import okio.BufferedSource
import okio.ForwardingSource
import okio.Source
import okio.buffer

class ProgressResponseBody(
    private val url: String,
    private val responseBody: ResponseBody
) : ResponseBody() {
    private var bufferedSource: BufferedSource? = null

    override fun contentType(): MediaType? = responseBody.contentType()

    override fun contentLength(): Long = responseBody.contentLength()

    override fun source(): BufferedSource {
        if (bufferedSource == null) {
            bufferedSource = wrapSource(responseBody.source()).buffer()
        }
        return bufferedSource!!
    }

    private fun wrapSource(source: Source): Source {
        return object : ForwardingSource(source) {
            var totalBytesRead = 0L
            override fun read(sink: Buffer, byteCount: Long): Long {
                val bytesRead = super.read(sink, byteCount)
                if (bytesRead != -1L) {
                    totalBytesRead += bytesRead
                }
                ProgressInterceptor.dispatch(
                    url,
                    totalBytesRead,
                    responseBody.contentLength(),
                    bytesRead == -1L
                )
                return bytesRead
            }
        }
    }
}

object ProgressInterceptor : Interceptor {
    interface Listener {
        fun onProgress(url: String, bytesRead: Long, contentLength: Long, done: Boolean)
    }

    private val listeners: MutableMap<String, Listener> = mutableMapOf()

    fun expect(url: String, listener: Listener) {
        synchronized(listeners) {
            listeners[url] = listener
        }
    }

    fun forget(url: String) {
        synchronized(listeners) {
            listeners.remove(url)
        }
    }

    internal fun dispatch(url: String, bytesRead: Long, contentLength: Long, done: Boolean) {
        val listener = synchronized(listeners) { listeners[url] }
        listener?.onProgress(url, bytesRead, contentLength, done)
        if (done) forget(url)
    }

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val response = chain.proceed(request)
        val body = response.body
        return if (body != null) {
            response.newBuilder()
                .body(ProgressResponseBody(request.url.toString(), body))
                .build()
        } else {
            response
        }
    }
}



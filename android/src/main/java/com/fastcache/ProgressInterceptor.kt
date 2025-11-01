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

private const val PROGRESS_HEADER = "X-FastCache-Progress-Id"

class ProgressResponseBody(
    private val requestId: String?,
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
                requestId?.let { id ->
                    ProgressInterceptor.dispatch(
                        id,
                        totalBytesRead,
                        responseBody.contentLength(),
                        bytesRead == -1L
                    )
                }
                return bytesRead
            }
        }
    }
}

object ProgressInterceptor : Interceptor {
    interface Listener {
        fun onProgress(id: String, bytesRead: Long, contentLength: Long, done: Boolean)
    }

    private val listeners: LinkedHashMap<String, Listener> = LinkedHashMap()

    fun expect(id: String, listener: Listener) {
        synchronized(listeners) {
            listeners[id] = listener
        }
    }

    fun forget(id: String) {
        synchronized(listeners) {
            listeners.remove(id)
        }
    }

    internal fun dispatch(id: String, bytesRead: Long, contentLength: Long, done: Boolean) {
        val listener = synchronized(listeners) { listeners[id] }
        listener?.onProgress(id, bytesRead, contentLength, done)
        if (done) forget(id)
    }

    override fun intercept(chain: Interceptor.Chain): Response {
        val request = chain.request()
        val requestId = request.header(PROGRESS_HEADER)
        val response = chain.proceed(request)
        val body = response.body
        return if (body != null) {
            response.newBuilder()
                .body(ProgressResponseBody(requestId, body))
                .build()
        } else {
            response
        }
    }
}



import React, { forwardRef, useCallback } from 'react';
import {
  Image,
  NativeModules,
  StyleSheet,
  View,
} from 'react-native';
import FastCacheImageNative from './NativeFastCacheImage';


const FastCacheImage = forwardRef((props, ref) => {
  const {
    source,
    defaultSource,
    resizeMode = 'cover',
    onLoadStart,
    onProgress,
    onLoad,
    onError,
    onLoadEnd,
    style,
    tintColor,
    fallback = false,
    children,
    ...otherProps
  } = props;

  // Use fallback to regular Image if specified
  if (fallback) {
    return (
      <Image
        ref={ref}
        source={source}
        defaultSource={defaultSource}
        resizeMode={resizeMode}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
        onLoad={onLoad}
        onError={onError}
        onLoadEnd={onLoadEnd}
        style={style}
        tintColor={tintColor}
        {...otherProps}
      >
        {children}
      </Image>
    );
  }

  // Event handlers for native events
  const handleLoadStart = useCallback(() => {
    onLoadStart?.();
  }, [onLoadStart]);

  const handleProgress = useCallback(
    (event) => {
      onProgress?.(event.nativeEvent);
    },
    [onProgress]
  );

  const handleLoad = useCallback(
    (event) => {
      onLoad?.(event.nativeEvent);
    },
    [onLoad]
  );

  const handleError = useCallback(
    (event) => {
      onError?.(event.nativeEvent);
    },
    [onError]
  );

  const handleLoadEnd = useCallback(() => {
    onLoadEnd?.();
  }, [onLoadEnd]);

  // Extract border radius from style
  const flatStyle = StyleSheet.flatten(style) || {};
  const borderRadius = flatStyle.borderRadius || 0;

  return (
    <View style={[styles.imageContainer, style]} ref={ref}>
      <FastCacheImageNative
        style={styles.image}
        source={source}
        defaultSource={defaultSource}
        resizeMode={resizeMode}
        tintColor={tintColor}
        borderRadius={borderRadius}
        onFastCacheLoadStart={handleLoadStart}
        onFastCacheProgress={handleProgress}
        onFastCacheLoad={handleLoad}
        onFastCacheError={handleError}
        onFastCacheLoadEnd={handleLoadEnd}
        {...otherProps}
      />
      {children}
    </View>
  );
});

FastCacheImage.displayName = 'FastCacheImage';

const styles = StyleSheet.create({
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
});

export default FastCacheImage;


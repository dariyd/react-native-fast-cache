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

  // Extract border radius from style
  const flatStyle = StyleSheet.flatten(style) || {};
  const borderRadius = flatStyle.borderRadius || 0;

  return (
    <View style={[styles.imageContainer, style]} ref={ref}>
      <FastCacheImageNative
        style={styles.image}
        source={source}
        resizeMode={resizeMode}
        tintColor={tintColor}
        borderRadius={borderRadius}
        onFastCacheLoadStart={onLoadStart}
        onFastCacheProgress={onProgress}
        onFastCacheLoad={onLoad}
        onFastCacheError={onError}
        onFastCacheLoadEnd={onLoadEnd}
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


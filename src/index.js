import { Platform } from 'react-native';
import FastCacheImage from './FastCacheImage';
import NativeFastCacheModule from './NativeFastCacheModule';

const FastCacheModule = NativeFastCacheModule;

// Enums
const resizeMode = {
  contain: 'contain',
  cover: 'cover',
  stretch: 'stretch',
  center: 'center',
};

const priority = {
  low: 'low',
  normal: 'normal',
  high: 'high',
};

const cacheControl = {
  // Only updates if url changes
  immutable: 'immutable',
  // Use headers and follow normal caching procedures
  web: 'web',
  // Only show images from cache, do not make any network requests
  cacheOnly: 'cacheOnly',
};

// Static methods
FastCacheImage.preload = (sources) => {
  if (!FastCacheModule) {
    console.warn('FastCacheModule is not available');
    return;
  }
  FastCacheModule.preload(sources);
};

FastCacheImage.clearMemoryCache = () => {
  if (!FastCacheModule) {
    console.warn('FastCacheModule is not available');
    return Promise.resolve();
  }
  return FastCacheModule.clearMemoryCache();
};

FastCacheImage.clearDiskCache = () => {
  if (!FastCacheModule) {
    console.warn('FastCacheModule is not available');
    return Promise.resolve();
  }
  return FastCacheModule.clearDiskCache();
};

FastCacheImage.getCacheSize = () => {
  if (!FastCacheModule) {
    console.warn('FastCacheModule is not available');
    return Promise.resolve({ size: 0, fileCount: 0 });
  }
  return FastCacheModule.getCacheSize();
};

FastCacheImage.getCachePath = () => {
  if (!FastCacheModule) {
    console.warn('FastCacheModule is not available');
    return Promise.resolve('');
  }
  return FastCacheModule.getCachePath();
};

// Attach enums
FastCacheImage.resizeMode = resizeMode;
FastCacheImage.priority = priority;
FastCacheImage.cacheControl = cacheControl;

export default FastCacheImage;

export {
  resizeMode,
  priority,
  cacheControl,
};


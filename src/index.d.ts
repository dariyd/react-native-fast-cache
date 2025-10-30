import { Component } from 'react';
import { ImageStyle, StyleProp, ImageSourcePropType } from 'react-native';

export enum ResizeMode {
  contain = 'contain',
  cover = 'cover',
  stretch = 'stretch',
  center = 'center',
}

export enum Priority {
  low = 'low',
  normal = 'normal',
  high = 'high',
}

export enum CacheControl {
  immutable = 'immutable',
  web = 'web',
  cacheOnly = 'cacheOnly',
}

export interface Source {
  uri?: string;
  headers?: { [key: string]: string };
  priority?: Priority | keyof typeof Priority;
  cache?: CacheControl | keyof typeof CacheControl;
}

export interface OnLoadEvent {
  width: number;
  height: number;
}

export interface OnProgressEvent {
  loaded: number;
  total: number;
}

export interface OnErrorEvent {
  error: string;
}

export interface FastCacheImageProps {
  source?: Source;
  resizeMode?: ResizeMode | keyof typeof ResizeMode;
  onLoadStart?(): void;
  onProgress?(event: OnProgressEvent): void;
  onLoad?(event: OnLoadEvent): void;
  onError?(event: OnErrorEvent): void;
  onLoadEnd?(): void;
  style?: StyleProp<ImageStyle>;
  tintColor?: string | number;
  fallback?: boolean;
  children?: React.ReactNode;
}

export interface CacheSizeResult {
  size: number;
  fileCount: number;
}

export default class FastCacheImage extends Component<FastCacheImageProps> {
  static resizeMode: typeof ResizeMode;
  static priority: typeof Priority;
  static cacheControl: typeof CacheControl;
  
  /**
   * Preload images to display later
   */
  static preload(sources: Source[]): void;
  
  /**
   * Clear all images from memory cache
   */
  static clearMemoryCache(): Promise<void>;
  
  /**
   * Clear all images from disk cache
   */
  static clearDiskCache(): Promise<void>;
  
  /**
   * Get the size of the disk cache
   */
  static getCacheSize(): Promise<CacheSizeResult>;
  
  /**
   * Get the path to the disk cache directory
   */
  static getCachePath(): Promise<string>;
}

export const resizeMode: typeof ResizeMode;
export const priority: typeof Priority;
export const cacheControl: typeof CacheControl;


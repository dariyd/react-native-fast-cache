import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type HeaderEntry = Readonly<{ key: string; value: string }>;

export type ImageSource = Readonly<{
  uri: string;
  headers?: ReadonlyArray<HeaderEntry>;
  priority?: string;
  cache?: string;
}>;

export type CacheSizeInfo = Readonly<{
  size: number;
  fileCount: number;
}>;

export interface Spec extends TurboModule {
  preload(sources: readonly ImageSource[]): void;
  clearMemoryCache(): Promise<void>;
  clearDiskCache(): Promise<void>;
  getCacheSize(): Promise<CacheSizeInfo>;
  getCachePath(): Promise<string>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('FastCacheModule');


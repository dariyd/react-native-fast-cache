import type { HostComponent, ViewProps, ColorValue } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { DirectEventHandler, Int32, Double } from 'react-native/Libraries/Types/CodegenTypes';

type HeaderEntry = Readonly<{ key: string; value: string }>;

type Source = Readonly<{
  uri: string;
  headers?: ReadonlyArray<HeaderEntry>;
  priority?: string;
  cache?: string;
}>;

export interface NativeProps extends ViewProps {
  source?: Source;
  resizeMode?: string;
  tintColor?: ColorValue;
  borderRadius?: Double;

  onFastCacheLoadStart?: DirectEventHandler<{}>;
  onFastCacheProgress?: DirectEventHandler<Readonly<{ loaded: Double; total: Double }>>;
  onFastCacheLoad?: DirectEventHandler<Readonly<{ width: Double; height: Double }>>;
  onFastCacheError?: DirectEventHandler<Readonly<{ error: string }>>;
  onFastCacheLoadEnd?: DirectEventHandler<{}>;
}

// @ts-expect-error useLegacyViewManagerAdapter is supported by RN codegen runtime
export default codegenNativeComponent<NativeProps>('FastCacheImage', {
  interfaceOnly: false,
  paperComponentName: 'FastCacheImage',
  useLegacyViewManagerAdapter: true,
}) as HostComponent<NativeProps>;



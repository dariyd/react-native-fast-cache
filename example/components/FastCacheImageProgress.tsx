import React from 'react';
import { View, Text, StyleSheet, ViewStyle, ImageStyle } from 'react-native';
import FastCacheImage from 'react-native-fast-cache';

type Props = {
  source: { uri: string; headers?: { [key: string]: string }; priority?: string; cache?: string };
  style?: ViewStyle | ImageStyle | (ViewStyle | ImageStyle)[];
  resizeMode?: string;
  tintColor?: string;
  fallback?: boolean;
  progressColor?: string;
  progressBackgroundColor?: string;
  progressHeight?: number;
  showPercentage?: boolean;
  children?: React.ReactNode;
};

function clamp01(n: number) {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

const FastCacheImageProgress: React.FC<Props> = ({
  source,
  style,
  resizeMode = 'cover',
  tintColor,
  fallback,
  progressColor = '#007AFF',
  progressBackgroundColor = '#E5E5EA',
  progressHeight = 3,
  showPercentage = false,
  children,
  ...rest
}) => {
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const handleLoadStart = React.useCallback(() => {
    setLoading(true);
    setProgress(0);
  }, []);

  const handleProgress = React.useCallback((event: any) => {
    const loaded = Number(event?.loaded) || 0;
    const total = Number(event?.total) || 0;
    const value = total > 0 ? loaded / total : 0;
    setProgress(clamp01(value));
  }, []);

  const handleLoadEnd = React.useCallback(() => {
    setLoading(false);
    setProgress(1);
  }, []);

  console.log('loading', loading, progress, source.uri);

  return (
    <View style={style}>
      <FastCacheImage
        style={StyleSheet.absoluteFill}
        source={source}
        resizeMode={resizeMode}
        tintColor={tintColor}
        fallback={fallback}
        onLoadStart={handleLoadStart}
        onProgress={handleProgress}
        onLoadEnd={handleLoadEnd}
        {...rest}
      />

      {children}

      {loading ? (
        <View style={styles.progressContainer} pointerEvents="none">
          <View style={[styles.progressBar, { backgroundColor: progressBackgroundColor, height: progressHeight }]}> 
            <View style={[styles.progressFill, { backgroundColor: progressColor, width: `${progress * 100}%` }]} />
          </View>
          {showPercentage ? (
            <Text style={styles.percentLabel}>{Math.round(progress * 100)}%</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  progressBar: {
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  percentLabel: {
    marginTop: 2,
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
  },
});

export default React.memo(FastCacheImageProgress);



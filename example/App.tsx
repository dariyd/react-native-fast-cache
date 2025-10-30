import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  useColorScheme,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import FastCacheImage from 'react-native-fast-cache';

const SAMPLE_IMAGES = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2',
  'https://picsum.photos/400/300?random=3',
  'https://picsum.photos/400/300?random=4',
  'https://picsum.photos/400/300?random=5',
];

const GIF_IMAGE = 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [cacheInfo, setCacheInfo] = useState({ size: 0, fileCount: 0 });
  const [cachePath, setCachePath] = useState('');
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const manyImages = React.useMemo(
    () => Array.from({ length: 400 }, (_, i) => `https://picsum.photos/400/300?random=${i + 1000}`),
    []
  );
  
  // Calculate fixed dimensions for smooth scrolling
  const SCREEN_WIDTH = Dimensions.get('window').width;
  const NUM_COLUMNS = 3;
  const SPACING = 8;
  const ITEM_WIDTH = (SCREEN_WIDTH - (SPACING * (NUM_COLUMNS + 1))) / NUM_COLUMNS;
  const ITEM_HEIGHT = ITEM_WIDTH * 0.75; // Maintain aspect ratio
  
  const renderItem = React.useCallback(({ item }: { item: string }) => (
    <View style={styles.imageWrapper}>
      <FastCacheImage
        style={[styles.listImage, { width: ITEM_WIDTH, height: ITEM_HEIGHT }]}
        source={{ uri: item, cache: FastCacheImage.cacheControl.immutable }}
        resizeMode={FastCacheImage.resizeMode.cover}
      />
    </View>
  ), [ITEM_WIDTH, ITEM_HEIGHT]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
  };

  const updateCacheInfo = useCallback(async () => {
    const info = await FastCacheImage.getCacheSize();
    setCacheInfo(info);
    const path = await FastCacheImage.getCachePath();
    setCachePath(path);
  }, []);

  const handlePreload = useCallback(() => {
    const sources = SAMPLE_IMAGES.map(uri => ({
      uri,
      priority: FastCacheImage.priority.high,
      cache: FastCacheImage.cacheControl.immutable,
    }));
    FastCacheImage.preload(sources);
    Alert.alert('Preloading images...');
  }, []);

  const handleClearMemoryCache = useCallback(async () => {
    await FastCacheImage.clearMemoryCache();
    Alert.alert('Memory cache cleared!');
  }, []);

  const handleClearDiskCache = useCallback(async () => {
    await FastCacheImage.clearDiskCache();
    Alert.alert('Disk cache cleared!');
    updateCacheInfo();
  }, [updateCacheInfo]);

  const handleLoadStart = useCallback((id: string) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    setProgress(prev => ({ ...prev, [id]: 0 }));
  }, []);

  const handleProgress = useCallback((id: string, event: any) => {
    const progressValue = event.loaded / event.total;
    setProgress(prev => ({ ...prev, [id]: progressValue }));
  }, []);

  const handleLoadEnd = useCallback((id: string) => {
    setLoading(prev => ({ ...prev, [id]: false }));
  }, []);

  const renderHeader = useCallback(() => (
    <View style={styles.content}>
      <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>FastCacheImage Demo</Text>

      {/* Cache Controls */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Cache Management</Text>
        <Text style={[styles.info, { color: isDarkMode ? '#ccc' : '#666' }]}>Cache Size: {(cacheInfo.size / 1024 / 1024).toFixed(2)} MB</Text>
        <Text style={[styles.info, { color: isDarkMode ? '#ccc' : '#666' }]}>Files: {cacheInfo.fileCount}</Text>
        <Text style={[styles.info, { color: isDarkMode ? '#ccc' : '#666' }]} numberOfLines={1}>Path: {cachePath}</Text>
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrap}><Button title="Preload" onPress={handlePreload} /></View>
          <View style={styles.buttonWrap}><Button title="Clear Memory" onPress={handleClearMemoryCache} /></View>
          <View style={styles.buttonWrap}><Button title="Clear Disk" onPress={handleClearDiskCache} /></View>
          <View style={styles.buttonWrap}><Button title="Refresh Info" onPress={updateCacheInfo} /></View>
        </View>
      </View>

      {/* Resize Modes */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Resize Modes</Text>
        <View style={styles.grid}>
          {['cover', 'contain', 'stretch', 'center'].map((mode) => (
            <View key={mode} style={styles.gridItem}>
              <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>{mode}</Text>
              <FastCacheImage
                style={styles.image}
                source={{ uri: SAMPLE_IMAGES[0], priority: FastCacheImage.priority.normal }}
                resizeMode={mode as any}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Border Radius */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Border Radius</Text>
        <View style={styles.row}>
          <FastCacheImage style={[styles.image, { borderRadius: 0 }]} source={{ uri: SAMPLE_IMAGES[1] }} resizeMode={FastCacheImage.resizeMode.cover} />
          <FastCacheImage style={[styles.image, { borderRadius: 20 }]} source={{ uri: SAMPLE_IMAGES[1] }} resizeMode={FastCacheImage.resizeMode.cover} />
          <FastCacheImage style={[styles.image, { borderRadius: 50 }]} source={{ uri: SAMPLE_IMAGES[1] }} resizeMode={FastCacheImage.resizeMode.cover} />
        </View>
      </View>

      {/* Progress Indicators */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Load Progress</Text>
        <Text style={[styles.info, { color: isDarkMode ? '#ccc' : '#666' }]}>
          Shows loading progress with progress bars. Clear disk cache first to see loading.
        </Text>
        {SAMPLE_IMAGES.slice(0, 3).map((uri, index) => (
          <View key={index} style={styles.progressContainer}>
            <FastCacheImage
              style={styles.smallImage}
              source={{ uri }}
              onLoadStart={() => handleLoadStart(`img-${index}`)}
              onProgress={(e) => handleProgress(`img-${index}`, e)}
              onLoadEnd={() => handleLoadEnd(`img-${index}`)}
              resizeMode={FastCacheImage.resizeMode.cover}
            />
            <View style={styles.progressInfo}>
              <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Image {index + 1}</Text>
              {loading[`img-${index}`] ? (
                <>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(progress[`img-${index}`] || 0) * 100}%` }]} />
                  </View>
                  <ActivityIndicator size="small" />
                  <Text style={{ fontSize: 10, color: isDarkMode ? '#ccc' : '#666' }}>
                    {Math.round((progress[`img-${index}`] || 0) * 100)}%
                  </Text>
                </>
              ) : (
                <Text style={{ fontSize: 10, color: 'green' }}>✓ Loaded</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* GIF Support */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>GIF Support</Text>
        <FastCacheImage
          style={styles.gifImage}
          source={{ uri: GIF_IMAGE, priority: FastCacheImage.priority.high }}
          resizeMode={FastCacheImage.resizeMode.contain}
        />
      </View>

      {/* Priority Demo */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Priority Levels</Text>
        <View style={styles.row}>
          <View style={styles.priorityItem}>
            <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Low</Text>
            <FastCacheImage style={styles.image} source={{ uri: SAMPLE_IMAGES[2], priority: FastCacheImage.priority.low }} />
          </View>
          <View style={styles.priorityItem}>
            <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>Normal</Text>
            <FastCacheImage style={styles.image} source={{ uri: SAMPLE_IMAGES[3], priority: FastCacheImage.priority.normal }} />
          </View>
          <View style={styles.priorityItem}>
            <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>High</Text>
            <FastCacheImage style={styles.image} source={{ uri: SAMPLE_IMAGES[4], priority: FastCacheImage.priority.high }} />
          </View>
        </View>
      </View>

      {/* Tint Color */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>Tint Color</Text>
        <View style={styles.row}>
          <FastCacheImage style={styles.image} source={{ uri: SAMPLE_IMAGES[0] }} tintColor="#ff0000" />
          <FastCacheImage style={styles.image} source={{ uri: SAMPLE_IMAGES[0] }} tintColor="#00ff00" />
          <FastCacheImage style={styles.image} source={{ uri: SAMPLE_IMAGES[0] }} tintColor="#0000ff" />
        </View>
      </View>
    </View>
  ), [isDarkMode, cacheInfo, cachePath, loading, progress]);

  

  React.useEffect(() => {
    updateCacheInfo();
  }, [updateCacheInfo]);

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      <FlatList
        data={manyImages}
        renderItem={renderItem}
        keyExtractor={(_, index) => String(index)}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.column}
        getItemLayout={(data, index) => {
          const row = Math.floor(index / NUM_COLUMNS);
          const rowHeight = ITEM_HEIGHT + SPACING;
          return { 
            length: rowHeight,
            offset: row * rowHeight, 
            index 
          };
        }}
        contentContainerStyle={styles.listContent}
        windowSize={21}
        initialNumToRender={50}
        maxToRenderPerBatch={50}
        updateCellsBatchingPeriod={100}
        removeClippedSubviews={true}
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  info: {
    fontSize: 12,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  buttonWrap: {
    width: '48%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  priorityItem: {
    flex: 1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#eee',
  },
  smallImage: {
    width: 80,
    height: 80,
    backgroundColor: '#eee',
  },
  gifImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  progressInfo: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginVertical: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  imageWrapper: {
    padding: 4,
  },
  listImage: {
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  column: {
    justifyContent: 'space-between',
  },
});

export default App;

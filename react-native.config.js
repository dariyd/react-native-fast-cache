module.exports = {
  dependency: {
    platforms: {
      ios: {
        // Podspec is at the root
        podspecPath: './react-native-fast-cache.podspec',
      },
      android: {
        // Android module path
        sourceDir: './android',
        packageImportPath: 'import com.fastcache.FastCachePackage;',
        packageInstance: 'new FastCachePackage()',
      },
    },
  },
  codegenConfig: {
    name: 'reactnativefastcache',
    type: 'all',
    jsSrcsDir: 'src',
  },
};


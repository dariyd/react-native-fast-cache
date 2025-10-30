require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = "react-native-fast-cache"
  s.version      = package['version']
  s.summary      = package['description']
  s.homepage     = package['homepage']
  s.license      = package['license']
  s.authors      = package['author']
  s.platforms    = { :ios => "13.4" }
  s.source       = { :git => package['repository']['url'], :tag => "v#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"
  s.swift_version = '5.0'
  
  s.dependency 'React-Core'
  s.dependency 'SDWebImage', '~> 5.21'
  # WebP support for iOS 13+
  s.dependency 'SDWebImageWebPCoder', '~> 0.14'
  
  # New Architecture support
  if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    s.compiler_flags = "-DRCT_NEW_ARCH_ENABLED=1 -DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1"
    s.pod_target_xcconfig = {
      'DEFINES_MODULE' => 'YES',
      "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\" \"$(PODS_TARGET_SRCROOT)/ReactCommon\" \"$(PODS_ROOT)/RCT-Folly\" \"$(PODS_ROOT)/Headers/Private/React-Core\" \"${PODS_CONFIGURATION_BUILD_DIR}/React-Codegen/React_Codegen.framework/Headers\"",
      "CLANG_CXX_LANGUAGE_STANDARD" => "c++20"
    }
    
    s.dependency "React-RCTFabric"
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  else
    s.pod_target_xcconfig = {
      'DEFINES_MODULE' => 'YES'
    }
  end
end


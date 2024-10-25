require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'MdocDataTransfer'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platforms      = { :ios => '14.0' }
  s.swift_version  = '5.4'
  s.source         = { git: 'https://github.com/animo/mdoc-data-transfer' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,swift}"

  if defined?(:spm_dependency)
    spm_dependency(s,  
      url: 'https://github.com/eu-digital-identity-wallet/eudi-lib-ios-iso18013-data-transfer.git', 
      requirement: {kind: 'upToNextMajorVersion', minimumVersion: '0.3.3'}, 
      products: ['MdocDataTransfer18013'] 
    ) 
  else 
    raise "Please upgrade React Native to >=0.75.0 to use SPM dependencies." 
  end 

end

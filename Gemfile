source 'https://rubygems.org'
# You may use http://rbenv.org/ or https://rvm.io/ to install and use this version
ruby ">= 2.6.10"
gem 'cocoapods', '~> 1.12'
gem "fastlane"
plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval(File.read(plugins_path), binding) if File.exist?(plugins_path)
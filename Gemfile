# frozen_string_literal: true

source "https://rubygems.org"

# Include gemspec dependencies
gemspec

# Add Jekyll explicitly
gem "jekyll", "~> 4.3"

# Add Jekyll plugins you use
gem "jekyll-archives" # For archives functionality

# Test-related gem
gem "html-proofer", "~> 5.0", group: :test

# Platform-specific gems
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.2.0", :platforms => [:mingw, :x64_mingw, :mswin]

# Additional explicit gems
gem "logger"
gem "csv"
gem "base64", require: true # Optional: Use `require: false` if you don't need to auto-load

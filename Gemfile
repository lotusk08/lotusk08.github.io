# frozen_string_literal: true

source "https://rubygems.org"

# Core dependencies
gem "jekyll", "~> 4.4.1"
gem "jekyll-paginate", "~> 1.1.0"
gem "jekyll-redirect-from", "~> 0.16.0"
gem "jekyll-seo-tag", "~> 2.8.0"
gem "jekyll-archives", "~> 2.3.0"
gem "jekyll-sitemap", "~> 1.4.0"
gem "jekyll-include-cache", "~> 0.2.1"

# Testing dependencies
group :test do
  gem "html-proofer", "~> 5.0.10"
end

# Windows-specific gems
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.2.0", :platforms => [:mingw, :x64_mingw, :mswin]

# Core utilities
gem "logger", "~> 1.6.6"
gem "csv", "~> 3.3.2"
gem "base64", "~> 0.2.0"
gem "webrick", "~> 1.9.1"  # Required for Ruby 3.0+

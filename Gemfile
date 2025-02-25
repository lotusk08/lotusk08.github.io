# frozen_string_literal: true

source "https://rubygems.org"

# Add all dependencies that were in the gemspec
gem "jekyll", "~> 4.3"
gem "jekyll-paginate", "~> 1.1"
gem "jekyll-redirect-from", "~> 0.16"
gem "jekyll-seo-tag", "~> 2.8"
gem "jekyll-archives", "~> 2.2"
gem "jekyll-sitemap", "~> 1.4"
gem "jekyll-include-cache", "~> 0.2"

gem "html-proofer", "~> 5.0", group: :test

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.2.0", :platforms => [:mingw, :x64_mingw, :mswin]

# Keep these gems explicitly
gem 'logger'
gem 'csv'
gem 'base64', require: true

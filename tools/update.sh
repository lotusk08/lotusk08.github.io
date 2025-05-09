#!/bin/bash

# Script to download minified dependency files to assets/lib subdirectories in the main repository
# Includes Waline qq emojis (info.json and all GIFs listed in it)

# Check if jq is installed
if ! command -v jq &> /dev/null; then
	echo "Error: jq is required. Install it with 'brew install jq' (macOS) or 'sudo apt-get install jq' (Linux)."
	exit 1
fi

# Default package.json path (override with argument)
PACKAGE_JSON_PATH="${1:-assets/lib/package.json}"

# Check if package.json exists
if [ ! -f "$PACKAGE_JSON_PATH" ]; then
	echo "Error: package.json not found at $PACKAGE_JSON_PATH"
	exit 1
fi

# Function to download a file with curl
download_file() {
	local url=$1
	local output=$2
	mkdir -p "$(dirname "$output")"
	echo "Downloading $url to $output..."
	curl -s -o "$output" "$url"
	if [ $? -eq 0 ]; then
		echo "Successfully downloaded $output"
	else
		echo "Error downloading $url"
	fi
}

# Read versions from package.json
TOCBOT_VERSION=$(jq -r '.dependencies["tocbot"] // "4.32.2"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')
FONTAWESOME_VERSION=$(jq -r '.dependencies["@fortawesome/fontawesome-free"] // "6.7.1"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')
JETBRAINSMONO_VERSION=$(jq -r '.dependencies["@fontsource/jetbrains-mono"] // "5.0.19"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')
NOTOSERIFDISPLAY_VERSION=$(jq -r '.dependencies["@fontsource/noto-serif-display"] // "5.2.6"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')
SIMPLE_JEKYLL_SEARCH_VERSION=$(jq -r '.dependencies["simple-jekyll-search"] // "1.10.0"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')
MERMAID_VERSION=$(jq -r '.dependencies["mermaid"] // "11.4.0"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')
CHARTJS_VERSION=$(jq -r '.dependencies["chartjs"] // "4.4.9"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')
DAYJS_VERSION=$(jq -r '.dependencies["dayjs"] // "1.11.13"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')
GLIGHTBOX_VERSION=$(jq -r '.dependencies["glightbox"] // "3.3.0"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')
LAZYSIZES_VERSION=$(jq -r '.dependencies["lazysizes"] // "5.3.2"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')
CLIPBOARD_VERSION=$(jq -r '.dependencies["clipboard"] // "2.0.11"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')
MATHJAX_VERSION=$(jq -r '.dependencies["mathjax"] // "3.2.2"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')
WALINE_VERSION=$(jq -r '.dependencies["@waline/client"] // "3.0.0"' "$PACKAGE_JSON_PATH" | sed 's/^\^//')

# Download minified files to structured directories
# tocbot
download_file "https://cdn.jsdelivr.net/npm/tocbot@$TOCBOT_VERSION/dist/tocbot.min.css" "assets/lib/tocbot/tocbot.min.css"
download_file "https://cdn.jsdelivr.net/npm/tocbot@$TOCBOT_VERSION/dist/tocbot.min.js" "assets/lib/tocbot/tocbot.min.js"

# fontawesome
download_file "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@$FONTAWESOME_VERSION/css/all.min.css" "assets/lib/fontawesome-free/css/all.min.css"

# fonts (jetbrains-mono, noto-serif-display)
download_file "https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@$JETBRAINSMONO_VERSION/index.min.css" "assets/lib/fontsource/jetbrains-mono/index.min.css"
download_file "https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-display@$NOTOSERIFDISPLAY_VERSION/index.min.css" "assets/lib/fontsource/noto-serif-display/index.min.css"

# simple-jekyll-search
download_file "https://cdn.jsdelivr.net/npm/simple-jekyll-search@$SIMPLE_JEKYLL_SEARCH_VERSION/dest/simple-jekyll-search.min.js" "assets/lib/simple-jekyll-search/simple-jekyll-search.min.js"

# mermaid
download_file "https://cdn.jsdelivr.net/npm/mermaid@$MERMAID_VERSION/dist/mermaid.min.js" "assets/lib/mermaid/mermaid.min.js"

# chartjs
download_file "https://cdn.jsdelivr.net/npm/chart.js@$CHARTJS_VERSION/dist/chart.umd.min.js" "assets/lib/chartjs/chart.umd.min.js"

# dayjs
download_file "https://cdn.jsdelivr.net/npm/dayjs@$DAYJS_VERSION/dayjs.min.js" "assets/lib/dayjs/dayjs.min.js"
download_file "https://cdn.jsdelivr.net/npm/dayjs@$DAYJS_VERSION/locale/en.js" "assets/lib/dayjs/locale/en.js"
download_file "https://cdn.jsdelivr.net/npm/dayjs@$DAYJS_VERSION/plugin/relativeTime.js" "assets/lib/dayjs/plugin/relativeTime.js"
download_file "https://cdn.jsdelivr.net/npm/dayjs@$DAYJS_VERSION/plugin/localizedFormat.js" "assets/lib/dayjs/plugin/localizedFormat.js"

# glightbox
download_file "https://cdn.jsdelivr.net/npm/glightbox@$GLIGHTBOX_VERSION/dist/css/glightbox.min.css" "assets/lib/glightbox/glightbox.min.css"
download_file "https://cdn.jsdelivr.net/npm/glightbox@$GLIGHTBOX_VERSION/dist/js/glightbox.min.js" "assets/lib/glightbox/glightbox.min.js"

# lazy-polyfill (loading-attribute-polyfill)
download_file "https://cdn.jsdelivr.net/npm/loading-attribute-polyfill@$LAZYSIZES_VERSION/dist/loading-attribute-polyfill.min.css" "assets/lib/loading-attribute-polyfill/loading-attribute-polyfill.min.css"
download_file "https://cdn.jsdelivr.net/npm/loading-attribute-polyfill@$LAZYSIZES_VERSION/dist/loading-attribute-polyfill.umd.min.js" "assets/lib/loading-attribute-polyfill/loading-attribute-polyfill.umd.min.js"

# clipboard
download_file "https://cdn.jsdelivr.net/npm/clipboard@$CLIPBOARD_VERSION/dist/clipboard.min.js" "assets/lib/clipboard/clipboard.min.js"

# mathjax
download_file "https://cdn.jsdelivr.net/npm/mathjax@$MATHJAX_VERSION/es5/tex-chtml.js" "assets/lib/mathjax/tex-chtml.js"

# waline
download_file "https://cdn.jsdelivr.net/npm/@waline/client@$WALINE_VERSION/dist/waline.js" "assets/lib/waline/waline.js"
download_file "https://cdn.jsdelivr.net/npm/@waline/client@$WALINE_VERSION/dist/waline.css" "assets/lib/waline/waline.css"

echo "Download complete. Files saved to assets/lib subdirectories in main repository."
const ATTR_DATA_SRC = 'data-src';
const ATTR_DATA_LQIP = 'data-lqip';
const cover = {
  SHIMMER: 'shimmer',
  BLUR: 'blur'
};

let eventHandlers = new Set();

function removeCover(clzss) {
  this.parentElement?.classList.remove(clzss);
}

function handleImage() {
  if (!this.complete) return;
  
  if (this.hasAttribute(ATTR_DATA_LQIP)) {
    removeCover.call(this, cover.BLUR);
  } else {
    removeCover.call(this, cover.SHIMMER);
  }
}

function handleError() {
  console.warn('Failed to load image:', this.src);
  // Optionally add error handling UI here
  removeCover.call(this, cover.SHIMMER);
  removeCover.call(this, cover.BLUR);
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function switchLQIP() {
  const src = this.getAttribute(ATTR_DATA_SRC);
  if (!src) return;

  try {
    // Handle both relative and absolute URLs
    const newSrc = isValidUrl(src) ? src : encodeURI(src);
    this.setAttribute('src', newSrc);
    this.removeAttribute(ATTR_DATA_SRC);
  } catch (e) {
    console.warn('Error processing image source:', src, e);
  }
}

function cleanup() {
  eventHandlers.forEach(img => {
    img.removeEventListener('load', handleImage);
    img.removeEventListener('error', handleError);
  });
  eventHandlers.clear();
}

export function loadImg() {
  cleanup();
  
  const images = document.querySelectorAll('article img');
  if (!images.length) return;
  
  const lqipImages = [];
  
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    
    if (img.complete && img.naturalHeight !== 0) {
      if (img.hasAttribute(ATTR_DATA_LQIP)) {
        removeCover.call(img, cover.BLUR);
      } else {
        removeCover.call(img, cover.SHIMMER);
      }
    } else {
      img.addEventListener('load', handleImage, { once: true });
      img.addEventListener('error', handleError, { once: true });
      eventHandlers.add(img);
    }
    
    if (img.hasAttribute(ATTR_DATA_LQIP) && img.hasAttribute(ATTR_DATA_SRC)) {
      lqipImages.push(img);
    }
  }
  
  if (lqipImages.length) {
    requestAnimationFrame(() => {
      for (let i = 0; i < lqipImages.length; i++) {
        switchLQIP.call(lqipImages[i]);
      }
    });
  }
}

// Handle InstantView page changes
if (window.InstantView) {
  window.InstantView.on('change', () => {
    setTimeout(loadImg, 50);
  });
}
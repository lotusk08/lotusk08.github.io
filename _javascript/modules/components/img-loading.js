const ATTR_DATA_SRC = 'data-src';
const ATTR_DATA_LQIP = 'data-lqip';
const cover = {
  SHIMMER: 'shimmer',
  BLUR: 'blur'
};

function removeCover(clzss) {
  this.parentElement.classList.remove(clzss);
}

function handleImage() {
  if (!this.complete) return;
  
  if (this.hasAttribute(ATTR_DATA_LQIP)) {
    removeCover.call(this, cover.BLUR);
  } else {
    removeCover.call(this, cover.SHIMMER);
  }
}

function switchLQIP() {
  const src = this.getAttribute(ATTR_DATA_SRC);
  this.setAttribute('src', encodeURI(src));
  this.removeAttribute(ATTR_DATA_SRC);
}

export function loadImg() {
  const images = document.querySelectorAll('article img');
  if (!images.length) return;
  
  const lazyImages = [];
  const lqipImages = [];
  
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    
    if (img.complete) {
      if (img.hasAttribute(ATTR_DATA_LQIP)) {
        removeCover.call(img, cover.BLUR);
      } else {
        removeCover.call(img, cover.SHIMMER);
      }
    } else {
      img.addEventListener('load', handleImage, { once: true });
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
const lightImages = '.popup:not(.dark)';
const darkImages = '.popup:not(.light)';
let selector = lightImages;

function updateImages(current, reverse) {
  selector = selector === lightImages ? darkImages : lightImages;
  
  if (reverse === null) {
    reverse = GLightbox({ selector });
  }
  
  return [reverse, current];
}

export function imgPopup() {
  if (!document.querySelector('.popup')) return;
  
  const hasLightImages = document.querySelector('.popup.light');
  const hasDarkImages = document.querySelector('.popup.dark');
  const hasDualImages = hasLightImages || hasDarkImages;
  
  if (Theme.visualState === Theme.DARK) {
    selector = darkImages;
  }
  
  let current = GLightbox({ selector });
  
  if (hasDualImages && Theme.switchable) {
    let reverse = null;
    
    const themeChangeHandler = event => {
      if (event.source === window && 
          event.data && 
          event.data.id === Theme.ID) {
        [current, reverse] = updateImages(current, reverse);
      }
    };
    
    window.addEventListener('message', themeChangeHandler);
  }
}
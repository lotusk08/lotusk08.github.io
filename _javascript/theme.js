class Theme {
  static #modeKey = 'mode';
  static #modeAttr = 'data-mode';
  static #darkMedia = window.matchMedia('(prefers-color-scheme: dark)');
  static switchable = !document.documentElement.hasAttribute(this.#modeAttr);
  
  static get DARK() {
    return 'dark';
  }
  
  static get LIGHT() {
    return 'light';
  }
  
  static get ID() {
    return 'theme-mode';
  }
  
  static get visualState() {
    return this.#hasMode ? this.#mode : (this.#sysDark ? this.DARK : this.LIGHT);
  }
  
  static get #mode() {
    return (
      sessionStorage.getItem(this.#modeKey) ||
      document.documentElement.getAttribute(this.#modeAttr)
    );
  }
  
  static get #isDarkMode() {
    return this.#mode === this.DARK;
  }
  
  static get #hasMode() {
    return this.#mode !== null;
  }
  
  static get #sysDark() {
    return this.#darkMedia.matches;
  }
  
  static getThemeMapper(light, dark) {
    return {
      [this.LIGHT]: light,
      [this.DARK]: dark
    };
  }
  
  static init() {
    if (!this.switchable) return;
    
    this.#darkMedia.addEventListener('change', () => {
      const lastMode = this.#mode;
      this.#clearMode();
      
      if (lastMode !== this.visualState) {
        this.#notify();
      }
      
      this.#updateColors();
    });
    
    if (!this.#hasMode) return;
    
    if (this.#isDarkMode) {
      this.#setDark();
    } else {
      this.#setLight();
    }
    
    this.#updateColors();
  }
  
  static flip() {
    if (this.#hasMode) {
      this.#clearMode();
    } else {
      this.#sysDark ? this.#setLight() : this.#setDark();
    }
    
    this.#notify();
    this.#updateColors();
  }
  
  static #setDark() {
    document.documentElement.setAttribute(this.#modeAttr, this.DARK);
    sessionStorage.setItem(this.#modeKey, this.DARK);
  }
  
  static #setLight() {
    document.documentElement.setAttribute(this.#modeAttr, this.LIGHT);
    sessionStorage.setItem(this.#modeKey, this.LIGHT);
  }
  
  static #clearMode() {
    document.documentElement.removeAttribute(this.#modeAttr);
    sessionStorage.removeItem(this.#modeKey);
  }
  
  static #notify() {
    window.postMessage({ 
      id: this.ID,
      mode: this.visualState 
    }, '*');
    
    const isDark = this.visualState === this.DARK;
    const theme = isDark ? 'dark' : 'light';
    const faviconElements = document.querySelectorAll('link[rel*="icon"]');
    
    faviconElements.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        link.setAttribute('href', href.replace(/(light|dark)/, theme));
      }
    });
  }
  
  static #updateColors() {
    const root = document.documentElement;
    const mainBgColor = getComputedStyle(root).getPropertyValue('--main-bg').trim();
    
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (metaThemeColor) {
      metaThemeColor.content = mainBgColor;
    } else {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      metaThemeColor.content = mainBgColor;
      document.head.appendChild(metaThemeColor);
    }
  }
}

Theme.init();
export default Theme;
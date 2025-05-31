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

    if (!this.#hasMode) {
      // Set initial favicon for system preference
      this.#updateFavicons();
      return;
    }

    if (this.#isDarkMode) {
      this.#setDark();
    } else {
      this.#setLight();
    }

    this.#updateColors();
    this.#updateFavicons();
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

    this.#updateFavicons();
  }

  static #updateFavicons() {
    const theme = this.visualState; // 'dark' or 'light'

    // Select favicon links that should change theme
    const faviconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="manifest"]'
    ];

    faviconSelectors.forEach(selector => {
      const links = document.querySelectorAll(selector);
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes('/favicons/')) {
          // Replace /light/ or /dark/ with current theme
          const newHref = href.replace(/\/(light|dark)\//, `/${theme}/`);
          if (newHref !== href) {
            link.setAttribute('href', newHref);
          }
        }
      });
    });

    // Update browserconfig meta tag
    const browserConfig = document.querySelector('meta[name="msapplication-config"]');
    if (browserConfig) {
      const content = browserConfig.getAttribute('content');
      if (content && content.includes('/favicons/')) {
        const newContent = content.replace(/\/(light|dark)\//, `/${theme}/`);
        if (newContent !== content) {
          browserConfig.setAttribute('content', newContent);
        }
      }
    }

    // Update web app manifest if it exists
    const manifestLinks = document.querySelectorAll('link[rel="manifest"]');
    manifestLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes('/favicons/')) {
        const newHref = href.replace(/\/(light|dark)\//, `/${theme}/`);
        if (newHref !== href) {
          link.setAttribute('href', newHref);
        }
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

// Initialize theme when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Theme.init());
} else {
  Theme.init();
}

export default Theme;

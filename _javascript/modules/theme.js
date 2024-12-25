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

  /**
   * @returns {string} Theme mode identifier
   */
  static get ID() {
    return 'theme-mode';
  }

  /**
   * Gets the current visual state of the theme.
   *
   * @returns {string} The current visual state, either the mode if it exists,
   *                   or the system dark mode state ('dark' or 'light').
   */
  static get visualState() {
    if (this.#hasMode) {
      return this.#mode;
    } else {
      return this.#sysDark ? this.DARK : this.LIGHT;
    }
  }

  static get #mode() {
    return sessionStorage.getItem(this.#modeKey);
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

  /**
   * Maps theme modes to provided values
   * @param {string} light Value for light mode
   * @param {string} dark Value for dark mode
   * @returns {Object} Mapped values
   */
  static getThemeMapper(light, dark) {
    return {
      [this.LIGHT]: light,
      [this.DARK]: dark
    };
  }

  /**
   * Initializes the theme based on system preferences or stored mode
   */
  static init() {
    if (!this.switchable) {
      return;
    }

    this.#darkMedia.addEventListener('change', () => {
      const lastMode = this.#mode;
      this.#clearMode();

      if (lastMode !== this.visualState) {
        this.#notify();
      }
      this.updateThemeColor();
    });

    if (!this.#hasMode) {
      return;
    }

    if (this.#isDarkMode) {
      this.#setDark();
    } else {
      this.#setLight();
    }

    this.updateThemeColor();
  }

  /**
   * Flips the current theme mode
   */
  static flip() {
    if (this.#hasMode) {
      this.#clearMode();
    } else {
      this.#sysDark ? this.#setLight() : this.#setDark();
    }
    this.#notify();
    this.updateThemeColor();
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

  /**
   * Notifies other plugins that the theme mode has changed
   */
  static #notify() {
    window.postMessage({ id: this.ID }, '*');
  }

  /**
   * Updates the meta theme-color tag based on the current theme
   */
  static updateThemeColor() {
    const metaTag = document.querySelector('meta[name="theme-color"]');
    if (!metaTag) return;

    const currentTheme = this.visualState;

    if (currentTheme === this.DARK) {
      metaTag.setAttribute('content', '#1B1B1E');
    } else {
      metaTag.setAttribute('content', '#ffffff');
    }
  }
}

Theme.init();

export default Theme;

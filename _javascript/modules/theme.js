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
      this.updateTopBarColor(); // Update top bar color on system preference change
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
    this.updateTopBarColor(); // Ensure top bar color is set at initialization
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
    this.updateTopBarColor(); // Ensure top bar color is set after flipping
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
    // Look for all meta theme-color tags and remove them
    const existingTags = document.querySelectorAll('meta[name="theme-color"]');
    existingTags.forEach(tag => tag.remove());

    // Create a new meta tag for the theme color
    const newMetaTag = document.createElement('meta');
    newMetaTag.name = 'theme-color';

    // Get the current background color from --main-bg CSS variable
    const root = document.documentElement;
    const currentTheme = this.visualState;
    const mainBgColor = getComputedStyle(root).getPropertyValue('--main-bg').trim();

    // Set the color based on the current theme
    newMetaTag.content = mainBgColor;

    // Append the updated meta tag to the head
    document.head.appendChild(newMetaTag);
  }

  /**
   * Updates the top browser color based on the current theme using the --main-bg variable.
   */
  static updateTopBarColor() {
    const root = document.documentElement;
    const mainBgColor = getComputedStyle(root).getPropertyValue('--main-bg').trim();

    // Update the top browser bar color (for example, mobile browser address bar)
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', mainBgColor);
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.name = 'theme-color';
      newMetaTag.content = mainBgColor;
      document.head.appendChild(newMetaTag);
    }
  }
}

Theme.init();

export default Theme;

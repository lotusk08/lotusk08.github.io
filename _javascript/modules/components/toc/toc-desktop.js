export class TocDesktop {
  static options = {
    tocSelector: '#toc',
    contentSelector: '.content',
    ignoreSelector: '[data-toc-skip]',
    headingSelector: 'h2, h3, h4',
    orderedList: false,
    scrollSmooth: false,
    headingsOffset: 16 * 2
  };

  static #initialized = false;

  static refresh() {
    if (!this.#initialized) {
      this.init();
      return;
    }
    if (window.tocbot) {
      window.tocbot.refresh(this.options);
    }
  }

  static init() {
    if (window.tocbot) {
      window.tocbot.init(this.options);
      this.#initialized = true;
    }
  }

  static destroy() {
    if (window.tocbot && this.#initialized) {
      window.tocbot.destroy();
      this.#initialized = false;
    }
  }
}
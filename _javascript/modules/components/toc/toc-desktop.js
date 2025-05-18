export class TocDesktop {
  static options = {
    tocSelector: '#toc',
    contentSelector: '.content',
    ignoreSelector: '[data-toc-skip]',
    headingSelector: 'h2, h3, h4',
    orderedList: false,
    scrollSmooth: true,
    smoothScrollDuration: 300,
    headingsOffset: 16 * 2
  };

  static #initialized = false;

  static refresh() {
    if (!this.#initialized) {
      this.init();
      return;
    }
    tocbot.refresh(this.options);
  }

  static init() {
    tocbot.init(this.options);
    this.#initialized = true;
  }
}

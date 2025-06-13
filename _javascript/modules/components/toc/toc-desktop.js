export class TocDesktop {
  static options = {
    tocSelector: '#toc',
    contentSelector: '.content',
    ignoreSelector: '[data-toc-skip]',
    headingSelector: 'h2, h3, h4',
    orderedList: false,
    scrollSmooth: false, // Disable tocbot's smooth scrolling
    headingsOffset: 32,
    // Remove conflicting scroll options
  };

  static #initialized = false;
  static #ticking = false;

  static refresh() {
    if (!this.#initialized) {
      this.init();
      return;
    }
    tocbot.refresh(this.options);
    this.#attachNativeScrolling();
  }

  static init() {
    tocbot.init(this.options);
    this.#initialized = true;
    this.#attachNativeScrolling();
    this.#attachOptimizedScrollListener();
  }

  static #attachNativeScrolling() {
    // Override tocbot's click handlers with native smooth scrolling
    const tocLinks = document.querySelectorAll('#toc .toc-link');

    tocLinks.forEach(link => {
      // Remove existing listeners by cloning
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);

      newLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = newLink.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const offset = 32; // Your headingsOffset
          const targetPosition = targetElement.offsetTop - offset;

          // Use native smooth scrolling
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL after scroll
          setTimeout(() => {
            history.pushState(null, null, `#${targetId}`);
          }, 100);
        }
      });
    });
  }

  static #attachOptimizedScrollListener() {
    // Use passive scroll listener with RAF throttling
    window.addEventListener('scroll', () => {
      if (!this.#ticking) {
        requestAnimationFrame(() => {
          // Let tocbot handle active state updates
          this.#ticking = false;
        });
        this.#ticking = true;
      }
    }, { passive: true });
  }
}

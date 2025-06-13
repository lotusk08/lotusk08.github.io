export class TocMobile {
  static #invisible = true;
  static #barHeight = 16 * 3;
  static #eventsBound = false;
  static #elements = null;
  static #ticking = false;

  static options = {
    tocSelector: '#toc-popup-content',
    contentSelector: '.content',
    ignoreSelector: '[data-toc-skip]',
    headingSelector: 'h2, h3, h4',
    orderedList: false,
    scrollSmooth: false, // Disable tocbot's smooth scrolling
    collapseDepth: 4,
    headingsOffset: this.#barHeight
    // Remove smoothScrollDuration - using native scrolling
  };

  static get elements() {
    if (!this.#elements) {
      this.#elements = {
        tocBar: document.getElementById('toc-bar'),
        soloTrigger: document.getElementById('toc-solo-trigger'),
        triggers: Array.from(document.getElementsByClassName('toc-trigger')),
        popup: document.getElementById('toc-popup'),
        btnClose: document.getElementById('toc-popup-close')
      };
    }
    return this.#elements;
  }

  static initBar() {
    const { tocBar, soloTrigger } = this.elements;
    if (!tocBar || !soloTrigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          tocBar.classList.add('invisible');
        } else {
          tocBar.classList.remove('invisible');
        }
      },
      { rootMargin: `-${this.#barHeight}px 0px 0px 0px` }
    );
    observer.observe(soloTrigger);
    this.#invisible = false;
  }

  static #attachNativeScrolling() {
    // Use native smooth scrolling with optimized click handling
    const tocLinks = document.querySelectorAll('#toc-popup-content .toc-link');

    tocLinks.forEach(link => {
      // Remove existing listeners by cloning (cleaner than tracking bound functions)
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);

      newLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = newLink.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const offset = this.#barHeight;
          const targetPosition = targetElement.offsetTop - offset;

          // Hide popup first for better UX
          this.hidePopup();

          // Small delay to let popup close animation start
          setTimeout(() => {
            // Use native smooth scrolling
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });

            // Update URL after scroll
            setTimeout(() => {
              history.pushState(null, null, `#${targetId}`);
            }, 100);
          }, 150); // Match your popup closing animation
        }
      });
    });
  }

  static refresh() {
    if (this.#invisible) {
      this.initComponents();
    }
    tocbot.refresh(this.options);
    this.#attachNativeScrolling(); // Use native scrolling instead of listenAnchors
  }

  static get popupOpened() {
    return this.elements.popup?.open || false;
  }

  static showPopup() {
    const { popup } = this.elements;
    if (!popup) return;

    this.lockScroll(true);
    popup.showModal();

    // Optimized active item scrolling
    requestAnimationFrame(() => {
      const activeItem = popup.querySelector('li.is-active-li');
      if (activeItem) {
        activeItem.scrollIntoView({
          block: 'center',
          behavior: 'smooth' // Native smooth scrolling for popup content
        });
      }
    });
  }

  static hidePopup() {
    const { popup } = this.elements;
    if (!popup || !popup.open) return;

    const CLOSING = 'closing';
    popup.setAttribute(CLOSING, '');
    popup.addEventListener(
      'animationend',
      () => {
        popup.removeAttribute(CLOSING);
        popup.close();
      },
      { once: true }
    );
    this.lockScroll(false);
  }

  static lockScroll(enable) {
    const className = 'overflow-hidden';
    // Already using RAF - good!
    requestAnimationFrame(() => {
      document.documentElement.classList.toggle(className, enable);
      document.body.classList.toggle(className, enable);
    });
  }

  static clickBackdrop(event) {
    const { popup } = this.elements;
    if (!popup || popup.hasAttribute('closing')) return;

    const rect = popup.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      this.hidePopup();
    }
  }

  static #attachOptimizedScrollListener() {
    // Add passive scroll listener for better performance
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

  static initComponents() {
    if (this.#eventsBound) return;

    this.initBar();
    const { triggers, popup, btnClose } = this.elements;
    const showPopupBound = this.showPopup.bind(this);
    const hidePopupBound = this.hidePopup.bind(this);
    const clickBackdropBound = this.clickBackdrop.bind(this);

    triggers.forEach(trigger => {
      trigger.addEventListener('click', showPopupBound);
    });

    if (popup) {
      popup.addEventListener('click', clickBackdropBound);
      popup.addEventListener('cancel', (e) => {
        e.preventDefault();
        this.hidePopup();
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', hidePopupBound);
    }

    this.#eventsBound = true;
  }

  static init() {
    tocbot.init(this.options);
    this.#attachNativeScrolling(); // Use native scrolling
    this.initComponents();
    this.#attachOptimizedScrollListener(); // Add optimized scroll listener
  }
}

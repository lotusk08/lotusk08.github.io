export class TocMobile {
  static #invisible = true;
  static #barHeight = 16 * 3;
  static #eventsBound = false;
  static #elements = null;

  static options = {
    tocSelector: '#toc-popup-content',
    contentSelector: '.content',
    ignoreSelector: '[data-toc-skip]',
    headingSelector: 'h2, h3, h4',
    orderedList: false,
    scrollSmooth: true,
    smoothScrollDuration: 300,
    collapseDepth: 4,
    headingsOffset: this.#barHeight
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

  static listenAnchors() {
    const anchors = Array.from(document.getElementsByClassName('toc-link'));
    const hidePopupBound = this.hidePopup.bind(this);

    anchors.forEach(anchor => {
      anchor.onclick = hidePopupBound;
    });
  }

  static refresh() {
    if (this.#invisible) {
      this.initComponents();
    }
    tocbot.refresh(this.options);
    this.listenAnchors();
  }

  static get popupOpened() {
    return this.elements.popup?.open || false;
  }

  static showPopup() {
    const { popup } = this.elements;
    if (!popup) return;

    this.lockScroll(true);
    popup.showModal();

    requestAnimationFrame(() => {
      const activeItem = popup.querySelector('li.is-active-li');
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'center' });
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

  static initComponents() {
    if (this.#eventsBound) return;

    this.initBar();
    const { triggers, popup, btnClose } = this.elements;

    const showPopupBound = this.showPopup.bind(this);
    const hidePopupBound = this.hidePopup.bind(this);
    const clickBackdropBound = this.clickBackdrop.bind(this);

    triggers.forEach(trigger => {
      trigger.onclick = showPopupBound;
    });

    if (popup) {
      popup.onclick = clickBackdropBound;
      popup.oncancel = (e) => {
        e.preventDefault();
        this.hidePopup();
      };
    }

    if (btnClose) {
      btnClose.onclick = hidePopupBound;
    }

    this.#eventsBound = true;
  }

  static init() {
    tocbot.init(this.options);
    this.listenAnchors();
    this.initComponents();
  }
}

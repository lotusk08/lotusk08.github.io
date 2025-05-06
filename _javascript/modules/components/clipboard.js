import Tooltip from 'bootstrap/js/src/tooltip';

export class ClipboardManager {
  static #instance = null;

  constructor() {
    this.clipboardSelector = ".code-header>button";
    this.ICON_DEFAULT = "far fa-clone";
    this.ICON_SUCCESS = "fas fa-check";
    this.ATTR_TIMEOUT = "timeout";
    this.ATTR_TITLE_SUCCEED = "data-title-succeed";
    this.ATTR_TITLE_ORIGIN = "data-bs-original-title";
    this.TIMEOUT = 2000;
  }

  #isLocked(node) {
    if (node.hasAttribute(this.ATTR_TIMEOUT)) {
      const timeout = node.getAttribute(this.ATTR_TIMEOUT);
      return Number(timeout) > Date.now();
    }
    return false;
  }

  #lock(node) {
    node.setAttribute(this.ATTR_TIMEOUT, Date.now() + this.TIMEOUT);
  }

  #unlock(node) {
    node.removeAttribute(this.ATTR_TIMEOUT);
  }

  #showTooltip(btn) {
    const succeedTitle = btn.getAttribute(this.ATTR_TITLE_SUCCEED);
    btn.setAttribute(this.ATTR_TITLE_ORIGIN, succeedTitle);
    Tooltip.getInstance(btn).show();
  }

  #hideTooltip(btn) {
    Tooltip.getInstance(btn).hide();
    btn.removeAttribute(this.ATTR_TITLE_ORIGIN);
  }

  #setSuccessIcon(btn) {
    btn.children[0].setAttribute('class', this.ICON_SUCCESS);
  }

  #resumeIcon(btn) {
    btn.children[0].setAttribute('class', this.ICON_DEFAULT);
  }

  async setCodeClipboard() {
    if (!window.ClipboardJS) return;

    const clipboardList = document.querySelectorAll(this.clipboardSelector);
    if (!clipboardList.length) return;

    const clipboard = new ClipboardJS(this.clipboardSelector, {
      target: (trigger) => {
        return trigger.parentNode.nextElementSibling.querySelector('code .rouge-code');
      }
    });

    for (let i = 0; i < clipboardList.length; i++) {
      new Tooltip(clipboardList[i], {
        placement: 'left'
      });
    }

    clipboard.on('success', (e) => {
      const trigger = e.trigger;
      e.clearSelection();
      
      if (this.#isLocked(trigger)) return;
      
      this.#setSuccessIcon(trigger);
      this.#showTooltip(trigger);
      this.#lock(trigger);
      
      setTimeout(() => {
        this.#hideTooltip(trigger);
        this.#resumeIcon(trigger);
        this.#unlock(trigger);
      }, this.TIMEOUT);
    });
  }

  setLinkClipboard() {
    const btnCopyLink = document.getElementById('copy-link');
    if (!btnCopyLink) return;

    btnCopyLink.addEventListener('click', (e) => {
      const target = e.target;
      if (this.#isLocked(target)) return;

      navigator.clipboard.writeText(window.location.href).then(() => {
        const defaultTitle = target.getAttribute(this.ATTR_TITLE_ORIGIN);
        const succeedTitle = target.getAttribute(this.ATTR_TITLE_SUCCEED);
        
        target.setAttribute(this.ATTR_TITLE_ORIGIN, succeedTitle);
        Tooltip.getInstance(target).show();
        this.#lock(target);
        
        setTimeout(() => {
          target.setAttribute(this.ATTR_TITLE_ORIGIN, defaultTitle);
          this.#unlock(target);
        }, this.TIMEOUT);
      });
    });

    btnCopyLink.addEventListener('mouseleave', (e) => {
      Tooltip.getInstance(e.target).hide();
    });
  }

  async init() {
    await this.setCodeClipboard();
    this.setLinkClipboard();
  }

  static async getInstance() {
    if (!this.#instance) {
      this.#instance = new ClipboardManager();
    }
    return this.#instance;
  }
}

export async function initClipboard() {
  const manager = await ClipboardManager.getInstance();
  await manager.init();
}
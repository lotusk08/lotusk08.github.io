import Tooltip from "bootstrap/js/src/tooltip";

const clipboardSelector = ".code-header>button";

const ICON_DEFAULT = "far fa-clone";
const ICON_SUCCESS = "fas fa-check";

const ATTR_TIMEOUT = "timeout";
const ATTR_TITLE_SUCCEED = "data-title-succeed";
const ATTR_TITLE_ORIGIN = "data-bs-original-title";
const TIMEOUT = 2000;

class ClipboardManager {
  constructor() {
    this.tooltips = new Set();
    this.clipboard = null;
    this.handlers = new Map();
  }

  isLocked(node) {
    if (node.hasAttribute(ATTR_TIMEOUT)) {
      let timeout = node.getAttribute(ATTR_TIMEOUT);
      if (Number(timeout) > Date.now()) {
        return true;
      }
    }
    return false;
  }

  lock(node) {
    node.setAttribute(ATTR_TIMEOUT, Date.now() + TIMEOUT);
  }

  unlock(node) {
    node.removeAttribute(ATTR_TIMEOUT);
  }

  showTooltip(btn) {
    const succeedTitle = btn.getAttribute(ATTR_TITLE_SUCCEED);
    btn.setAttribute(ATTR_TITLE_ORIGIN, succeedTitle);
    Tooltip.getInstance(btn).show();
  }

  hideTooltip(btn) {
    Tooltip.getInstance(btn).hide();
    btn.removeAttribute(ATTR_TITLE_ORIGIN);
  }

  setSuccessIcon(btn) {
    const icon = btn.children[0];
    icon.setAttribute("class", ICON_SUCCESS);
  }

  resumeIcon(btn) {
    const icon = btn.children[0];
    icon.setAttribute("class", ICON_DEFAULT);
  }

  setCodeClipboard() {
    const clipboardList = document.querySelectorAll(clipboardSelector);
    if (clipboardList.length === 0) return;

    this.clipboard = new ClipboardJS(clipboardSelector, {
      target: (trigger) => {
        const codeBlock = trigger.parentNode.nextElementSibling;
        return codeBlock.querySelector("code .rouge-code");
      }
    });

    clipboardList.forEach((elem) => {
      const tooltip = new Tooltip(elem, {
        placement: "left"
      });
      this.tooltips.add(tooltip);
    });

    this.clipboard.on("success", (e) => {
      const trigger = e.trigger;
      e.clearSelection();

      if (this.isLocked(trigger)) return;

      this.setSuccessIcon(trigger);
      this.showTooltip(trigger);
      this.lock(trigger);

      setTimeout(() => {
        this.hideTooltip(trigger);
        this.resumeIcon(trigger);
        this.unlock(trigger);
      }, TIMEOUT);
    });
  }

  setLinkClipboard() {
    const btnCopyLink = document.getElementById("copy-link");
    if (!btnCopyLink) return;

    const handleClick = (e) => {
      const target = e.target;
      if (this.isLocked(target)) return;

      navigator.clipboard.writeText(window.location.href).then(() => {
        const defaultTitle = target.getAttribute(ATTR_TITLE_ORIGIN);
        const succeedTitle = target.getAttribute(ATTR_TITLE_SUCCEED);
        target.setAttribute(ATTR_TITLE_ORIGIN, succeedTitle);
        Tooltip.getInstance(target).show();
        this.lock(target);

        setTimeout(() => {
          target.setAttribute(ATTR_TITLE_ORIGIN, defaultTitle);
          this.unlock(target);
        }, TIMEOUT);
      });
    };

    const handleMouseLeave = (e) => {
      Tooltip.getInstance(e.target).hide();
    };

    btnCopyLink.addEventListener("click", handleClick);
    btnCopyLink.addEventListener("mouseleave", handleMouseLeave);

    this.handlers.set(btnCopyLink, {
      click: handleClick,
      mouseleave: handleMouseLeave
    });
  }

  destroy() {
    this.tooltips.forEach((tooltip) => {
      tooltip.dispose();
    });
    this.tooltips.clear();

    if (this.clipboard) {
      this.clipboard.destroy();
      this.clipboard = null;
    }

    this.handlers.forEach((handlers, element) => {
      element.removeEventListener("click", handlers.click);
      element.removeEventListener("mouseleave", handlers.mouseleave);
    });
    this.handlers.clear();
  }

  init() {
    this.setCodeClipboard();
    this.setLinkClipboard();
  }
}

export function initClipboard() {
  const manager = new ClipboardManager();
  manager.init();
  return manager;
}

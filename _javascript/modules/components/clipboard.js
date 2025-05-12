import Tooltip from 'bootstrap/js/src/tooltip';

const clipboardSelector = '.code-header>button';
const ICON_SVG_DEFAULT = '<i class="icons"><svg><use href="/assets/icons.svg#clone"></use></svg></i>';
const ICON_SVG_SUCCESS = '<i class="icons"><svg><use href="/assets/icons.svg#check"></use></svg></i>';
const ATTR_TIMEOUT = 'timeout';
const ATTR_TITLE_SUCCEED = 'data-title-succeed';
const ATTR_TITLE_ORIGIN = 'data-bs-original-title';
const TIMEOUT = 2000;

function isLocked(node) {
  if (node.hasAttribute(ATTR_TIMEOUT)) {
    const timeout = node.getAttribute(ATTR_TIMEOUT);
    return Number(timeout) > Date.now();
  }
  return false;
}

function lock(node) {
  node.setAttribute(ATTR_TIMEOUT, Date.now() + TIMEOUT);
}

function unlock(node) {
  node.removeAttribute(ATTR_TIMEOUT);
}

function showTooltip(btn) {
  const succeedTitle = btn.getAttribute(ATTR_TITLE_SUCCEED);
  btn.setAttribute(ATTR_TITLE_ORIGIN, succeedTitle);
  Tooltip.getInstance(btn).show();
}

function hideTooltip(btn) {
  Tooltip.getInstance(btn).hide();
  btn.removeAttribute(ATTR_TITLE_ORIGIN);
}

function setSuccessIcon(btn) {
  btn.innerHTML = ICON_SVG_SUCCESS;
}

function resumeIcon(btn) {
  btn.innerHTML = ICON_SVG_DEFAULT;
}

function setCodeClipboard() {
  const clipboardList = document.querySelectorAll(clipboardSelector);
  if (!clipboardList.length) return;

  const clipboard = new ClipboardJS(clipboardSelector, {
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

    if (isLocked(trigger)) return;

    setSuccessIcon(trigger);
    showTooltip(trigger);
    lock(trigger);

    setTimeout(() => {
      hideTooltip(trigger);
      resumeIcon(trigger);
      unlock(trigger);
    }, TIMEOUT);
  });
}

function setLinkClipboard() {
  const btnCopyLink = document.getElementById('copy-link');
  if (!btnCopyLink) return;

  btnCopyLink.addEventListener('click', (e) => {
    const target = e.target;
    if (isLocked(target)) return;

    navigator.clipboard.writeText(window.location.href).then(() => {
      const defaultTitle = target.getAttribute(ATTR_TITLE_ORIGIN);
      const succeedTitle = target.getAttribute(ATTR_TITLE_SUCCEED);

      target.setAttribute(ATTR_TITLE_ORIGIN, succeedTitle);
      Tooltip.getInstance(target).show();
      lock(target);

      setTimeout(() => {
        target.setAttribute(ATTR_TITLE_ORIGIN, defaultTitle);
        unlock(target);
      }, TIMEOUT);
    });
  });

  btnCopyLink.addEventListener('mouseleave', (e) => {
    Tooltip.getInstance(e.target).hide();
  });
}

export function initClipboard() {
  setCodeClipboard();
  setLinkClipboard();
}

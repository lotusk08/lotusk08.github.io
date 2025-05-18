const clipboardSelector = '.code-header>button';
const ICON_SVG_DEFAULT = '<i class="icons"><svg><use href="/assets/icons.svg#clone"></use></svg></i>';
const ICON_SVG_SUCCESS = '<i class="icons"><svg><use href="/assets/icons.svg#check"></use></svg></i>';
const ATTR_TIMEOUT = 'timeout';
const ATTR_TITLE_SUCCEED = 'data-title-succeed';
const ATTR_TITLE = 'data-title';
const TIMEOUT = 2000;

function isLocked(node) {
  return node.hasAttribute(ATTR_TIMEOUT) && Number(node.getAttribute(ATTR_TIMEOUT)) > Date.now();
}

function lock(node) {
  node.setAttribute(ATTR_TIMEOUT, Date.now() + TIMEOUT);
}

function unlock(node) {
  node.removeAttribute(ATTR_TIMEOUT);
}

function setCodeClipboard() {
  const clipboardList = document.querySelectorAll(clipboardSelector);
  if (!clipboardList.length) return;

  const clipboard = new ClipboardJS(clipboardSelector, {
    target: (trigger) => trigger.parentNode.nextElementSibling.querySelector('code .rouge-code')
  });

  clipboard.on('success', (e) => {
    const trigger = e.trigger;
    e.clearSelection();
    if (isLocked(trigger)) return;

    trigger.innerHTML = ICON_SVG_SUCCESS;
    lock(trigger);

    setTimeout(() => {
      trigger.innerHTML = ICON_SVG_DEFAULT;
      unlock(trigger);
    }, TIMEOUT);
  });
}

function setLinkClipboard() {
  const btnCopyLink = document.getElementById('copy-link');
  if (!btnCopyLink) return;

  const tooltipContainer = btnCopyLink.closest('.tooltip-container');
  if (!tooltipContainer) return;

  const tooltip = tooltipContainer.querySelector('.tooltip');
  if (!tooltip) return;

  const defaultTitle = tooltipContainer.getAttribute(ATTR_TITLE) || 'Share link';
  const succeedTitle = tooltipContainer.getAttribute(ATTR_TITLE_SUCCEED) || 'Link copied!';

  btnCopyLink.addEventListener('click', async () => {
    if (isLocked(tooltipContainer)) return;

    try {
      await navigator.clipboard.writeText(window.location.href);
      tooltip.textContent = succeedTitle;
      tooltip.classList.add('active');
      lock(tooltipContainer);

      setTimeout(() => {
        tooltip.textContent = defaultTitle;
        tooltip.classList.remove('active');
        unlock(tooltipContainer);
      }, TIMEOUT);
    } catch (err) {
      console.error('Clipboard copy failed', err);
    }
  });

  btnCopyLink.addEventListener('mouseenter', () => {
    if (!isLocked(tooltipContainer)) {
      tooltip.textContent = defaultTitle;
      tooltip.classList.add('active');
    }
  });

  btnCopyLink.addEventListener('mouseleave', () => {
    if (!isLocked(tooltipContainer)) {
      tooltip.classList.remove('active');
    }
  });
}

export function initClipboard() {
  setCodeClipboard();
  setLinkClipboard();
}

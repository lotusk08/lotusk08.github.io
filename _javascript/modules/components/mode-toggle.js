const $toggle = document.getElementById('mode-toggle');

export function modeWatcher() {
  if (!$toggle) {
    return;
  }

  $toggle.addEventListener('click', () => {
    Theme.flip();
  });
}
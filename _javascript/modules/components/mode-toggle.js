export function modeWatcher() {
  const $toggle = document.getElementById('mode-toggle');
  if (!$toggle) {
    return;
  }

  // Remove any existing click listeners
  const newToggle = $toggle.cloneNode(true);
  $toggle.parentNode.replaceChild(newToggle, $toggle);

  // Add new click listener
  newToggle.addEventListener('click', () => {
    Theme.flip();
  });
}

// Handle InstantView page changes
if (window.InstantView) {
  window.InstantView.on('change', () => {
    // Small delay to ensure DOM is updated
    setTimeout(modeWatcher, 50);
  });
}
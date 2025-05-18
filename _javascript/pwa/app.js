class Notification {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  show(message, buttonText, onButtonClick) {
    this.hide();

    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.innerHTML = `
      <p>${message}</p>
      <button type="button" aria-label="Update">${buttonText}</button>
    `;

    // Append to container
    this.container.appendChild(notification);

    // Button click handler
    const button = notification.querySelector('button');
    button.addEventListener('click', () => {
      onButtonClick();
      this.hide();
    });

    return notification;
  }

  hide() {
    const existing = this.container.querySelector('.notification');
    if (existing) {
      existing.style.animation = 'fade-out 0.3s ease forwards';
      setTimeout(() => existing.remove(), 300);
    }
  }
}

if ('serviceWorker' in navigator) {
  const src = new URL(document.currentScript.src);
  const register = src.searchParams.get('register');
  const baseUrl = src.searchParams.get('baseurl');

  if (register) {
    const swUrl = `${baseUrl}/sw.min.js`;
    const notification = new Notification('notificationContainer');

    navigator.serviceWorker.register(swUrl).then(registration => {
      if (registration.waiting) {
        notification.show(
          document.querySelector('#notificationContainer').dataset.updateFound || 'Update available',
          document.querySelector('#notificationContainer').dataset.update || 'Refresh',
          () => {
            if (registration.waiting) {
              registration.waiting.postMessage('SKIP_WAITING');
            }
          }
        );
      }

      registration.addEventListener('updatefound', () => {
        registration.installing.addEventListener('statechange', () => {
          if (registration.waiting && navigator.serviceWorker.controller) {
            notification.show(
              document.querySelector('#notificationContainer').dataset.updateFound || 'Update available',
              document.querySelector('#notificationContainer').dataset.update || 'Refresh',
              () => {
                if (registration.waiting) {
                  registration.waiting.postMessage('SKIP_WAITING');
                }
              }
            );
          }
        });
      });
    });

    let refreshing = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        window.location.reload();
        refreshing = true;
      }
    });
  } else {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
}

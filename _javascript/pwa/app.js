import Toast from 'bootstrap/js/src/toast';

if ('serviceWorker' in navigator) {
  const src = new URL(document.currentScript.src);
  const register = src.searchParams.get('register');
  const baseUrl = src.searchParams.get('baseurl');

  if (register) {
    const swUrl = `${baseUrl}/sw.min.js`;
    const notification = document.getElementById('notification');
    const btnRefresh = notification.querySelector('.toast-body>button');
    const popupWindow = Toast.getOrCreateInstance(notification);

    navigator.serviceWorker.register(swUrl).then(registration => {
      if (registration.waiting) {
        popupWindow.show();
      }

      registration.addEventListener('updatefound', () => {
        registration.installing.addEventListener('statechange', () => {
          if (registration.waiting && navigator.serviceWorker.controller) {
            popupWindow.show();
          }
        });
      });

      btnRefresh.addEventListener('click', () => {
        if (registration.waiting) {
          registration.waiting.postMessage('SKIP_WAITING');
        }
        popupWindow.hide();
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
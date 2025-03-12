import { TocMobile as mobile } from "./toc/toc-mobile";
import { TocDesktop as desktop } from "./toc/toc-desktop";

const desktopMode = matchMedia("(min-width: 1200px)");

class TocManager {
  constructor() {
    this.tocWrapper = document.getElementById("toc-wrapper");
    this.tocTimeout = null;

    if (this.tocWrapper) {
      this.initializeTOC();
      this.bindEvents();
    }
  }

  initializeTOC() {
    this.showTOCTemporarily(1500);
  }

  showTOCTemporarily(duration) {
    if (this.tocWrapper) {
      this.tocWrapper.classList.add("visible");
      setTimeout(() => {
        this.tocWrapper.classList.remove("visible");
      }, duration);
    }
  }

  bindEvents() {
    window.addEventListener("scroll", () => {
      requestAnimationFrame(() => {
        try {
          if (this.tocWrapper) {
            this.tocWrapper.classList.add("visible");
            clearTimeout(this.tocTimeout);
            this.tocTimeout = setTimeout(() => {
              this.tocWrapper.classList.remove("visible");
            }, 1200);
          }
        } catch (error) {
          console.error("Error in TOC scroll handler:", error);
        }
      });
    });
  }
}

function refresh(e) {
  if (e.matches) {
    if (mobile.popupOpened) {
      mobile.hidePopup();
    }
    desktop.refresh();
  } else {
    mobile.refresh();
  }
}

export function initToc() {
  if (document.querySelector('main>article[data-toc="true"]') === null) {
    return;
  }

  if (desktopMode.matches) {
    desktop.init();
  } else {
    mobile.init();
  }

  const $tocWrapper = document.getElementById("toc-wrapper");
  $tocWrapper.classList.remove("invisible");

  desktopMode.onchange = refresh;

  new TocManager();
}

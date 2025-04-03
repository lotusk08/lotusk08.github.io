import { TocMobile as mobile } from "./toc/toc-mobile";
import { TocDesktop as desktop } from "./toc/toc-desktop";

const desktopMode = matchMedia("(min-width: 1200px)");

class TocManager {
  constructor() {
    this.tocWrapper = document.getElementById("toc-wrapper");
    this.tocTimeout = null;
    this.scrollHandler = this.handleScroll.bind(this);
    this.isVisible = false;
    this.rafId = null;

    if (this.tocWrapper) {
      this.initializeTOC();
      this.bindEvents();
    }
  }

  initializeTOC() {
    this.showTOCTemporarily(1500);
  }

  showTOCTemporarily(duration) {
    if (!this.tocWrapper) return;

    requestAnimationFrame(() => {
      if (!this.isVisible) {
        this.isVisible = true;
        this.tocWrapper.classList.add("visible");
      }

      clearTimeout(this.tocTimeout);
      this.tocTimeout = setTimeout(() => {
        requestAnimationFrame(() => {
          this.isVisible = false;
          this.tocWrapper.classList.remove("visible");
        });
      }, duration);
    });
  }

  handleScroll() {
    if (!this.tocWrapper) return;

    requestAnimationFrame(() => {
      if (!this.isVisible) {
        this.isVisible = true;
        this.tocWrapper.classList.add("visible");
      }

      clearTimeout(this.tocTimeout);
      this.tocTimeout = setTimeout(() => {
        requestAnimationFrame(() => {
          this.isVisible = false;
          this.tocWrapper.classList.remove("visible");
        });
      }, 1200);
    });
  }

  bindEvents() {
    window.addEventListener(
      "scroll",
      () => {
        if (!this.rafId) {
          this.rafId = requestAnimationFrame(() => {
            try {
              this.handleScroll();
            } catch (error) {
              console.error("Error in TOC scroll handler:", error);
            }
            this.rafId = null;
          });
        }
      },
      { passive: true }
    );
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
  if ($tocWrapper) {
    $tocWrapper.classList.remove("invisible");
  }

  desktopMode.addEventListener("change", refresh);

  new TocManager();
}

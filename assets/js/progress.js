class ScrollProgressManager {
  constructor() {
    this.btn = document.getElementById("back-to-top");
    this.tocWrapper = document.getElementById("toc-wrapper");
    this.circumference = 2 * Math.PI * 20;
    this.scrollTimeout = null;
    this.tocTimeout = null;
    this.isScrolling = false;

    if (this.btn) {
      this.initializeBackToTop();
    }

    if (this.tocWrapper) {
      this.initializeTOC();
    }

    // Throttled scroll handler
    this.throttledScrollHandler = this.throttle(() => {
      this.handleScroll();
    }, 16); // ~60fps

    this.bindEvents();
  }

  initializeBackToTop() {
    const { svg, circle, percentageText } = this.createScrollElements();
    this.circle = circle;
    this.percentageText = percentageText;

    this.btn.appendChild(svg);
    this.btn.appendChild(percentageText);
  }

  createScrollElements() {
    // Create SVG elements
    const svg = this.createSVGElement("svg", {
      id: "progress-circle",
      width: "44",
      height: "44"
    });

    const circle = this.createSVGElement("circle", {
      cx: "22",
      cy: "22",
      r: "20",
      "stroke-width": "1",
      "stroke-dasharray": this.circumference,
      "stroke-dashoffset": this.circumference,
      fill: "none",
      style: "stroke: var(--btn-backtotop-color)"
    });

    svg.appendChild(circle);

    // Create percentage text element
    const percentageText = document.createElement("div");
    percentageText.id = "scroll-percentage";
    percentageText.textContent = "0%";

    return { svg, circle, percentageText };
  }

  createSVGElement(type, attributes) {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      type
    );
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    return element;
  }

  initializeTOC() {
    this.showTOCTemporarily(1500);
  }

  updateScrollProgress() {
    if (!document.documentElement) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
      ) - window.innerHeight;

    if (docHeight <= 0) return;

    const scrollFraction = Math.min(Math.max(scrollTop / docHeight, 0), 1);
    const drawLength = this.circumference * scrollFraction;
    const scrollPercentage = Math.round(scrollFraction * 100);

    this.updateUI(drawLength, scrollPercentage);
  }

  updateUI(drawLength, scrollPercentage) {
    // Update circle progress
    this.circle.style.strokeDashoffset = this.circumference - drawLength;

    // Update percentage text
    this.percentageText.textContent = scrollPercentage;
    this.percentageText.classList.add("visible");

    // Hide percentage after delay
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.percentageText.classList.remove("visible");
    }, 500);
  }

  showTOCTemporarily(duration) {
    this.tocWrapper.classList.add("visible");
    setTimeout(() => {
      this.tocWrapper.classList.remove("visible");
    }, duration);
  }

  handleScroll() {
    if (this.btn) {
      requestAnimationFrame(() => this.updateScrollProgress());
    }

    if (this.tocWrapper) {
      this.tocWrapper.classList.add("visible");
      clearTimeout(this.tocTimeout);
      this.tocTimeout = setTimeout(() => {
        this.tocWrapper.classList.remove("visible");
      }, 1200);
    }
  }

  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  bindEvents() {
    window.addEventListener("scroll", this.throttledScrollHandler);

    if (this.btn) {
      this.btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ScrollProgressManager();
});

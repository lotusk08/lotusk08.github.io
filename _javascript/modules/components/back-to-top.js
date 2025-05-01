class ScrollProgress {
  constructor() {
    this.btn = document.getElementById("back-to-top");
    this.perimeter = 4 * 40;
    this.scrollTimeout = null;
    this.ticking = false;
    this.lastScrollTop = 0;
    this.lastScrollPercentage = 0;
    this.isVisible = false;
    this.visibilityThreshold = 50;
    this.documentHeight = 0;
    this.initialLoadComplete = false;

    if (this.btn) {
      this.initializeProgress();
      this.bindEvents();
      this.calculateDocumentHeight();
    }
  }

  initializeProgress() {
    const { svg, path, percentageText } = this.createScrollElements();
    this.path = path;
    this.percentageText = percentageText;
    this.icon = null;

    this.btn.appendChild(svg);
    this.btn.appendChild(percentageText);
    
    this.icon = this.btn.querySelector("i");
  }

  createScrollElements() {
    const svg = this.createSVGElement("svg", {
      id: "progress-circle",
      width: "44",
      height: "44",
      viewBox: "0 0 44 44"
    });

    const path = this.createSVGElement("path", {
      d: "M 2 2 H 42 V 42 H 2 Z",
      fill: "none",
      stroke: "var(--text-color)",
      "stroke-width": "1",
      "stroke-dasharray": this.perimeter,
      "stroke-dashoffset": this.perimeter
    });

    svg.appendChild(path);

    const percentageText = document.createElement("div");
    percentageText.id = "scroll-percentage";
    percentageText.textContent = "0%";

    return { svg, path, percentageText };
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

  calculateDocumentHeight() {
    const body = document.body;
    const html = document.documentElement;
    
    this.documentHeight = Math.max(
      body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight
    ) - window.innerHeight;
    
    return this.documentHeight;
  }

  updateScrollProgress() {
    if (!document.documentElement) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (Math.abs(scrollTop - this.lastScrollTop) < 5 && this.initialLoadComplete) {
      this.ticking = false;
      return;
    }
    
    this.lastScrollTop = scrollTop;

    if (this.documentHeight <= 0 || !this.initialLoadComplete) {
      this.documentHeight = this.calculateDocumentHeight();
      if (this.documentHeight <= 0) {
        this.ticking = false;
        return;
      }
      this.initialLoadComplete = true;
    }

    const shouldBeVisible = scrollTop > this.visibilityThreshold;
    if (shouldBeVisible !== this.isVisible) {
      this.isVisible = shouldBeVisible;
      this.btn.classList.toggle("show", shouldBeVisible);
    }

    const scrollFraction = Math.min(Math.max(scrollTop / this.documentHeight, 0), 1);
    const scrollPercentage = Math.round(scrollFraction * 100);
    
    if (scrollPercentage !== this.lastScrollPercentage) {
      this.lastScrollPercentage = scrollPercentage;
      const drawLength = this.perimeter * scrollFraction;
      this.updateUI(drawLength, scrollPercentage);
    }

    this.ticking = false;
  }

  updateUI(drawLength, scrollPercentage) {
    window.requestAnimationFrame(() => {
      this.path.style.strokeDashoffset = this.perimeter - drawLength;
      this.percentageText.textContent = `${scrollPercentage}`;
      this.percentageText.classList.add("visible");
      
      if (this.icon) {
        this.icon.style.opacity = "0";
      }

      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.percentageText.classList.remove("visible");
        if (this.icon) {
          this.icon.style.opacity = "1";
        }
      }, 500);
    });
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.documentHeight = this.calculateDocumentHeight();
      this.initialLoadComplete = false;
      this.updateScrollProgress();
    }, { passive: true });

    window.addEventListener("load", () => {
      this.documentHeight = this.calculateDocumentHeight();
      this.initialLoadComplete = true;
      this.updateScrollProgress();
    });
    
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        this.documentHeight = this.calculateDocumentHeight();
        this.initialLoadComplete = false;
        this.updateScrollProgress();
      }, 200);
    });

    window.addEventListener("scroll", () => {
      if (!this.ticking) {
        this.ticking = true;
        window.requestAnimationFrame(() => {
          try {
            this.updateScrollProgress();
          } catch (error) {
            console.error("Error in scroll handler:", error);
            this.ticking = false;
          }
        });
      }
    }, { passive: true });

    this.btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  cleanup() {
  }
}

export function back2top() {
  return new ScrollProgress();
}
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

    if (this.btn) {
      this.initializeProgress();
      this.bindEvents();
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

  updateScrollProgress() {
    if (!document.documentElement) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (Math.abs(scrollTop - this.lastScrollTop) < 5) {
      this.ticking = false;
      return;
    }
    
    this.lastScrollTop = scrollTop;

    if (!this.documentHeight || this.recalculateDocHeight) {
      this.documentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
      ) - window.innerHeight;
      this.recalculateDocHeight = false;
    }

    if (this.documentHeight <= 0) {
      this.ticking = false;
      return;
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
      this.recalculateDocHeight = true;
    }, { passive: true });

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
}

export function back2top() {
  new ScrollProgress();
}
class ScrollProgress {
  constructor() {
    this.btn = document.getElementById("back-to-top");
    this.perimeter = 4 * 40;
    this.scrollTimeout = null;

    if (this.btn) {
      this.initializeProgress();
      this.bindEvents();
    }
  }

  initializeProgress() {
    const { svg, path, percentageText } = this.createScrollElements();
    this.path = path;
    this.percentageText = percentageText;

    this.btn.appendChild(svg);
    this.btn.appendChild(percentageText);
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
      stroke: "var(--btn-backtotop-color)",
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
    const docHeight =
      Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
      ) - window.innerHeight;

    if (docHeight <= 0) return;

    const scrollFraction = Math.min(Math.max(scrollTop / docHeight, 0), 1);
    const drawLength = this.perimeter * scrollFraction;
    const scrollPercentage = Math.round(scrollFraction * 100);

    this.updateUI(drawLength, scrollPercentage);
  }

  updateUI(drawLength, scrollPercentage) {
    this.path.style.strokeDashoffset = this.perimeter - drawLength;
    this.percentageText.textContent = `${scrollPercentage}`;
    this.percentageText.classList.add("visible");
    
    const icon = this.btn.querySelector("i");
    if (icon) {
      icon.style.opacity = "0";
    }

    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.percentageText.classList.remove("visible");
      if (icon) {
        icon.style.opacity = "1";
      }
    }, 500);
  }

  bindEvents() {
    window.addEventListener("scroll", () => {
      requestAnimationFrame(() => {
        try {
          this.updateScrollProgress();
          if (window.scrollY > 50) {
            this.btn.classList.add("show");
          } else {
            this.btn.classList.remove("show");
          }
        } catch (error) {
          console.error("Error in scroll handler:", error);
        }
      });
    });

    this.btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

export function back2top() {
  new ScrollProgress();
}
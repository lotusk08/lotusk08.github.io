class ScrollProgress {
  constructor() {
    this.btn = document.getElementById("back-to-top");
    this.circumference = 2 * Math.PI * 20;
    this.scrollTimeout = null;

    if (this.btn) {
      this.initializeProgress();
      this.bindEvents();
    }
  }

  initializeProgress() {
    const { svg, circle, percentageText } = this.createScrollElements();
    this.circle = circle;
    this.percentageText = percentageText;

    this.btn.appendChild(svg);
    this.btn.appendChild(percentageText);
  }

  createScrollElements() {
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
    this.circle.style.strokeDashoffset = this.circumference - drawLength;
    this.percentageText.textContent = `${scrollPercentage}`;
    this.percentageText.classList.add("visible");

    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.percentageText.classList.remove("visible");
    }, 500);
  }

  bindEvents() {
    window.addEventListener("scroll", () => {
      requestAnimationFrame(() => {
        try {
          this.updateScrollProgress();

          // Show/hide button based on scroll position
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

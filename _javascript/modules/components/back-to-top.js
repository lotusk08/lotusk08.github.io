class ScrollProgress {
  constructor() {
    // Core state
    this.state = {
      progress: 0,
      isVisible: false,
      lastScrollTop: 0
    };

    // Configuration
    this.config = {
      perimeter: 160, // 4 * 40 pre-calculated
      visibilityThreshold: 50,
      fadeDelay: 1000
    };

    // Control flags
    this.rafId = null;
    this.fadeTimeout = null;

    // DOM Elements
    this.elements = {
      btn: null,
      progressPath: null,
      progressText: null,
      icon: null
    };

    // Initialize
    this.init();

    // Add cleanup method call when InstantView changes page
    if (window.InstantView) {
      window.InstantView.on("change", () => {
        if (this.elements.btn) {
          this.destroy();
        }
        // Delay initialization slightly to ensure DOM is ready
        setTimeout(() => this.init(), 50);
      });
    }
  }

  init() {
    // First check if button exists and hasn't been initialized
    this.elements.btn = document.getElementById("back-to-top");
    if (!this.elements.btn) return;
    
    this.createElements();
    this.bindEvents();
    this.updateProgress();
  }

  createElements() {
    // Create SVG structure
    const template = `
      <svg id="progress-circle" width="44" height="44" viewBox="0 0 44 44">
        <path d="M 2 2 H 42 V 42 H 2 Z"
              fill="none"
              stroke="var(--text-color)"
              stroke-width="1"
              stroke-dasharray="${this.config.perimeter}"
              stroke-dashoffset="${this.config.perimeter}">
        </path>
      </svg>
      <div id="scroll-percentage" class="scroll-percentage">0</div>
    `;

    this.elements.btn.insertAdjacentHTML("beforeend", template);

    // Cache DOM references
    this.elements.progressPath = this.elements.btn.querySelector("path");
    this.elements.progressText = this.elements.btn.querySelector("#scroll-percentage");
    this.elements.icon = this.elements.btn.querySelector("i");
  }

  calculateScrollProgress() {
    const { scrollY, innerHeight } = window;
    const { scrollHeight } = document.documentElement;

    const maxScroll = scrollHeight - innerHeight;
    const scrollFraction = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0;

    return {
      percentage: Math.round(scrollFraction * 100),
      fraction: scrollFraction,
      isVisible: scrollY > this.config.visibilityThreshold
    };
  }

  updateProgress = () => {
    const { percentage, fraction, isVisible } = this.calculateScrollProgress();

    // Update state
    this.state.progress = percentage;
    this.state.isVisible = isVisible;

    // Update UI
    this.updateUI(fraction, percentage);

    this.rafId = null;
  };

  updateUI(fraction, percentage) {
    // Toggle button visibility
    this.elements.btn.classList.toggle("show", this.state.isVisible);

    // Update progress circle
    if (this.elements.progressPath) {
      const drawLength = this.config.perimeter * fraction;
      this.elements.progressPath.style.strokeDashoffset = this.config.perimeter - drawLength;
    }

    // Update percentage text
    if (this.elements.progressText) {
      this.elements.progressText.textContent = percentage;
      this.elements.progressText.classList.add("visible");

      // Hide icon
      if (this.elements.icon) {
        this.elements.icon.style.opacity = "0";
      }

      // Set timeout to revert changes
      clearTimeout(this.fadeTimeout);
      this.fadeTimeout = setTimeout(() => {
        this.elements.progressText.classList.remove("visible");
        if (this.elements.icon) {
          this.elements.icon.style.opacity = "1";
        }
      }, this.config.fadeDelay);
    }
  }

  handleScroll = () => {
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(this.updateProgress);
    }
  };

  handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  bindEvents() {
    // Scroll event
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    // Click event
    this.elements.btn.addEventListener("click", this.handleClick);
  }

  destroy() {
    if (this.elements.btn) {
      window.removeEventListener("scroll", this.handleScroll);
      cancelAnimationFrame(this.rafId);
      clearTimeout(this.fadeTimeout);
      
      // Remove all event listeners
      this.elements.btn.removeEventListener("click", this.handleClick);
      
      // Reset button to initial state
      this.elements.btn.innerHTML = '<i class="fas fa-angle-up"></i>';
      
      // Clear references
      this.elements = {
        btn: null,
        progressPath: null,
        progressText: null,
        icon: null
      };
    }
  }
}

// Singleton pattern
let scrollProgressInstance = null;

export function back2top() {
  if (!scrollProgressInstance) {
    scrollProgressInstance = new ScrollProgress();
  } else {
    // Reinitialize if instance exists but needs to be refreshed
    scrollProgressInstance.init();
  }
  return scrollProgressInstance;
}
export class InstantViewHandler {
  static #loadedScripts = new Set();
  static #cdnUrls = {
    // Resource Hints are handled in HTML/Jekyll
    
    // Libraries
    toc: {
      css: 'https://cdn.jsdelivr.net/npm/tocbot@4.32.2/dist/tocbot.min.css',
      js: 'https://cdn.jsdelivr.net/npm/tocbot@4.32.2/dist/tocbot.min.js'
    },
    fontawesome: {
      css: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.1/css/all.min.css'
    },
    fonts: {
      jetbrainsmono: {
        css: 'https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.19/index.min.css'
      },
      notoserifdisplay: {
        css: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-serif-display@5.2.6/index.min.css'
      }
    },
    search: {
      js: 'https://cdn.jsdelivr.net/npm/simple-jekyll-search@1.10.0/dest/simple-jekyll-search.min.js'
    },
    mermaid: {
      js: 'https://cdn.jsdelivr.net/npm/mermaid@11.4.0/dist/mermaid.min.js'
    },
    chartjs: {
      js: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js'
    },
    dayjs: {
      js: {
        common: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js',
        locale: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/locale/:LOCALE.js',
        relativeTime: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/plugin/relativeTime.js',
        localizedFormat: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/plugin/localizedFormat.js'
      }
    },
    glightbox: {
      css: 'https://cdn.jsdelivr.net/npm/glightbox@3.3.0/dist/css/glightbox.min.css',
      js: 'https://cdn.jsdelivr.net/npm/glightbox@3.3.0/dist/js/glightbox.min.js'
    },
    polyfill: {
      css: 'https://cdn.jsdelivr.net/npm/loading-attribute-polyfill@2.1.1/dist/loading-attribute-polyfill.min.css',
      js: 'https://cdn.jsdelivr.net/npm/loading-attribute-polyfill@2.1.1/dist/loading-attribute-polyfill.umd.min.js'
    },
    clipboard: {
      js: 'https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js'
    },
    mathjax: {
      js: 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-chtml.js'
    },
    waline: {
      js: 'https://cdn.jsdelivr.net/npm/@waline/client@3/dist/waline.js',
      css: 'https://cdn.jsdelivr.net/npm/@waline/client@3/dist/waline.css',
      emojis: 'https://cdn.jsdelivr.net/npm/@waline/emojis@1.3.0'
    }
  };

  constructor() {
    this.eventHandlers = {
      change: [],
      receive: [],
      wait: [],
      restore: []
    };

    this.initialize();
  }

  static async loadScript(url) {
    if (this.#loadedScripts.has(url)) {
      return true;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = () => {
        this.#loadedScripts.add(url);
        resolve(true);
      };
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.head.appendChild(script);
    });
  }

  static async loadCSS(url) {
    if (document.querySelector(`link[href="${url}"]`)) {
      return true;
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = () => resolve(true);
      link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
      document.head.appendChild(link);
    });
  }

  initialize() {
    if (!window.InstantView?.supported) {
      return;
    }

    window.InstantView.init("mouseover");
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    window.InstantView.on("change", (isInitialLoad) => {
      if (!isInitialLoad) {
        this.reinitializeComponents();
      }
    });

    window.InstantView.on("receive", (url, body, title) => {
      return { body, title };
    });

    window.InstantView.on("wait", () => {
      // Optional: Add loading indicators here
    });

    window.InstantView.on("restore", () => {
      this.reinitializeComponents();
    });
  }

  async reinitializeComponents() {
    await new Promise(resolve => setTimeout(resolve, 50));

    // Core components
    try {
      window.basic?.();
      window.initTopbar?.();
      window.Theme?.init?.();
      window.displaySearch?.();
      window.loadTooptip?.();
      window.modeWatcher?.();

      if (document.getElementById("back-to-top")) {
        window.back2top?.();
      }
    } catch (err) {
      console.warn("Error reinitializing core components:", err);
    }

    // Feature components with dynamic loading
    const features = [
      {
        selector: 'main>article[data-toc="true"]',
        init: async () => {
          if (document.querySelector("#toc")) {
            try {
              await InstantViewHandler.loadCSS(InstantViewHandler.#cdnUrls.toc.css);
              await InstantViewHandler.loadScript(InstantViewHandler.#cdnUrls.toc.js);
              await window.initToc?.();
            } catch (err) {
              console.warn('TOC initialization failed:', err);
            }
          }
        }
      },
      {
        selector: ".code-header>button",
        init: async () => {
          try {
            await InstantViewHandler.loadScript(InstantViewHandler.#cdnUrls.clipboard.js);
            await window.initClipboard?.();
          } catch (err) {
            console.warn('Clipboard initialization failed:', err);
          }
        }
      },
      {
        selector: ".language-mermaid",
        init: async () => {
          try {
            await InstantViewHandler.loadScript(InstantViewHandler.#cdnUrls.mermaid.js);
            
            // Wait for a moment to ensure DOM is ready
            await new Promise(resolve => setTimeout(resolve, 100));
      
            // Initialize Mermaid with the current theme
            const isDark = document.documentElement.getAttribute('data-mode') === 'dark';
            window.mermaid?.initialize({ 
              theme: isDark ? 'dark' : 'default',
              startOnLoad: false
            });
      
            // Find all Mermaid diagrams
            const mermaidDivs = document.querySelectorAll('.language-mermaid');
            
            for (const div of mermaidDivs) {
              // Create a wrapper if needed
              let wrapper = div.parentElement;
              if (!wrapper?.classList.contains('mermaid-wrapper')) {
                wrapper = document.createElement('div');
                wrapper.className = 'mermaid-wrapper';
                div.parentNode.insertBefore(wrapper, div);
                wrapper.appendChild(div);
              }
      
              try {
                // Get the diagram code
                const graphCode = div.textContent;
                // Create a unique ID
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                wrapper.id = id;
                
                // Render the diagram
                await window.mermaid?.render(id, graphCode);
              } catch (renderError) {
                console.warn('Failed to render Mermaid diagram:', renderError);
              }
            }
          } catch (err) {
            console.warn('Mermaid initialization failed:', err);
          }
        }
      },
      {
        selector: ".language-chart",
        init: async () => {
          try {
            await InstantViewHandler.loadScript(InstantViewHandler.#cdnUrls.chartjs.js);
            await window.loadChartJS?.();
          } catch (err) {
            console.warn('ChartJS initialization failed:', err);
          }
        }
      },
      {
        selector: ".popup",
        init: async () => {
          try {
            await InstantViewHandler.loadCSS(InstantViewHandler.#cdnUrls.glightbox.css);
            await InstantViewHandler.loadScript(InstantViewHandler.#cdnUrls.glightbox.js);
            await window.imgPopup?.();
          } catch (err) {
            console.warn('GLightbox initialization failed:', err);
          }
        }
      },
      {
        selector: "[data-ts]",
        init: async () => {
          try {
            // Load dayjs and its plugins
            await InstantViewHandler.loadScript(InstantViewHandler.#cdnUrls.dayjs.js.common);
            
            const locale = document.documentElement.getAttribute('lang')?.substring(0, 2) || 'en';
            const localeUrl = InstantViewHandler.#cdnUrls.dayjs.js.locale.replace(':LOCALE', locale);
            
            await InstantViewHandler.loadScript(localeUrl);
            await InstantViewHandler.loadScript(InstantViewHandler.#cdnUrls.dayjs.js.relativeTime);
            await InstantViewHandler.loadScript(InstantViewHandler.#cdnUrls.dayjs.js.localizedFormat);
            
            await window.initLocaleDatetime?.();
          } catch (err) {
            console.warn('DateTime initialization failed:', err);
          }
        }
      },
      {
        selector: "#waline",
        init: async () => {
          try {
            await InstantViewHandler.loadCSS(InstantViewHandler.#cdnUrls.waline.css);
            await InstantViewHandler.loadScript(InstantViewHandler.#cdnUrls.waline.js);
            // Add Waline initialization if needed
          } catch (err) {
            console.warn('Waline initialization failed:', err);
          }
        }
      },
      {
        selector: ".math, .mathjax",
        init: async () => {
          try {
            // Load polyfill CSS and JS first
            await InstantViewHandler.loadCSS(InstantViewHandler.#cdnUrls.polyfill.css);
            await InstantViewHandler.loadScript(InstantViewHandler.#cdnUrls.polyfill.js);
      
            // Load MathJax config
            const configScript = document.createElement('script');
            configScript.textContent = `
              MathJax = {
                tex: {
                  inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                  displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                  tags: 'ams'
                },
                startup: {
                  typeset: false // Prevent automatic typesetting before ready
                }
              };
            `;
            document.head.appendChild(configScript);
      
            // Load MathJax
            await InstantViewHandler.loadScript(InstantViewHandler.#cdnUrls.mathjax.js);
      
            // Wait for MathJax to be ready and then typeset
            if (window.MathJax) {
              await window.MathJax.startup.promise;
              await window.MathJax.typesetPromise();
            }
          } catch (err) {
            console.warn('MathJax initialization failed:', err);
          }
        }
      },
      {
        selector: "[loading='lazy']",
        init: async () => {
          try {
            await InstantViewHandler.loadCSS(InstantViewHandler.#cdnUrls['lazy-polyfill'].css);
            await InstantViewHandler.loadScript(InstantViewHandler.#cdnUrls['lazy-polyfill'].js);
          } catch (err) {
            console.warn('Lazy loading polyfill failed:', err);
          }
        }
      }
    ];
    

    for (const feature of features) {
      try {
        if (document.querySelector(feature.selector)) {
          await feature.init();
        }
      } catch (err) {
        console.warn(`Error initializing feature for ${feature.selector}:`, err);
      }
    }
  }
}
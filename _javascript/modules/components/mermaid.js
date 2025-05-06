const MERMAID = "mermaid";
const MERMAID_JS_URL = "https://cdn.jsdelivr.net/npm/mermaid@11.4.0/dist/mermaid.min.js";
const themeMapper = Theme.getThemeMapper("default", "dark");

let themeMessageListener = null;

function loadMermaidScript() {
  return new Promise((resolve, reject) => {
    if (typeof mermaid !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = MERMAID_JS_URL;
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Mermaid'));
    
    document.head.appendChild(script);
  });
}

function cleanup() {
  if (themeMessageListener) {
    window.removeEventListener("message", themeMessageListener);
    themeMessageListener = null;
  }

  const mermaidElements = document.getElementsByClassName(MERMAID);
  while (mermaidElements.length > 0) {
    mermaidElements[0].remove();
  }
}

function refreshTheme(event) {
  if (event.source === window && event.data && event.data.id === Theme.ID) {
    const mermaidList = document.getElementsByClassName(MERMAID);
    const svgs = [...mermaidList];
    const newTheme = themeMapper[Theme.visualState];

    for (let i = 0; i < svgs.length; i++) {
      const elem = svgs[i];
      const svgCode = elem.previousSibling.children[0].textContent;
      elem.textContent = svgCode;
      elem.removeAttribute("data-processed");
    }

    mermaid.initialize({ theme: newTheme });
    mermaid.init(null, `.${MERMAID}`);
  }
}

function setNode(elem) {
  const svgCode = elem.textContent;
  const backup = elem.parentElement;
  backup.classList.add("d-none");
  const mermaid = document.createElement("pre");
  mermaid.classList.add(MERMAID);
  mermaid.textContent = svgCode;
  backup.after(mermaid);
}

export async function loadMermaid() {
  const basicList = document.getElementsByClassName("language-mermaid");
  if (basicList.length === 0) return;

  try {
    await loadMermaidScript();
    
    cleanup();

    const initTheme = themeMapper[Theme.visualState];
    mermaid.initialize({ theme: initTheme });

    for (let i = 0; i < basicList.length; i++) {
      setNode(basicList[i]);
    }

    await mermaid.init(null, `.${MERMAID}`);

    if (Theme.switchable) {
      themeMessageListener = refreshTheme;
      window.addEventListener("message", themeMessageListener);
    }
  } catch (error) {
    console.error('Failed to initialize Mermaid:', error);
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadMermaid);

// Handle InstantView page changes
if (window.InstantView) {
  window.InstantView.on('change', () => {
    cleanup();
    // Delay initialization to ensure DOM is ready
    setTimeout(loadMermaid, 50);
  });
}
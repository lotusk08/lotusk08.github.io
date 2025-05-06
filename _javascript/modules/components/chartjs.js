const CHART_CLASS = "language-chart";
const CHART_CONTAINER_CLASS = "chartjs-container";
const CHART_JS_URL = "https://cdn.jsdelivr.net/npm/chart.js@4.4.9/dist/chart.umd.min.js";

const THEME_COLORS = {
  dark: {
    backgroundColor: 'rgba(44, 45, 45, 0.2)',
    borderColor: 'rgb(44, 45, 45)',
    color: '#cecdcd',
    backdropColor: 'rgba(27, 27, 30, 0.75)'
  },
  light: {
    backgroundColor: 'rgba(243, 243, 243, 0.2)',
    borderColor: '#f3f3f3',
    color: '#5e5e5e',
    backdropColor: 'rgba(255, 255, 249, 0.75)'
  }
};

let chartInstances = [];
let mediaQueryListener = null;
let themeMessageListener = null;

function loadChartJSScript() {
  return new Promise((resolve, reject) => {
    if (typeof Chart !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = CHART_JS_URL;
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Chart.js'));
    
    document.head.appendChild(script);
  });
}

function cleanup() {
  chartInstances.forEach(chart => chart?.destroy?.());
  chartInstances.length = 0;
  
  const containers = document.getElementsByClassName(CHART_CONTAINER_CLASS);
  while (containers.length > 0) {
    containers[0].remove();
  }

  if (mediaQueryListener) {
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', loadChartJS);
    mediaQueryListener = null;
  }
  
  if (themeMessageListener) {
    window.removeEventListener('message', themeMessageListener);
    themeMessageListener = null;
  }
}

export async function loadChartJS() {
  const chartBlocks = document.getElementsByClassName(CHART_CLASS);
  if (chartBlocks.length === 0) return;

  try {
    await loadChartJSScript();
    
    cleanup();

    const isDarkMode = document.documentElement.getAttribute('data-mode') === 'dark' || 
      (document.documentElement.getAttribute('data-mode') === null && 
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    const theme = isDarkMode ? 'dark' : 'light';
    const colors = THEME_COLORS[theme];
    
    Chart.defaults.backgroundColor = colors.backgroundColor;
    Chart.defaults.borderColor = colors.borderColor;
    Chart.defaults.color = colors.color;
    
    for (const codeElem of chartBlocks) {
      try {
        const config = JSON.parse(codeElem.textContent.trim());
        
        if (config.options?.scales) {
          Object.values(config.options.scales).forEach(scale => {
            scale.ticks = scale.ticks || {};
            scale.ticks.backdropColor = colors.backdropColor;
            scale.ticks.backdropPadding = scale.ticks.backdropPadding || 2;
          });
        }
        
        codeElem.parentElement.classList.add("d-none");
        const container = document.createElement("div");
        container.className = CHART_CONTAINER_CLASS;
        const canvas = document.createElement("canvas");
        container.appendChild(canvas);
        codeElem.parentElement.after(container);
        
        chartInstances.push(new Chart(canvas, config));
      } catch (e) {
        console.warn('Error creating chart:', e);
      }
    }

    mediaQueryListener = loadChartJS;
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', mediaQueryListener);
    
    themeMessageListener = ({data}) => {
      if (data?.id === 'theme-mode') loadChartJS();
    };
    window.addEventListener('message', themeMessageListener);

  } catch (error) {
    console.error('Failed to initialize ChartJS:', error);
  }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadChartJS);

// Handle InstantView page changes
if (window.InstantView) {
  window.InstantView.on('change', () => {
    cleanup();
    // Delay initialization to ensure DOM is ready
    setTimeout(loadChartJS, 50);
  });
}
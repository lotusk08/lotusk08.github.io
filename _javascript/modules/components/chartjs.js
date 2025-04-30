const CHART_CLASS = "language-chart";
const CHART_CONTAINER_CLASS = "chartjs-container";
const THEME_COLORS = {
  dark: {
    backgroundColor: 'rgba(44, 45, 45, 0.2)',
    borderColor: 'rgb(44, 45, 45)',
    color: '#cecdcd'
  },
  light: {
    backgroundColor: 'rgba(243, 243, 243, 0.2)',
    borderColor: '#f3f3f3',
    color: '#5e5e5e'
  }
};

export function loadChartJS() {
  if (typeof Chart === "undefined") {
    console.error('Chart.js is not loaded. Ensure the Chart.js CDN is included.');
    return;
  }
  
  const containers = document.getElementsByClassName(CHART_CONTAINER_CLASS);
  while (containers.length > 0) {
    containers[0].remove();
  }
  
  const isDarkMode = document.body.classList.contains('dark-theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const theme = isDarkMode ? 'dark' : 'light';
  const colors = THEME_COLORS[theme];
  
  Chart.defaults.backgroundColor = colors.backgroundColor;
  Chart.defaults.borderColor = colors.borderColor;
  Chart.defaults.color = colors.color;
  
  console.log('Applied Chart.js defaults:', Chart.defaults);
  
  const chartBlocks = document.getElementsByClassName(CHART_CLASS);
  if (chartBlocks.length === 0) {
    console.warn('No chart blocks found with class:', CHART_CLASS);
  }
  
  for (let i = 0; i < chartBlocks.length; i++) {
    const codeElem = chartBlocks[i];
    const chartConfigText = codeElem.textContent.trim();
    let config;
    
    try {
      config = JSON.parse(chartConfigText);
      
      if (config.options && config.options.scales) {
        Object.keys(config.options.scales).forEach(scaleId => {
          const scale = config.options.scales[scaleId];
          
          if (!scale.ticks) {
            scale.ticks = {};
          }
          
          if (!scale.ticks.backdropColor) {
            scale.ticks.backdropColor = isDarkMode ? 
              'rgba(30, 30, 30, 0.75)' : 'rgba(255, 255, 255, 0.75)';
          }
          
          if (!scale.ticks.backdropPadding) {
            scale.ticks.backdropPadding = 2;
          }
        });
      }
      
    } catch (e) {
      console.error('Error parsing chart JSON for block', i, ':', e);
      continue;
    }
    
    codeElem.parentElement.classList.add("d-none");
    const container = document.createElement("div");
    container.className = CHART_CONTAINER_CLASS;
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    codeElem.parentElement.after(container);
    
    try {
      new Chart(canvas, config);
      console.log('Rendered chart', i, 'with config:', config);
    } catch (e) {
      console.error('Error rendering chart', i, ':', e);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadChartJS();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', loadChartJS);
  const themeToggle = document.querySelector('#theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      loadChartJS();
    });
  }
});
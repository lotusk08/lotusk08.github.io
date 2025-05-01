const CHART_CLASS = "language-chart";
const CHART_CONTAINER_CLASS = "chartjs-container";
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

const chartInstances = [];

export function loadChartJS() {
  if (typeof Chart === "undefined") {
    
    return;
  }
  
  chartInstances.forEach(chart => chart?.destroy?.());
  chartInstances.length = 0;
  
  const containers = document.getElementsByClassName(CHART_CONTAINER_CLASS);
  while (containers.length > 0) {
    containers[0].remove();
  }
  
  const isDarkMode = document.documentElement.getAttribute('data-mode') === 'dark' || 
    (document.documentElement.getAttribute('data-mode') === null && 
     window.matchMedia('(prefers-color-scheme: dark)').matches);
  const theme = isDarkMode ? 'dark' : 'light';
  const colors = THEME_COLORS[theme];
  
  Chart.defaults.backgroundColor = colors.backgroundColor;
  Chart.defaults.borderColor = colors.borderColor;
  Chart.defaults.color = colors.color;
  
  const chartBlocks = document.getElementsByClassName(CHART_CLASS);
  if (chartBlocks.length === 0) return;
  
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
    
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadChartJS();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', loadChartJS);
  window.addEventListener('message', ({data}) => {
    if (data?.id === 'theme-mode') loadChartJS();
  });
});
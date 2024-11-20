document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  // Create SVG container and progress circle
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  svg.setAttribute("id", "progress-circle");
  svg.setAttribute("width", "44");
  svg.setAttribute("height", "44");

  circle.setAttribute("cx", "22");
  circle.setAttribute("cy", "22");
  circle.setAttribute("r", "20");
  circle.setAttribute("stroke-width", "1");
  circle.setAttribute("stroke-dasharray", `${2 * Math.PI * 20}`);
  circle.setAttribute("stroke-dashoffset", `${2 * Math.PI * 20}`);
  circle.setAttribute("fill", "none");
  circle.style.stroke = "var(--btn-backtotop-color)";

  svg.appendChild(circle);
  btn.appendChild(svg);

  // Create scroll percentage text
  const percentageText = document.createElement("div");
  percentageText.id = "scroll-percentage";
  percentageText.textContent = "0%";
  btn.appendChild(percentageText);

  // Variables for scroll behavior
  let scrollTimeout;
  const circumference = 2 * Math.PI * 20;

  // Update progress on scroll
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (docHeight > 0) {
      const scrollFraction = scrollTop / docHeight;
      const drawLength = circumference * scrollFraction;
      const scrollPercentage = Math.round(scrollFraction * 100);

      // Update the circle progress
      circle.style.strokeDashoffset = circumference - drawLength;

      // Show the percentage text with background
      percentageText.textContent = `${scrollPercentage}`;

      // Add the visible class to show the text and background
      percentageText.classList.add('visible');

      // Clear any existing timeout to hide the text after scrolling stops
      clearTimeout(scrollTimeout);

      // Hide the percentage text after a delay (500ms)
      scrollTimeout = setTimeout(() => {
        percentageText.classList.remove('visible');
      }, 500);
    }
  };

  // Use requestAnimationFrame to smooth scroll updates
  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateScrollProgress);
  });
});

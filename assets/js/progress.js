document.addEventListener('DOMContentLoaded', () => {
  // Back-to-Top Button Logic
  const btn = document.getElementById('back-to-top');
  if (!btn) return; // Early return if button doesn't exist

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

  const circumference = 2 * Math.PI * 20;
  let scrollTimeout;

  const updateScrollProgress = () => {
    if (!document.documentElement) return;
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = Math.max(
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
      document.documentElement.clientHeight
    ) - window.innerHeight;

    if (docHeight > 0) {
      const scrollFraction = Math.min(Math.max(scrollTop / docHeight, 0), 1);
      const drawLength = circumference * scrollFraction;
      const scrollPercentage = Math.round(scrollFraction * 100);

      // Update the circle progress
      circle.style.strokeDashoffset = circumference - drawLength;

      // Show the percentage text with background
      percentageText.textContent = `${scrollPercentage}`;
      percentageText.classList.add('visible');

      // Hide the percentage text after a delay
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        percentageText.classList.remove('visible');
      }, 500);
    }
  };

  // Use requestAnimationFrame and add error handling
  window.addEventListener('scroll', () => {
    try {
      window.requestAnimationFrame(updateScrollProgress);
    } catch (error) {
      console.error('Error updating scroll progress:', error);
    }
  });

  // Scroll to top on click
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // TOC Wrapper Logic
  const tocWrapper = document.getElementById('toc-wrapper');
  if (tocWrapper) {
    // Show TOC for a few seconds when the page loads
    tocWrapper.classList.add('visible');
    setTimeout(() => {
      tocWrapper.classList.remove('visible'); // Hide the TOC after 1.5s
    }, 1500); // 1.5 seconds after the page loads

    let tocTimeout;

    // Show TOC on scroll
    const showTOCOnScroll = () => {
      tocWrapper.classList.add('visible'); // Add visible class to the TOC

      // Hide TOC after some idle time
      clearTimeout(tocTimeout);
      tocTimeout = setTimeout(() => {
        tocWrapper.classList.remove('visible'); // Hide the TOC after 1.2 seconds of inactivity
      }, 1200); // 1.2 seconds of inactivity
    };

    window.addEventListener('scroll', () => {
      showTOCOnScroll();
    });
  }
});

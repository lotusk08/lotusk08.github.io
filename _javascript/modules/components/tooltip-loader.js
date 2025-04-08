import Tooltip from "bootstrap/js/src/tooltip";

export function loadTooptip() {
  const tooltips = [
    ...document.querySelectorAll('[data-bs-toggle="tooltip"]')
  ].map((el) => new Tooltip(el));
  return tooltips;
}

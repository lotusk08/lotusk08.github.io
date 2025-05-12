import "bootstrap/js/src/collapse.js";

const childPrefix = "l_";
const parentPrefix = "h_";

export function categoryCollapse() {
  const children = document.getElementsByClassName("collapse");
  const arr = Array.from(children);

  for (const elem of arr) {
    const id = parentPrefix + elem.id.slice(childPrefix.length);
    const parent = document.getElementById(id);
    if (!parent) continue;

    const folderIcon = parent.querySelector('.icons-folder use');
    const angleIcon = parent.querySelector('.icons-angle use');

    elem.addEventListener("hide.bs.collapse", () => {
      folderIcon.setAttribute("href", "/assets/icons.svg#folder");
      angleIcon.setAttribute("href", "/assets/icons.svg#angle-down");
      angleIcon.closest('.icons').classList.add("rotate");
      parent.classList.remove("hide-border-bottom");
    });

    elem.addEventListener("show.bs.collapse", () => {
      folderIcon.setAttribute("href", "/assets/icons.svg#folder-open");
      angleIcon.setAttribute("href", "/assets/icons.svg#angle-down");
      angleIcon.closest('.icons').classList.remove("rotate");
      parent.classList.add("hide-border-bottom");
    });
  }
}

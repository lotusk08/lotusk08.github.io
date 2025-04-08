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

    const folderIcon = parent.querySelector(
      ".far.fa-folder, .far.fa-folder-open"
    );
    const angleIcon = parent.querySelector(".fas.fa-angle-down");

    elem.addEventListener("hide.bs.collapse", () => {
      folderIcon.className = "far fa-folder fa-fw";
      angleIcon.classList.add("rotate");
      parent.classList.remove("hide-border-bottom");
    });

    elem.addEventListener("show.bs.collapse", () => {
      folderIcon.className = "far fa-folder-open fa-fw";
      angleIcon.classList.remove("rotate");
      parent.classList.add("hide-border-bottom");
    });
  }
}

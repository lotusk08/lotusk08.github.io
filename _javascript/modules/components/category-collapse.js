const childPrefix = "l_";
const parentPrefix = "h_";

export function categoryCollapse() {
  const children = document.querySelectorAll(".collapse");

  children.forEach((elem) => {
    const id = parentPrefix + elem.id.slice(childPrefix.length);
    const parent = document.getElementById(id);
    if (!parent) {
      console.warn(`Parent element with ID ${id} not found`);
      return;
    }

    const folderIcon = parent.querySelector(".icons-folder use");
    const angleIcon = parent.querySelector(".icons-angle use");
    const trigger = parent.querySelector(".category-trigger");

    if (!trigger) {
      console.warn(`Trigger not found for parent ID ${id}`);
      return;
    }

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = parent.classList.toggle("is-open");
      console.log(`Toggled is-open for ${id}: ${isOpen}`);

      // Update collapse element
      const collapse = document.getElementById(elem.id);
      collapse.classList.toggle("show", isOpen);

      // Update icons and border
      folderIcon.setAttribute(
        "href",
        `/assets/icons.svg#${isOpen ? "folder-open" : "folder"}`
      );
      angleIcon.setAttribute("href", "/assets/icons.svg#angle-down");
      angleIcon.closest(".icons").classList.toggle("rotate", !isOpen);
      parent.classList.toggle("hide-border-bottom", isOpen);

      // Optional: Force reflow for height transition
      collapse.style.display = isOpen ? "block" : "none"; // Temporary fix if needed
      setTimeout(() => {
        collapse.style.display = "";
      }, 0);
    });
  });
}

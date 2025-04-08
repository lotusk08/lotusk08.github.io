const MERMAID = "mermaid";
const themeMapper = Theme.getThemeMapper("default", "dark");

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

export function loadMermaid() {
  if (
    typeof mermaid === "undefined" ||
    typeof mermaid.initialize !== "function"
  ) {
    return;
  }

  const initTheme = themeMapper[Theme.visualState];
  const mermaidConf = { theme: initTheme };
  const basicList = document.getElementsByClassName("language-mermaid");

  for (let i = 0; i < basicList.length; i++) {
    setNode(basicList[i]);
  }

  mermaid.initialize(mermaidConf);

  if (Theme.switchable) {
    window.addEventListener("message", refreshTheme);
  }
}

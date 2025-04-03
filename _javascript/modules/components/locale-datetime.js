class LocaleHelper {
  static get attrTimestamp() {
    return "data-ts";
  }

  static get attrDateFormat() {
    return "data-df";
  }

  static get locale() {
    return document.documentElement.getAttribute("lang").substring(0, 2);
  }

  static getTimestamp(elem) {
    return Number(elem.getAttribute(this.attrTimestamp));
  }

  static getDateFormat(elem) {
    return elem.getAttribute(this.attrDateFormat);
  }
}

export function initLocaleDatetime() {
  dayjs.locale(LocaleHelper.locale);
  dayjs.extend(window.dayjs_plugin_localizedFormat);

  const fragment = document.createDocumentFragment();
  const dateElements = document.querySelectorAll(
    `[${LocaleHelper.attrTimestamp}]`
  );

  dateElements.forEach((elem) => {
    const clone = elem.cloneNode(true);
    const date = dayjs.unix(LocaleHelper.getTimestamp(clone));
    const text = date.format(LocaleHelper.getDateFormat(clone));
    clone.textContent = text;
    clone.removeAttribute(LocaleHelper.attrTimestamp);
    clone.removeAttribute(LocaleHelper.attrDateFormat);

    if (
      clone.hasAttribute("data-bs-toggle") &&
      clone.getAttribute("data-bs-toggle") === "tooltip"
    ) {
      const tooltipText = date.format("llll");
      clone.setAttribute("data-bs-title", tooltipText);
    }

    fragment.appendChild(clone);
  });

  dateElements.forEach((elem) => {
    elem.parentNode.replaceChild(fragment.children[0], elem);
  });
}

class LocaleHelper {
  static get attrTimestamp() {
    return 'data-ts';
  }
  static get attrDateFormat() {
    return 'data-df';
  }
  static get locale() {
    return document.documentElement.getAttribute('lang').substring(0, 2);
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

  const dateElements = document.querySelectorAll(`[${LocaleHelper.attrTimestamp}]`);
  const attrTS = LocaleHelper.attrTimestamp;
  const attrDF = LocaleHelper.attrDateFormat;

  if (!dateElements.length) return;

  for (let i = 0; i < dateElements.length; i++) {
    const elem = dateElements[i];
    const date = dayjs.unix(LocaleHelper.getTimestamp(elem));
    const format = LocaleHelper.getDateFormat(elem);

    elem.textContent = date.format(format);
    elem.removeAttribute(attrTS);
    elem.removeAttribute(attrDF);
  }
}

const LOADED = "d-block";
const UNLOADED = "d-none";
const FOCUS = "input-focus";
const FLEX = "d-flex";

class SearchElements {
  static elements = {
    btnSbTrigger: document.getElementById("mode-toggle"),
    btnSearchTrigger: document.getElementById("search-trigger"),
    btnCancel: document.getElementById("search-cancel"),
    content: document.querySelectorAll("#main-wrapper>.container>.row"),
    topbarTitle: document.getElementById("topbar-title"),
    search: document.getElementById("search"),
    resultWrapper: document.getElementById("search-result-wrapper"),
    results: document.getElementById("search-results"),
    input: document.getElementById("search-input"),
    hints: document.getElementById("search-hints")
  };
}

class MobileSearchBar {
  static on() {
    const { btnSbTrigger, btnSearchTrigger, search, btnCancel, topbarTitle } =
      SearchElements.elements;
    btnSbTrigger.classList.add(UNLOADED);
    topbarTitle.classList.add(UNLOADED);
    btnSearchTrigger.classList.add(UNLOADED);
    search.classList.add(FLEX);
    btnCancel.classList.add(LOADED);
  }

  static off() {
    const { btnSbTrigger, btnSearchTrigger, search, btnCancel, topbarTitle } =
      SearchElements.elements;
    btnCancel.classList.remove(LOADED);
    search.classList.remove(FLEX);
    btnSbTrigger.classList.remove(UNLOADED);
    topbarTitle.classList.remove(UNLOADED);
    btnSearchTrigger.classList.remove(UNLOADED);
  }
}

class ResultSwitch {
  static resultVisible = false;

  static on() {
    if (!this.resultVisible) {
      const { resultWrapper, content } = SearchElements.elements;
      resultWrapper.classList.remove(UNLOADED);
      content.forEach((el) => {
        el.classList.add(UNLOADED);
      });
      this.resultVisible = true;
    }
  }

  static off() {
    if (this.resultVisible) {
      const { results, hints, resultWrapper, content, input } =
        SearchElements.elements;
      results.innerHTML = "";

      if (hints.classList.contains(UNLOADED)) {
        hints.classList.remove(UNLOADED);
      }

      resultWrapper.classList.add(UNLOADED);
      content.forEach((el) => {
        el.classList.remove(UNLOADED);
      });
      input.textContent = "";
      this.resultVisible = false;
    }
  }
}

function isMobileView() {
  return SearchElements.elements.btnCancel.classList.contains(LOADED);
}

export function displaySearch() {
  const { btnSearchTrigger, btnCancel, search, input, hints } =
    SearchElements.elements;

  btnSearchTrigger.addEventListener("click", () => {
    MobileSearchBar.on();
    ResultSwitch.on();
    input.focus();
  });

  btnCancel.addEventListener("click", () => {
    MobileSearchBar.off();
    ResultSwitch.off();
  });

  input.addEventListener("focus", () => {
    search.classList.add(FOCUS);
  });

  input.addEventListener("focusout", () => {
    search.classList.remove(FOCUS);
  });

  input.addEventListener("input", () => {
    if (input.value === "") {
      if (isMobileView()) {
        hints.classList.remove(UNLOADED);
      } else {
        ResultSwitch.off();
      }
    } else {
      ResultSwitch.on();
      if (isMobileView()) {
        hints.classList.add(UNLOADED);
      }
    }
  });
}

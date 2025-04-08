const btnSbTrigger = document.getElementById('mode-toggle');
const btnSearchTrigger = document.getElementById('search-trigger');
const btnCancel = document.getElementById('search-cancel');
const content = document.querySelectorAll('#main-wrapper>.container>.row');
const topbarTitle = document.getElementById('topbar-title');
const search = document.getElementById('search');
const resultWrapper = document.getElementById('search-result-wrapper');
const results = document.getElementById('search-results');
const input = document.getElementById('search-input');
const hints = document.getElementById('search-hints');

const LOADED = 'd-block';
const UNLOADED = 'd-none';
const FOCUS = 'input-focus';
const FLEX = 'd-flex';

class MobileSearchBar {
  static on() {
    btnSbTrigger.classList.add(UNLOADED);
    topbarTitle.classList.add(UNLOADED);
    btnSearchTrigger.classList.add(UNLOADED);
    search.classList.add(FLEX);
    btnCancel.classList.add(LOADED);
  }

  static off() {
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
      resultWrapper.classList.remove(UNLOADED);
      
      const len = content.length;
      for (let i = 0; i < len; i++) {
        content[i].classList.add(UNLOADED);
      }
      
      this.resultVisible = true;
    }
  }

  static off() {
    if (this.resultVisible) {
      results.innerHTML = '';

      if (hints.classList.contains(UNLOADED)) {
        hints.classList.remove(UNLOADED);
      }

      resultWrapper.classList.add(UNLOADED);
      
      const len = content.length;
      for (let i = 0; i < len; i++) {
        content[i].classList.remove(UNLOADED);
      }
      
      input.textContent = '';
      this.resultVisible = false;
    }
  }
}

function isMobileView() {
  return btnCancel.classList.contains(LOADED);
}

export function displaySearch() {
  btnSearchTrigger.addEventListener('click', () => {
    MobileSearchBar.on();
    ResultSwitch.on();
    input.focus();
  });

  btnCancel.addEventListener('click', () => {
    MobileSearchBar.off();
    ResultSwitch.off();
  });

  input.addEventListener('focus', () => {
    search.classList.add(FOCUS);
  });

  input.addEventListener('focusout', () => {
    search.classList.remove(FOCUS);
  });

  input.addEventListener('input', () => {
    const isEmpty = input.value === '';
    const mobile = isMobileView();
    
    if (isEmpty) {
      if (mobile) {
        hints.classList.remove(UNLOADED);
      } else {
        ResultSwitch.off();
      }
    } else {
      ResultSwitch.on();
      if (mobile) {
        hints.classList.add(UNLOADED);
      }
    }
  });
}
import 'bootstrap/js/src/collapse.js';

const childPrefix = 'l_';
const parentPrefix = 'h_';

export function categoryCollapse() {
  const children = document.getElementsByClassName('collapse');
  
  [...children].forEach(elem => {
    const id = parentPrefix + elem.id.substring(childPrefix.length);
    const parent = document.getElementById(id);

    elem.addEventListener('hide.bs.collapse', () => {
      if (parent) {
        parent.querySelector('.far.fa-folder-open').className = 'far fa-folder fa-fw';
        parent.querySelector('.fas.fa-angle-down').classList.add('rotate');
        parent.classList.remove('hide-border-bottom');
      }
    });

    elem.addEventListener('show.bs.collapse', () => {
      if (parent) {
        parent.querySelector('.far.fa-folder').className = 'far fa-folder-open fa-fw';
        parent.querySelector('.fas.fa-angle-down').classList.remove('rotate');
        parent.classList.add('hide-border-bottom');
      }
    });
  });
}
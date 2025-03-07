import { basic, initTopbar } from './modules/layouts';

import {
  loadImg,
  imgPopup,
  initLocaleDatetime,
  initClipboard,
  initToc,
  loadMermaid
} from './modules/components';

loadImg();
initToc();
imgPopup();
initLocaleDatetime();
initClipboard();
initTopbar();
loadMermaid();
basic();

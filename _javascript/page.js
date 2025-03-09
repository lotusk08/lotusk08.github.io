import { basic, initTopbar } from './modules/layouts';
import {
  loadImg,
  initToc,
  imgPopup,
  initClipboard,
  loadMermaid
} from './modules/components';

loadImg();
initToc();
imgPopup();
initTopbar();
initClipboard();
loadMermaid();
basic();

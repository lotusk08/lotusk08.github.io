import { basic, initTopbar } from './modules/layouts';
import {
  loadImg,
  imgPopup,
  initClipboard,
  loadMermaid
} from './modules/components';

loadImg();
imgPopup();
initTopbar();
initClipboard();
loadMermaid();
basic();

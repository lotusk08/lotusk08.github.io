import { InstantViewHandler } from "./modules/instantview-handler";
import { basic, initTopbar } from "./modules/layouts";
import { modeWatcher } from './modules/components/mode-toggle';
import { displaySearch } from "./modules/components/search-display";
import { loadTooptip } from "./modules/components/tooltip-loader";
import { back2top } from "./modules/components/back-to-top";
import { imgPopup } from "./modules/components/img-popup";
import { loadMermaid } from "./modules/components/mermaid";
import { loadChartJS } from "./modules/components/chartjs";
import { initToc } from "./modules/components/toc";
import { loadImg } from "./modules/components/img-loading";
import { initClipboard } from "./modules/components/clipboard";
import { initLocaleDatetime } from "./modules/components/locale-datetime";

// Expose functions to window
window.basic = basic;
window.initTopbar = initTopbar;
window.modeWatcher = modeWatcher;
window.displaySearch = displaySearch;
window.loadTooptip = loadTooptip;
window.back2top = back2top;
window.imgPopup = imgPopup;
window.loadMermaid = loadMermaid;
window.loadChartJS = loadChartJS;
window.initToc = initToc;
window.loadImg = loadImg;
window.initClipboard = initClipboard;
window.initLocaleDatetime = initLocaleDatetime;

// Initialize InstantView handler when the DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  new InstantViewHandler();
});

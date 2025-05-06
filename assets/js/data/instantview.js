/**
 * InstantView - Make your website faster by preloading pages on hover
 * Converted from minified version to full readable code
 * by Steve Hoang - stevehoang.com
 * Version 0.1.0 - May 5, 2025
 */
var InstantView = function(document, location) {
  // Browser detection and state variables
  var userAgent = navigator.userAgent;
  var isTouchDevice = "createTouch" in document;
  var currentLocationWithoutHash;
  var preloadingHref;
  var preloadingTimer;
  var pageCache = {};
  var xhr;
  var urlToPreload = false;
  var lastTouchTimestamp = false;
  var isPreloadingBroken = false;
  var isPreloadingFinished = false;
  var timingData = {};
  var isPreloading = false;
  var isWaitingForCompletion = false;
  var trackedAssets = [];
  var isWhitelistMode;
  var isMousedownTrigger;
  var delayBeforePreload;
  
  var eventListeners = {
	fetch: [],
	receive: [],
	wait: [],
	change: []
  };
  
  // Script execution tracking
  var processedScripts = {};
  var scriptExecutionQueue = [];
  var isProcessingScripts = false;
  
  // Script execution context management
  var scriptContexts = {};
  var scriptDependencies = {};
  var globalVariableRegistry = {};
  
  /**
   * Removes the hash part of a URL
   * @param {string} url - The URL to process
   * @return {string} URL without hash
   */
  function removeHash(url) {
	var hashIndex = url.indexOf('#');
	if (hashIndex < 0) {
	  return url;
	}
	return url.substr(0, hashIndex);
  }

  /**
   * Find the closest parent anchor element
   * @param {HTMLElement} element - The starting element
   * @return {HTMLElement} The parent anchor element
   */
  function findAnchorElement(element) {
	if (!element) return null;
	
	while (element && element.nodeName != "A") {
	  element = element.parentNode;
	  if (!element) return null;
	}
	return element;
  }

  /**
   * Check if instant is disabled for an element
   * @param {HTMLElement} element - The element to check
   * @return {boolean} True if instant is disabled
   */
  function isInstantDisabled(element) {
	if (!element) return true;
	
	do {
	  if (!element.hasAttribute) {
		break;
	  }
	  if (element.hasAttribute("data-instant")) {
		return false;
	  }
	  if (element.hasAttribute("data-no-instant")) {
		return true;
	  }
	} while (element = element.parentNode);
	return false;
  }

  /**
   * Check if instant is explicitly enabled for an element
   * @param {HTMLElement} element - The element to check
   * @return {boolean} True if instant is enabled
   */
  function isInstantEnabled(element) {
	if (!element) return false;
	
	do {
	  if (!element.hasAttribute) {
		break;
	  }
	  if (element.hasAttribute("data-no-instant")) {
		return false;
	  }
	  if (element.hasAttribute("data-instant")) {
		return true;
	  }
	} while (element = element.parentNode);
	return false;
  }

  /**
   * Trigger event listeners
   * @param {string} eventType - Type of event
   * @param {any} arg - Argument to pass to listeners
   */
  function triggerEvent(eventType, arg) {
	if (!eventListeners[eventType]) {
	  console.warn('InstantView: Unknown event type:', eventType);
	  return;
	}
	
	for (var i = 0; i < eventListeners[eventType].length; i++) {
	  eventListeners[eventType][i](arg);
	}
  }

  /**
   * Generate a hash for a string to use as script identifier
   * @param {string} str - String to hash
   * @return {string} Hash string
   */
  function generateScriptId(str) {
	if (!str) return 'empty';
	var hash = 0;
	for (var i = 0; i < str.length; i++) {
	  var char = str.charCodeAt(i);
	  hash = ((hash << 5) - hash) + char;
	  hash = hash & hash; // Convert to 32bit integer
	}
	return hash.toString(36);
  }

  /**
   * Create a sandboxed execution context for scripts
   * @param {string} scriptContent - The script content to execute
   * @param {string} scriptId - Unique identifier for the script
   */
  function createScriptSandbox(scriptContent, scriptId) {
	if (!scriptContent) return {};
	
	try {
	  // Create an isolated context for this script
	  var contextId = 'ctx_' + scriptId;
	  var sandbox = {};
	  
	  // Create proxy traps to catch variable declarations
	  return new Proxy(sandbox, {
		set: function(target, prop, value) {
		  // Store in script-specific context
		  target[prop] = value;
		  
		  // Also expose to global scope if needed
		  if (!window[prop] || typeof window[prop] === 'undefined') {
			window[prop] = value;
		  }
		  
		  return true;
		},
		get: function(target, prop) {
		  // Try to get from context first
		  if (prop in target) {
			return target[prop];
		  }
		  
		  // Fall back to window
		  return window[prop];
		}
	  });
	} catch (e) {
	  console.error('InstantView: Failed to create script sandbox:', e);
	  return {};
	}
  }

  /**
   * Execute script content safely in a controlled context
   * @param {string} scriptContent - Script content to execute
   * @param {string} scriptId - Identifier for the script
   */
  function executeSandboxedScript(scriptContent, scriptId) {
	try {
	  // Create wrapper function to execute script in controlled scope
	  var sandbox = createScriptSandbox(scriptContent, scriptId);
	  
	  // Strip strict import statements that might cause issues
	  var safeContent = scriptContent
		.replace(/^\s*import\s+.*?from\s+['"].*?['"];?\s*$/gm, '// Import removed for compatibility')
		.replace(/^\s*export\s+.*?;?\s*$/gm, '// Export removed for compatibility');
	  
	  // Execute the script in a controlled environment
	  var scriptFunction = new Function('window', 'document', 'console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', safeContent);
	  
	  scriptFunction.call(sandbox, window, document, console, setTimeout, clearTimeout, setInterval, clearInterval);
	  
	  // Store context for potential reuse
	  scriptContexts[scriptId] = sandbox;
	  
	  return true;
	} catch (e) {
	  console.error('InstantView: Error executing script:', e.message);
	  return false;
	}
  }

  /**
   * Safely execute a script
   * @param {Element} scriptElement - Original script element
   * @param {Element} targetParent - Parent to insert new script into
   * @param {Element} nextSibling - Next sibling element for insertion position
   */
  function safeExecuteScript(scriptElement, targetParent, nextSibling) {
	if (!scriptElement || scriptElement.hasAttribute("data-no-instant")) {
	  return;
	}
	
	var scriptId;
	var scriptSrc = scriptElement.src || '';
	var scriptContent = scriptElement.innerHTML || '';
	var scriptType = scriptElement.type || '';
	
	// Skip non-javascript scripts
	if (scriptType && scriptType !== 'text/javascript' && scriptType !== 'application/javascript' && scriptType !== '') {
	  return;
	}
	
	// Generate a unique ID for this script
	if (scriptSrc) {
	  scriptId = scriptSrc;
	} else {
	  scriptId = generateScriptId(scriptContent);
	}
	
	// Skip if this exact script was already processed recently
	var currentTime = Date.now();
	if (processedScripts[scriptId] && (currentTime - processedScripts[scriptId]) < 5000) {
	  return;
	}
	
	// Mark as processed with timestamp
	processedScripts[scriptId] = currentTime;
	
	var newScript = document.createElement("script");
	newScript.setAttribute('data-instantview-processed', 'true');
	
	if (scriptSrc) {
	  // For external scripts, maintain the same attributes
	  newScript.src = scriptSrc;
	  
	  // Copy important attributes
	  Array.from(scriptElement.attributes).forEach(function(attr) {
		if (attr.name !== 'src' && attr.name !== 'type') {
		  newScript.setAttribute(attr.name, attr.value);
		}
	  });
	  
	  // Ensure the script loads properly with error handling
	  newScript.onerror = function(e) {
		console.error('InstantView: Failed to load script:', scriptSrc);
	  };
	} else if (scriptContent) {
	  // For inline scripts, execute in controlled environment first
	  try {
		var success = executeSandboxedScript(scriptContent, scriptId);
		if (!success) {
		  // Fallback to direct execution if sandboxing fails
		  newScript.innerHTML = scriptContent;
		} else {
		  // If successfully executed in sandbox, we can skip DOM insertion
		  return;
		}
	  } catch (e) {
		console.error('InstantView: Error sandboxing script:', e);
		newScript.innerHTML = scriptContent;
	  }
	}
	
	// Insert the script into DOM
	if (nextSibling) {
	  targetParent.insertBefore(newScript, nextSibling);
	} else {
	  targetParent.appendChild(newScript);
	}
  }

  /**
   * Change the current page
   * @param {string} title - New page title
   * @param {Element} body - New page body
   * @param {string} url - New URL
   * @param {number} scrollY - Scroll position
   */
  function changePage(title, body, url, scrollY) {
	document.title = title;
	
	if (body && document.documentElement) {
	  document.documentElement.replaceChild(body, document.body);
	} else {
	  console.error('InstantView: Cannot replace document body');
	  return;
	}
	
	if (url) {
	  history.pushState(null, null, url);
	  var hashIndex = url.indexOf('#');
	  var hashElement = hashIndex > -1 && document.getElementById(url.substr(hashIndex + 1));
	  var scrollPosition = 0;
	  
	  if (hashElement) {
		while (hashElement.offsetParent) {
		  scrollPosition += hashElement.offsetTop;
		  hashElement = hashElement.offsetParent;
		}
	  }
	  
	  scrollTo(0, scrollPosition);
	  currentLocationWithoutHash = removeHash(url);
	} else {
	  scrollTo(0, scrollY);
	}
	
	// Reset script contexts to clean slate before setting up new page
	scriptContexts = {};
	
	setupLinkHovers();
	triggerEvent("change", false);
  }

  /**
   * Reset preloading state
   */
  function resetPreloading() {
	isPreloading = false;
	isWaitingForCompletion = false;
  }

  /**
   * Handle mousedown on a link
   * @param {Event} event - Mouse event
   */
  function mousedownHandler(event) {
	var anchor = findAnchorElement(event.target);
	if (!anchor) return;
	preload(anchor.href);
  }

  /**
   * Handle mouseover on a link
   * @param {Event} event - Mouse event
   */
  function mouseoverHandler(event) {
	var anchor = findAnchorElement(event.target);
	if (!anchor) return;
	
	anchor.addEventListener("mouseout", mouseoutHandler);
	
	if (!delayBeforePreload) {
	  preload(anchor.href);
	} else {
	  preloadingHref = anchor.href;
	  preloadingTimer = setTimeout(preload, delayBeforePreload);
	}
  }

  /**
   * Handle touchstart on a link
   * @param {Event} event - Touch event
   */
  function touchstartHandler(event) {
	var anchor = findAnchorElement(event.target);
	if (!anchor) return;
	
	if (isMousedownTrigger) {
	  anchor.removeEventListener("mousedown", mousedownHandler);
	} else {
	  anchor.removeEventListener("mouseover", mouseoverHandler);
	}
	
	preload(anchor.href);
  }

  /**
   * Handle click on a link
   * @param {Event} event - Click event
   */
  function clickHandler(event) {
	// Ignore if not left click or if modifier keys are pressed
	if (event.which > 1 || event.metaKey || event.ctrlKey) {
	  return;
	}
	
	event.preventDefault();
	var anchor = findAnchorElement(event.target);
	if (!anchor) return;
	display(anchor.href);
  }

  /**
   * Handle mouseout on a link
   */
  function mouseoutHandler() {
	if (preloadingTimer) {
	  clearTimeout(preloadingTimer);
	  preloadingTimer = false;
	  return;
	}
	
	if (!isPreloading || isWaitingForCompletion) {
	  return;
	}
	
	xhr.abort();
	resetPreloading();
  }

  /**
   * Handle XHR readystatechange
   */
  function readystatechangeHandler() {
	if (xhr.readyState < 4) {
	  return;
	}
	
	if (xhr.status == 0) {
	  return;
	}
	
	timingData.ready = +new Date - timingData.start;
	triggerEvent("receive");
	
	var contentType = xhr.getResponseHeader("Content-Type");
	if (contentType && contentType.match(/\/(x|ht|xht)ml/)) {
	  var doc = document.implementation.createHTMLDocument("");
	  doc.documentElement.innerHTML = xhr.responseText;
	  lastTouchTimestamp = doc.title;
	  isPreloadingFinished = doc.body;
	  
	  var urlWithoutHash = removeHash(urlToPreload);
	  pageCache[urlWithoutHash] = {
		body: isPreloadingFinished,
		title: lastTouchTimestamp,
		scrollY: urlWithoutHash in pageCache ? pageCache[urlWithoutHash].scrollY : 0
	  };
	  
	  var headChildren = doc.head.children;
	  var trackedAssetCount = 0;
	  var currentElem;
	  var assetValue;
	  
	  for (var i = headChildren.length - 1; i >= 0; i--) {
		currentElem = headChildren[i];
		if (currentElem.hasAttribute("data-instant-track")) {
		  assetValue = currentElem.getAttribute("href") || 
					  currentElem.getAttribute("src") || 
					  currentElem.innerHTML;
		  
		  for (var j = trackedAssets.length - 1; j >= 0; j--) {
			if (trackedAssets[j] == assetValue) {
			  trackedAssetCount++;
			}
		  }
		}
	  }
	  
	  if (trackedAssetCount != trackedAssets.length) {
		isPreloadingBroken = true;
	  }
	} else {
	  isPreloadingBroken = true;
	}
	
	if (isWaitingForCompletion) {
	  isWaitingForCompletion = false;
	  display(urlToPreload);
	}
  }

  /**
   * Process a batch of scripts asynchronously
   * @param {NodeList} scripts - Script elements to process
   * @param {number} startIndex - Starting index for processing
   */
  function processScriptBatch(scripts, startIndex) {
	if (isProcessingScripts) {
	  // Queue this batch for later
	  scriptExecutionQueue.push({
		scripts: scripts,
		startIndex: startIndex
	  });
	  return;
	}
	
	isProcessingScripts = true;
	var batchSize = 3; // Process fewer scripts at once for smoother experience
	var endIndex = Math.min(startIndex + batchSize, scripts.length);
	
	try {
	  for (var i = startIndex; i < endIndex; i++) {
		var scriptElement = scripts[i];
		if (scriptElement && !scriptElement.hasAttribute("data-instantview-processed")) {
		  // Create a copy of the script to avoid direct reference issues
		  var parentNode = scriptElement.parentNode;
		  if (!parentNode) continue;
		  
		  safeExecuteScript(scriptElement, parentNode, scriptElement.nextSibling);
		}
	  }
	} catch (e) {
	  console.error('InstantView: Error in script batch processing:', e);
	}
	
	// Process next batch if there are more scripts
	if (endIndex < scripts.length) {
	  setTimeout(function() {
		isProcessingScripts = false;
		processScriptBatch(scripts, endIndex);
	  }, 30); // Longer delay between batches for UI responsiveness
	} else {
	  // Process any queued script batches
	  setTimeout(function() {
		isProcessingScripts = false;
		if (scriptExecutionQueue.length > 0) {
		  var next = scriptExecutionQueue.shift();
		  processScriptBatch(next.scripts, next.startIndex);
		}
	  }, 50);
	}
  }

  /**
   * Set up link hover handlers
   * @param {boolean} isFirstRun - Whether this is the first run
   */
  function setupLinkHovers(isFirstRun) {
	var links = document.getElementsByTagName("a");
	var linkElement;
	var urlBase = location.protocol + "//" + location.host;
	
	for (var i = links.length - 1; i >= 0; i--) {
	  linkElement = links[i];
	  
	  if (linkElement.target || 
		  linkElement.hasAttribute("download") || 
		  linkElement.href.indexOf(urlBase + "/") != 0 || 
		  (linkElement.href.indexOf('#') > -1 && removeHash(linkElement.href) == currentLocationWithoutHash) || 
		  (isWhitelistMode ? !isInstantEnabled(linkElement) : isInstantDisabled(linkElement))) {
		continue;
	  }
	  
	  linkElement.addEventListener("touchstart", touchstartHandler);
	  
	  if (isMousedownTrigger) {
		linkElement.addEventListener("mousedown", mousedownHandler);
	  } else {
		linkElement.addEventListener("mouseover", mouseoverHandler);
	  }
	  
	  linkElement.addEventListener("click", clickHandler);
	}
	
	if (!isFirstRun) {
	  // Clean up script registry periodically to prevent memory leaks
	  if (Object.keys(processedScripts).length > 100) {
		processedScripts = {}; // Reset if too many entries
	  }
	  
	  // First, extract all scripts in the correct order
	  var scripts = document.body.getElementsByTagName("script");
	  var scriptArray = Array.from(scripts);
	  
	  // Sort scripts by their position in the DOM for proper execution order
	  scriptArray.sort(function(a, b) {
		// This is a simple approach - might need refinement for complex dependencies
		var aParent = a.parentNode;
		var bParent = b.parentNode;
		
		if (aParent === bParent) {
		  return Array.from(aParent.children).indexOf(a) - 
				 Array.from(bParent.children).indexOf(b);
		}
		
		return 0; // Default to document order if different parents
	  });
	  
	  // Begin processing scripts in batches
	  setTimeout(function() {
		processScriptBatch(scriptArray, 0);
	  }, 50); // Give the page a moment to stabilize first
	}
  }

  /**
   * Start preloading a URL
   * @param {string} [url] - URL to preload, defaults to preloadingHref
   */
  function preload(url) {
	if (!isMousedownTrigger && 
		"display" in timingData && 
		+new Date - (timingData.start + timingData.display) < 100) {
	  return;
	}
	
	if (preloadingTimer) {
	  clearTimeout(preloadingTimer);
	  preloadingTimer = false;
	}
	
	if (!url) {
	  url = preloadingHref;
	}
	
	if (isPreloading && (url == urlToPreload || isWaitingForCompletion)) {
	  return;
	}
	
	isPreloading = true;
	isWaitingForCompletion = false;
	
	urlToPreload = url;
	isPreloadingFinished = false;
	isPreloadingBroken = false;
	timingData = {
	  start: +new Date
	};
	
	triggerEvent("fetch");
	
	try {
	  xhr.open("GET", url);
	  xhr.send();
	} catch (e) {
	  console.error("InstantView: XHR error", e);
	  isPreloadingBroken = true;
	  resetPreloading();
	}
  }

  /**
   * Display a URL
   * @param {string} url - URL to display
   */
  function display(url) {
	if (!("display" in timingData)) {
	  timingData.display = +new Date - timingData.start;
	}
	
	if (preloadingTimer) {
	  if (urlToPreload && urlToPreload != url) {
		location.href = url;
		return;
	  }
	  
	  preload(url);
	  triggerEvent("wait");
	  isWaitingForCompletion = true;
	  return;
	}
	
	if (!isPreloading || isWaitingForCompletion) {
	  location.href = url;
	  return;
	}
	
	if (isPreloadingBroken) {
	  location.href = urlToPreload;
	  return;
	}
	
	if (!isPreloadingFinished) {
	  triggerEvent("wait");
	  isWaitingForCompletion = true;
	  return;
	}
	
	if (currentLocationWithoutHash && pageCache[currentLocationWithoutHash]) {
	  pageCache[currentLocationWithoutHash].scrollY = pageYOffset;
	}
	
	// Clean up execution context before page transition
	resetPreloading();
	scriptExecutionQueue = []; // Clear pending script operations
	isProcessingScripts = false;
	
	// Reset script contexts for clean page transition
	scriptContexts = {};
	
	// Preserve any global objects that might be needed
	var globalSnapshot = {};
	try {
	  // Snapshot important globals that might be needed by other scripts
	  Object.keys(window).forEach(function(key) {
		// Skip built-in properties and functions
		if (typeof window[key] === 'function' || key.startsWith('_')) return;
		
		// Capture value
		globalSnapshot[key] = window[key];
	  });
	} catch (e) {
	  console.warn('InstantView: Error creating global snapshot:', e);
	}
	
	changePage(lastTouchTimestamp, isPreloadingFinished, urlToPreload);
	
	// Restore important globals after page change
	try {
	  Object.keys(globalSnapshot).forEach(function(key) {
		// Only restore if the variable is now undefined
		if (typeof window[key] === 'undefined') {
		  window[key] = globalSnapshot[key];
		}
	  });
	} catch (e) {
	  console.warn('InstantView: Error restoring global snapshot:', e);
	}
  }

  // Simplified placeholder for the loading indicator (removed)
  var loadingIndicator = {
	init: function() {},
	start: function() {},
	done: function() {}
  };

  // Check if browser supports pushState
  var isSupported = "pushState" in history && 
				   (!userAgent.match("Android") || userAgent.match("Chrome/")) && 
				   location.protocol != "file:";

  /**
   * Initialize InstantView
   */
  function init() {
	if (currentLocationWithoutHash) {
	  return;
	}
	
	if (!isSupported) {
	  triggerEvent("change", true);
	  return;
	}
	
	// Process arguments to init()
	for (var i = arguments.length - 1; i >= 0; i--) {
	  var arg = arguments[i];
	  
	  if (arg === true) {
		isWhitelistMode = true;
	  } else if (arg == "mousedown") {
		isMousedownTrigger = true;
	  } else if (typeof arg == "number") {
		delayBeforePreload = arg;
	  }
	}
	
	currentLocationWithoutHash = removeHash(location.href);
	pageCache[currentLocationWithoutHash] = {
	  body: document.body,
	  title: document.title,
	  scrollY: pageYOffset
	};
	
	// Track resource versions for cache invalidation
	var headChildren = document.head.children;
	var assetValue;
	
	for (var i = headChildren.length - 1; i >= 0; i--) {
	  var elem = headChildren[i];
	  
	  if (elem.hasAttribute("data-instant-track")) {
		assetValue = elem.getAttribute("href") || 
				   elem.getAttribute("src") || 
				   elem.innerHTML;
		trackedAssets.push(assetValue);
	  }
	}
	
	xhr = new XMLHttpRequest();
	xhr.addEventListener("readystatechange", readystatechangeHandler);
	
	setupLinkHovers(true);
	loadingIndicator.init(); // Still called but doesn't do anything
	
	triggerEvent("change", true);
	
	addEventListener("popstate", function() {
	  var url = removeHash(location.href);
	  
	  if (url == currentLocationWithoutHash) {
		return;
	  }
	  
	  if (!(url in pageCache)) {
		location.href = location.href;
		return;
	  }
	  
	  pageCache[currentLocationWithoutHash].scrollY = pageYOffset;
	  currentLocationWithoutHash = url;
	  changePage(pageCache[url].title, pageCache[url].body, false, pageCache[url].scrollY);
	});
	
	// Create global namespace for InstantView internal use
	window._instantViewInternal = {
	  scriptContexts: scriptContexts,
	  processedScripts: processedScripts
	};
  }

  /**
   * Add event listener
   * @param {string} eventType - Type of event
   * @param {Function} callback - Event callback
   */
  function addEventListeners(eventType, callback) {
	if (!eventListeners[eventType]) {
	  eventListeners[eventType] = [];
	}
	eventListeners[eventType].push(callback);
  }

  // Public API
  return {
	supported: isSupported,
	init: init,
	on: addEventListeners
  };
}(document, location);
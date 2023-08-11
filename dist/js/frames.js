(() => {
  // src/js/modules/oculus.ts
  var callback = (entries, observer) => {
    let order = 0;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.willChange = "opacity";
        entry.target.style.transitionDelay = order * 50 + "ms";
        entry.target.classList.add("wp-block-shown-on-screen");
        observer.unobserve(entry.target);
        order++;
      }
    });
  };
  var oculus = (selector = ".wp-block-template-part, .wp-block-cover__inner-container > *, .wp-block-column > *, .wp-block-group > *", options = {}) => {
    const templates = document.querySelectorAll(selector);
    if (templates.length > 0) {
      const myObserver = new IntersectionObserver(callback, options);
      templates.forEach((entries) => {
        myObserver.observe(entries);
      });
    }
  };
  var oculus_default = oculus;

  // src/js/modules/imageFade.ts
  var callback2 = (entries, observer) => {
    let order = 0;
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.willChange = "opacity";
        entry.target.style.transitionDelay = order * 50 + "ms";
        entry.target.classList.add("lazy-loaded");
        observer.unobserve(entry.target);
        order++;
      }
    });
  };
  var imageFade = (selector = ".wp-block-image img", options = {}) => {
    const templates = document.querySelectorAll(selector);
    if (templates.length > 0) {
      const myObserver = new IntersectionObserver(callback2, options);
      templates.forEach((entries) => {
        myObserver.observe(entries);
      });
    }
  };
  var imageFade_default = imageFade;

  // src/js/modules/scrollTracker.js
  var supportsPassive = false;
  try {
    let opts = Object.defineProperty({}, "passive", {
      get: function() {
        supportsPassive = true;
      }
    });
    window.addEventListener("testPassive", null, opts);
    window.removeEventListener("testPassive", null, opts);
  } catch (e) {
  }
  var requestFrame = window.requestAnimationFrame;
  var cancelFrame = window.cancelAnimationFrame;
  if (!requestFrame) {
    ["ms", "moz", "webkit", "o"].every(function(prefix) {
      requestFrame = window[prefix + "RequestAnimationFrame"];
      cancelFrame = window[prefix + "CancelAnimationFrame"] || window[prefix + "CancelRequestAnimationFrame"];
      return !requestFrame;
    });
  }
  var isSupported = !!requestFrame;
  var isListening = false;
  var isQueued = false;
  var isIdle = true;
  var scrollY = window.pageYOffset;
  var scrollX = window.pageXOffset;
  var scrollYCached = scrollY;
  var scrollXCached = scrollX;
  var directionX = ["x", "horizontal"];
  var directionAll = ["any"];
  var callbackQueue = {
    x: [],
    y: [],
    any: []
  };
  var detectIdleTimeout;
  var tickId;
  function handleScroll() {
    let isScrollChanged = false;
    if (callbackQueue.x.length || callbackQueue.any.length) {
      scrollX = window.scrollX;
    }
    if (callbackQueue.y.length || callbackQueue.any.length) {
      scrollY = window.scrollY;
    }
    if (scrollY !== scrollYCached) {
      callbackQueue.y.forEach(triggerCallback.y);
      scrollYCached = scrollY;
      isScrollChanged = true;
    }
    if (scrollX !== scrollXCached) {
      callbackQueue.x.forEach(triggerCallback.x);
      scrollXCached = scrollX;
      isScrollChanged = true;
    }
    if (isScrollChanged) {
      callbackQueue.any.forEach(triggerCallback.any);
      window.clearTimeout(detectIdleTimeout);
      detectIdleTimeout = null;
    }
    isQueued = false;
    requestTick();
  }
  function triggerCallback(callback3, scroll) {
    callback3(scroll);
  }
  triggerCallback.y = function(callback3) {
    triggerCallback(callback3, scrollY);
  };
  triggerCallback.x = function(callback3) {
    triggerCallback(callback3, scrollX);
  };
  triggerCallback.any = function(callback3) {
    triggerCallback(callback3, [scrollX, scrollY]);
  };
  function enableScrollListener() {
    if (isListening || isQueued) {
      return;
    }
    if (isIdle) {
      isListening = true;
      window.addEventListener(
        "scroll",
        onScrollDebouncer,
        supportsPassive ? { passive: true } : false
      );
      document.body.addEventListener(
        "touchmove",
        onScrollDebouncer,
        supportsPassive ? { passive: true } : false
      );
      return;
    }
    requestTick();
  }
  function disableScrollListener() {
    if (!isListening) {
      return;
    }
    window.removeEventListener("scroll", onScrollDebouncer);
    document.body.removeEventListener("touchmove", onScrollDebouncer);
    isListening = false;
  }
  function onScrollDebouncer() {
    isIdle = false;
    requestTick();
    disableScrollListener();
  }
  function requestTick() {
    if (isQueued) {
      return;
    }
    if (!detectIdleTimeout) {
      detectIdleTimeout = window.setTimeout(detectIdle, 200);
    }
    tickId = requestFrame(handleScroll);
    isQueued = true;
  }
  function cancelTick() {
    if (!isQueued) {
      return;
    }
    cancelFrame(tickId);
    isQueued = false;
  }
  function detectIdle() {
    isIdle = true;
    cancelTick();
    enableScrollListener();
  }
  function scrollTracker(direction, callback3) {
    if (!isSupported) {
      return;
    }
    enableScrollListener();
    if (typeof direction === "function") {
      callback3 = direction;
      callbackQueue.y.push(callback3);
      return;
    }
    if (typeof callback3 === "function") {
      if (~directionX.indexOf(direction)) {
        callbackQueue.x.push(callback3);
      } else if (~directionAll.indexOf(direction)) {
        callbackQueue.any.push(callback3);
      } else {
        callbackQueue.y.push(callback3);
      }
    }
  }
  scrollTracker.remove = function(direction, fn) {
    let queueKey = "y", queue, fnIdx;
    if (typeof direction === "string") {
      if (typeof fn !== "function") {
        return;
      }
      if (~directionX.indexOf(direction)) {
        queueKey = directionX[0];
      } else if (~directionAll.indexOf(direction)) {
        queueKey = directionAll[0];
      }
    } else {
      fn = direction;
    }
    queue = callbackQueue[queueKey];
    fnIdx = queue.indexOf(fn);
    if (fnIdx > -1) {
      queue.splice(fnIdx, 1);
    }
    if (!callbackQueue.x.length && !callbackQueue.y.length && !callbackQueue.any.length) {
      cancelTick();
      disableScrollListener();
    }
  };
  scrollTracker.off = scrollTracker.remove;
  var scrollTracker_default = scrollTracker;

  // src/js/frames.ts
  var appBootstrap = class {
    lastScrollTop = 0;
    delta = 0;
    header = null;
    bodyScrolled = () => {
      let { document: document2, scrollY: scrollY2 } = window, { documentElement } = document2;
      let scrolled = (scrollY2 || documentElement.scrollTop) - (documentElement.clientTop || 0);
      if (scrolled > 1) {
        documentElement.classList.add("scrolled");
      } else {
        documentElement.classList.remove("scrolled");
      }
      this.lastScrollTop = scrollY2;
    };
    colourise = () => {
      let { header } = this, { document: document2, scrollY: scrollY2 } = window, { documentElement } = document2;
      const max = 150;
      if (scrollY2 > max)
        return;
      let scrolled = (scrollY2 || documentElement.scrollTop) - (documentElement.clientTop || 0);
      const opacity = scrollY2 / max;
      if (header)
        header.style.backgroundColor = `rgba(0,0,0,${opacity.toFixed(2)})`;
    };
    constructor(header) {
      let { bodyScrolled, colourise } = this;
      oculus_default();
      imageFade_default();
      this.header = header;
      window.addEventListener("load", function() {
        document.documentElement.classList.add("wp-ready");
        window.addEventListener("scrollend", bodyScrolled);
        window.addEventListener("scroll", colourise);
      });
      scrollTracker_default("y", bodyScrolled);
    }
  };
  document.addEventListener("DOMContentLoaded", function() {
    const fixedHeader = document.querySelector(".is-fixed");
    const app = new appBootstrap(fixedHeader);
    app.bodyScrolled();
  });
})();
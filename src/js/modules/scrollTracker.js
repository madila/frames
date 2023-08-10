'use strict';

// Test via a getter in the options object to see if the passive property is accessed
let supportsPassive = false;
try {
    let opts = Object.defineProperty({}, 'passive', {
        get: function () {
            supportsPassive = true;
        },
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
} catch (e) {}
// Use our detect's results. passive applied if supported, capture will be false either way.

// Get proper requestAnimationFrame
let requestFrame = window.requestAnimationFrame,
    cancelFrame = window.cancelAnimationFrame;

if (!requestFrame) {
    ['ms', 'moz', 'webkit', 'o'].every(function (prefix) {
        requestFrame = window[prefix + 'RequestAnimationFrame'];
        cancelFrame =
            window[prefix + 'CancelAnimationFrame'] ||
            window[prefix + 'CancelRequestAnimationFrame'];
        // Continue iterating only if requestFrame is still false
        return !requestFrame;
    });
}

// Module state
let isSupported = !!requestFrame,
    isListening = false,
    isQueued = false,
    isIdle = true,
    scrollY = window.pageYOffset,
    scrollX = window.pageXOffset,
    scrollYCached = scrollY,
    scrollXCached = scrollX,
    directionX = ['x', 'horizontal'],
    directionAll = ['any'],
    callbackQueue = {
        x: [],
        y: [],
        any: [],
    },
    detectIdleTimeout,
    tickId;

// Main scroll handler
// -------------------
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

// Utilities
// ---------
function triggerCallback(callback, scroll) {
    callback(scroll);
}
triggerCallback.y = function (callback) {
    triggerCallback(callback, scrollY);
};
triggerCallback.x = function (callback) {
    triggerCallback(callback, scrollX);
};
triggerCallback.any = function (callback) {
    triggerCallback(callback, [scrollX, scrollY]);
};

function enableScrollListener() {
    if (isListening || isQueued) {
        return;
    }
    if (isIdle) {
        isListening = true;
        window.addEventListener(
            'scroll',
            onScrollDebouncer,
            supportsPassive ? { passive: true } : false
        );
        document.body.addEventListener(
            'touchmove',
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
    window.removeEventListener('scroll', onScrollDebouncer);
    document.body.removeEventListener('touchmove', onScrollDebouncer);
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
        // Idle is defined as 1.5 seconds without scroll change
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

/**
 * Attach callback to debounced scroll event
 *
 * Takes two forms:
 * @param callback function  Function to attach to a vertical scroll event
 * Or:
 * @param direction string   Direction of scroll to attach to:
 *                 'horizontal'/'x', 'vertical'/'y' (the default),
 *                 or 'any' (listens to both)
 * @param callback function  Function to attach to a scroll event in specified direction
 */
function scrollTracker(direction, callback) {
    if (!isSupported) {
        return;
    }
    enableScrollListener();
    // Verify parameters
    if (typeof direction === 'function') {
        callback = direction;
        callbackQueue.y.push(callback);
        return;
    }
    if (typeof callback === 'function') {
        if (~directionX.indexOf(direction)) {
            callbackQueue.x.push(callback);
        } else if (~directionAll.indexOf(direction)) {
            callbackQueue.any.push(callback);
        } else {
            callbackQueue.y.push(callback);
        }
    }
}

scrollTracker.remove = function (direction, fn) {
    let queueKey = 'y',
        queue,
        fnIdx;

    if (typeof direction === 'string') {
        // If second parameter is not a function, return
        if (typeof fn !== 'function') {
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
    // If there's no listeners left, disable listening
    if (
        !callbackQueue.x.length &&
        !callbackQueue.y.length &&
        !callbackQueue.any.length
    ) {
        cancelTick();
        disableScrollListener();
    }
};
scrollTracker.off = scrollTracker.remove;

export default scrollTracker;

var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});
var _classList, _disableAutoFetchTimeout, _percent, _style, _visible, _state, _updateMatchesCountOnProgress, _visitedPagesCount, _PDFFindController_instances, onFind_fn, reset_fn, query_get, shouldDirtyMatch_fn, isEntireWord_fn, calculateRegExpMatch_fn, convertToRegExpString_fn, calculateMatch_fn, extractText_fn, updatePage_fn, updateAllPages_fn, nextMatch_fn, matchesReady_fn, nextPageMatch_fn, advanceOffsetPage_fn, updateMatch_fn, onFindBarClose_fn, requestMatchesCount_fn, updateUIResultsCount_fn, updateUIState_fn, _PDFLinkService_static, isValidExplicitDest_fn, _onAppend, _eventAbortController, _AnnotationLayerBuilder_instances, updatePresentationModeState_fn, _openBlobUrls, _listeners, _dir, _elements, _lang, _l10n, _L10n_static, fixupLangCode_fn, isRTL_fn, _genericl10n_GenericL10n_static, generateBundles_fn, createBundle_fn, getPaths_fn, generateBundlesFallback_fn, createBundleFallback_fn, _eventAbortController2, _PDFHistory_instances, pushOrReplaceState_fn, tryPushCurrentPosition_fn, isValidPage_fn, isValidState_fn, updateInternalState_fn, parseCurrentHash_fn, updateViewarea_fn, popState_fn, pageHide_fn, bindEvents_fn, unbindEvents_fn, _annotationLayer, _drawLayer, _onAppend2, _textLayer, _uiManager, _drawLayer2, _treeDom, _StructTreeLayerBuilder_instances, setAttributes_fn, walk_fn, _enabled, _textChildren, _textNodes, _waitingElements, _TextAccessibilityManager_static, compareElementPositions_fn, _TextAccessibilityManager_instances, addIdToAriaOwns_fn, _eventAbortController3, _enablePermissions, _onAppend3, _renderingDone, _textLayer2, _textLayers, _selectionChangeAbortController, _TextLayerBuilder_instances, bindMouse_fn, _TextLayerBuilder_static, removeGlobalSelectionListener_fn, enableGlobalSelectionListener_fn, _annotationMode, _enableHWA, _hasRestrictedScaling, _layerProperties, _loadingId, _previousRotation, _renderError, _renderingState, _textLayerMode, _useThumbnailCanvas, _viewportMap, _layers, _PDFPageView_instances, addLayer_fn, setDimensions_fn, dispatchLayerRendered_fn, renderAnnotationLayer_fn, renderAnnotationEditorLayer_fn, renderDrawLayer_fn, renderXfaLayer_fn, renderTextLayer_fn, renderStructTreeLayer_fn, buildXfaTextContentItems_fn, finishRenderTask_fn, _closeCapability, _destroyCapability, _docProperties, _eventAbortController4, _eventBus, _externalServices, _pdfDocument, _pdfViewer, _ready, _scripting, _willPrintCapability, _PDFScriptingManager_instances, updateFromSandbox_fn, dispatchPageOpen_fn, dispatchPageClose_fn, initScripting_fn, destroyScripting_fn, _buf, _size, _PDFPageViewBuffer_instances, destroyFirstView_fn, _buffer, _altTextManager, _annotationEditorHighlightColors, _annotationEditorMode, _annotationEditorUIManager, _annotationMode2, _containerTopLeft, _enableHWA2, _enableHighlightFloatingButton, _enablePermissions2, _eventAbortController5, _mlManager, _getAllTextInProgress, _hiddenCopyElement, _interruptCopyCondition, _previousContainerHeight, _resizeObserver, _scrollModePageState, _scaleTimeoutId, _textLayerMode2, _PDFViewer_instances, initializePermissions_fn, onePageRenderedOrForceFetch_fn, copyCallback_fn, ensurePageViewVisible_fn, scrollIntoView_fn, isSameScale_fn, setScaleUpdatePages_fn, pageWidthScaleFactor_get, setScale_fn, resetCurrentPageView_fn, ensurePdfPageLoaded_fn, getScrollAhead_fn, updateContainerHeightCss_fn, resizeObserverCallback_fn;
var __webpack_require__ = {};
(() => {
  __webpack_require__.d = (exports, definition) => {
    for (var key in definition) {
      if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
      }
    }
  };
})();
(() => {
  __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
})();
var __webpack_exports__ = globalThis.pdfjsViewer = {};
__webpack_require__.d(__webpack_exports__, {
  AnnotationLayerBuilder: () => (
    /* reexport */
    AnnotationLayerBuilder
  ),
  DownloadManager: () => (
    /* reexport */
    DownloadManager
  ),
  EventBus: () => (
    /* reexport */
    EventBus
  ),
  FindState: () => (
    /* reexport */
    FindState
  ),
  GenericL10n: () => (
    /* reexport */
    genericl10n_GenericL10n
  ),
  LinkTarget: () => (
    /* reexport */
    LinkTarget
  ),
  PDFFindController: () => (
    /* reexport */
    PDFFindController
  ),
  PDFHistory: () => (
    /* reexport */
    PDFHistory
  ),
  PDFLinkService: () => (
    /* reexport */
    PDFLinkService
  ),
  PDFPageView: () => (
    /* reexport */
    PDFPageView
  ),
  PDFScriptingManager: () => (
    /* reexport */
    PDFScriptingManagerComponents
  ),
  PDFSinglePageViewer: () => (
    /* reexport */
    PDFSinglePageViewer
  ),
  PDFViewer: () => (
    /* reexport */
    PDFViewer
  ),
  ProgressBar: () => (
    /* reexport */
    ProgressBar
  ),
  RenderingStates: () => (
    /* reexport */
    RenderingStates
  ),
  ScrollMode: () => (
    /* reexport */
    ScrollMode
  ),
  SimpleLinkService: () => (
    /* reexport */
    SimpleLinkService
  ),
  SpreadMode: () => (
    /* reexport */
    SpreadMode
  ),
  StructTreeLayerBuilder: () => (
    /* reexport */
    StructTreeLayerBuilder
  ),
  TextLayerBuilder: () => (
    /* reexport */
    TextLayerBuilder
  ),
  XfaLayerBuilder: () => (
    /* reexport */
    XfaLayerBuilder
  ),
  parseQueryString: () => (
    /* reexport */
    parseQueryString
  )
});
const DEFAULT_SCALE_VALUE = "auto";
const DEFAULT_SCALE = 1;
const DEFAULT_SCALE_DELTA = 1.1;
const MIN_SCALE = 0.1;
const MAX_SCALE = 10;
const UNKNOWN_SCALE = 0;
const MAX_AUTO_SCALE = 1.25;
const SCROLLBAR_PADDING = 40;
const VERTICAL_PADDING = 5;
const RenderingStates = {
  INITIAL: 0,
  RUNNING: 1,
  PAUSED: 2,
  FINISHED: 3
};
const PresentationModeState = {
  UNKNOWN: 0,
  NORMAL: 1,
  CHANGING: 2,
  FULLSCREEN: 3
};
const TextLayerMode = {
  DISABLE: 0,
  ENABLE: 1,
  ENABLE_PERMISSIONS: 2
};
const ScrollMode = {
  UNKNOWN: -1,
  VERTICAL: 0,
  HORIZONTAL: 1,
  WRAPPED: 2,
  PAGE: 3
};
const SpreadMode = {
  UNKNOWN: -1,
  NONE: 0,
  ODD: 1,
  EVEN: 2
};
class OutputScale {
  constructor() {
    const pixelRatio = window.devicePixelRatio || 1;
    this.sx = pixelRatio;
    this.sy = pixelRatio;
  }
  get scaled() {
    return this.sx !== 1 || this.sy !== 1;
  }
}
function scrollIntoView(element, spot, scrollMatches = false) {
  let parent = element.offsetParent;
  if (!parent) {
    console.error("offsetParent is not set -- cannot scroll");
    return;
  }
  let offsetY = element.offsetTop + element.clientTop;
  let offsetX = element.offsetLeft + element.clientLeft;
  while (parent.clientHeight === parent.scrollHeight && parent.clientWidth === parent.scrollWidth || scrollMatches && (parent.classList.contains("markedContent") || getComputedStyle(parent).overflow === "hidden")) {
    offsetY += parent.offsetTop;
    offsetX += parent.offsetLeft;
    parent = parent.offsetParent;
    if (!parent) {
      return;
    }
  }
  if (spot) {
    if (spot.top !== void 0) {
      offsetY += spot.top;
    }
    if (spot.left !== void 0) {
      offsetX += spot.left;
      parent.scrollLeft = offsetX;
    }
  }
  parent.scrollTop = offsetY;
}
function watchScroll(viewAreaElement, callback, abortSignal = void 0) {
  const debounceScroll = function(evt) {
    if (rAF) {
      return;
    }
    rAF = window.requestAnimationFrame(function viewAreaElementScrolled() {
      rAF = null;
      const currentX = viewAreaElement.scrollLeft;
      const lastX = state.lastX;
      if (currentX !== lastX) {
        state.right = currentX > lastX;
      }
      state.lastX = currentX;
      const currentY = viewAreaElement.scrollTop;
      const lastY = state.lastY;
      if (currentY !== lastY) {
        state.down = currentY > lastY;
      }
      state.lastY = currentY;
      callback(state);
    });
  };
  const state = {
    right: true,
    down: true,
    lastX: viewAreaElement.scrollLeft,
    lastY: viewAreaElement.scrollTop,
    _eventHandler: debounceScroll
  };
  let rAF = null;
  viewAreaElement.addEventListener("scroll", debounceScroll, {
    useCapture: true,
    signal: abortSignal
  });
  abortSignal == null ? void 0 : abortSignal.addEventListener("abort", () => window.cancelAnimationFrame(rAF), {
    once: true
  });
  return state;
}
function parseQueryString(query) {
  const params = /* @__PURE__ */ new Map();
  for (const [key, value] of new URLSearchParams(query)) {
    params.set(key.toLowerCase(), value);
  }
  return params;
}
const InvisibleCharsRegExp = /[\x00-\x1F]/g;
function removeNullCharacters(str, replaceInvisible = false) {
  if (!InvisibleCharsRegExp.test(str)) {
    return str;
  }
  if (replaceInvisible) {
    return str.replaceAll(InvisibleCharsRegExp, (m) => m === "\0" ? "" : " ");
  }
  return str.replaceAll("\0", "");
}
function binarySearchFirstItem(items, condition, start = 0) {
  let minIndex = start;
  let maxIndex = items.length - 1;
  if (maxIndex < 0 || !condition(items[maxIndex])) {
    return items.length;
  }
  if (condition(items[minIndex])) {
    return minIndex;
  }
  while (minIndex < maxIndex) {
    const currentIndex = minIndex + maxIndex >> 1;
    const currentItem = items[currentIndex];
    if (condition(currentItem)) {
      maxIndex = currentIndex;
    } else {
      minIndex = currentIndex + 1;
    }
  }
  return minIndex;
}
function approximateFraction(x) {
  if (Math.floor(x) === x) {
    return [x, 1];
  }
  const xinv = 1 / x;
  const limit = 8;
  if (xinv > limit) {
    return [1, limit];
  } else if (Math.floor(xinv) === xinv) {
    return [1, xinv];
  }
  const x_ = x > 1 ? xinv : x;
  let a = 0, b = 1, c = 1, d = 1;
  while (true) {
    const p = a + c, q = b + d;
    if (q > limit) {
      break;
    }
    if (x_ <= p / q) {
      c = p;
      d = q;
    } else {
      a = p;
      b = q;
    }
  }
  let result;
  if (x_ - a / b < c / d - x_) {
    result = x_ === x ? [a, b] : [b, a];
  } else {
    result = x_ === x ? [c, d] : [d, c];
  }
  return result;
}
function floorToDivide(x, div) {
  return x - x % div;
}
function backtrackBeforeAllVisibleElements(index, views, top) {
  if (index < 2) {
    return index;
  }
  let elt = views[index].div;
  let pageTop = elt.offsetTop + elt.clientTop;
  if (pageTop >= top) {
    elt = views[index - 1].div;
    pageTop = elt.offsetTop + elt.clientTop;
  }
  for (let i = index - 2; i >= 0; --i) {
    elt = views[i].div;
    if (elt.offsetTop + elt.clientTop + elt.clientHeight <= pageTop) {
      break;
    }
    index = i;
  }
  return index;
}
function getVisibleElements({
  scrollEl,
  views,
  sortByVisibility = false,
  horizontal = false,
  rtl = false
}) {
  const top = scrollEl.scrollTop, bottom = top + scrollEl.clientHeight;
  const left = scrollEl.scrollLeft, right = left + scrollEl.clientWidth;
  function isElementBottomAfterViewTop(view) {
    const element = view.div;
    const elementBottom = element.offsetTop + element.clientTop + element.clientHeight;
    return elementBottom > top;
  }
  function isElementNextAfterViewHorizontally(view) {
    const element = view.div;
    const elementLeft = element.offsetLeft + element.clientLeft;
    const elementRight = elementLeft + element.clientWidth;
    return rtl ? elementLeft < right : elementRight > left;
  }
  const visible = [], ids = /* @__PURE__ */ new Set(), numViews = views.length;
  let firstVisibleElementInd = binarySearchFirstItem(views, horizontal ? isElementNextAfterViewHorizontally : isElementBottomAfterViewTop);
  if (firstVisibleElementInd > 0 && firstVisibleElementInd < numViews && !horizontal) {
    firstVisibleElementInd = backtrackBeforeAllVisibleElements(firstVisibleElementInd, views, top);
  }
  let lastEdge = horizontal ? right : -1;
  for (let i = firstVisibleElementInd; i < numViews; i++) {
    const view = views[i], element = view.div;
    const currentWidth = element.offsetLeft + element.clientLeft;
    const currentHeight = element.offsetTop + element.clientTop;
    const viewWidth = element.clientWidth, viewHeight = element.clientHeight;
    const viewRight = currentWidth + viewWidth;
    const viewBottom = currentHeight + viewHeight;
    if (lastEdge === -1) {
      if (viewBottom >= bottom) {
        lastEdge = viewBottom;
      }
    } else if ((horizontal ? currentWidth : currentHeight) > lastEdge) {
      break;
    }
    if (viewBottom <= top || currentHeight >= bottom || viewRight <= left || currentWidth >= right) {
      continue;
    }
    const hiddenHeight = Math.max(0, top - currentHeight) + Math.max(0, viewBottom - bottom);
    const hiddenWidth = Math.max(0, left - currentWidth) + Math.max(0, viewRight - right);
    const fractionHeight = (viewHeight - hiddenHeight) / viewHeight, fractionWidth = (viewWidth - hiddenWidth) / viewWidth;
    const percent = fractionHeight * fractionWidth * 100 | 0;
    visible.push({
      id: view.id,
      x: currentWidth,
      y: currentHeight,
      view,
      percent,
      widthPercent: fractionWidth * 100 | 0
    });
    ids.add(view.id);
  }
  const first = visible[0], last = visible.at(-1);
  if (sortByVisibility) {
    visible.sort(function(a, b) {
      const pc = a.percent - b.percent;
      if (Math.abs(pc) > 1e-3) {
        return -pc;
      }
      return a.id - b.id;
    });
  }
  return {
    first,
    last,
    views: visible,
    ids
  };
}
function isValidRotation(angle) {
  return Number.isInteger(angle) && angle % 90 === 0;
}
function isValidScrollMode(mode) {
  return Number.isInteger(mode) && Object.values(ScrollMode).includes(mode) && mode !== ScrollMode.UNKNOWN;
}
function isValidSpreadMode(mode) {
  return Number.isInteger(mode) && Object.values(SpreadMode).includes(mode) && mode !== SpreadMode.UNKNOWN;
}
function isPortraitOrientation(size) {
  return size.width <= size.height;
}
new Promise(function(resolve) {
  window.requestAnimationFrame(resolve);
});
const docStyle = document.documentElement.style;
function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}
class ProgressBar {
  constructor(bar) {
    __privateAdd(this, _classList, null);
    __privateAdd(this, _disableAutoFetchTimeout, null);
    __privateAdd(this, _percent, 0);
    __privateAdd(this, _style, null);
    __privateAdd(this, _visible, true);
    __privateSet(this, _classList, bar.classList);
    __privateSet(this, _style, bar.style);
  }
  get percent() {
    return __privateGet(this, _percent);
  }
  set percent(val) {
    __privateSet(this, _percent, clamp(val, 0, 100));
    if (isNaN(val)) {
      __privateGet(this, _classList).add("indeterminate");
      return;
    }
    __privateGet(this, _classList).remove("indeterminate");
    __privateGet(this, _style).setProperty("--progressBar-percent", `${__privateGet(this, _percent)}%`);
  }
  setWidth(viewer) {
    if (!viewer) {
      return;
    }
    const container = viewer.parentNode;
    const scrollbarWidth = container.offsetWidth - viewer.offsetWidth;
    if (scrollbarWidth > 0) {
      __privateGet(this, _style).setProperty("--progressBar-end-offset", `${scrollbarWidth}px`);
    }
  }
  setDisableAutoFetch(delay = 5e3) {
    if (isNaN(__privateGet(this, _percent))) {
      return;
    }
    if (__privateGet(this, _disableAutoFetchTimeout)) {
      clearTimeout(__privateGet(this, _disableAutoFetchTimeout));
    }
    this.show();
    __privateSet(this, _disableAutoFetchTimeout, setTimeout(() => {
      __privateSet(this, _disableAutoFetchTimeout, null);
      this.hide();
    }, delay));
  }
  hide() {
    if (!__privateGet(this, _visible)) {
      return;
    }
    __privateSet(this, _visible, false);
    __privateGet(this, _classList).add("hidden");
  }
  show() {
    if (__privateGet(this, _visible)) {
      return;
    }
    __privateSet(this, _visible, true);
    __privateGet(this, _classList).remove("hidden");
  }
}
_classList = new WeakMap();
_disableAutoFetchTimeout = new WeakMap();
_percent = new WeakMap();
_style = new WeakMap();
_visible = new WeakMap();
function apiPageLayoutToViewerModes(layout) {
  let scrollMode = ScrollMode.VERTICAL, spreadMode = SpreadMode.NONE;
  switch (layout) {
    case "SinglePage":
      scrollMode = ScrollMode.PAGE;
      break;
    case "OneColumn":
      break;
    case "TwoPageLeft":
      scrollMode = ScrollMode.PAGE;
    case "TwoColumnLeft":
      spreadMode = SpreadMode.ODD;
      break;
    case "TwoPageRight":
      scrollMode = ScrollMode.PAGE;
    case "TwoColumnRight":
      spreadMode = SpreadMode.EVEN;
      break;
  }
  return {
    scrollMode,
    spreadMode
  };
}
const CharacterType = {
  SPACE: 0,
  ALPHA_LETTER: 1,
  PUNCT: 2,
  HAN_LETTER: 3,
  KATAKANA_LETTER: 4,
  HIRAGANA_LETTER: 5,
  HALFWIDTH_KATAKANA_LETTER: 6,
  THAI_LETTER: 7
};
function isAlphabeticalScript(charCode) {
  return charCode < 11904;
}
function isAscii(charCode) {
  return (charCode & 65408) === 0;
}
function isAsciiAlpha(charCode) {
  return charCode >= 97 && charCode <= 122 || charCode >= 65 && charCode <= 90;
}
function isAsciiDigit(charCode) {
  return charCode >= 48 && charCode <= 57;
}
function isAsciiSpace(charCode) {
  return charCode === 32 || charCode === 9 || charCode === 13 || charCode === 10;
}
function isHan(charCode) {
  return charCode >= 13312 && charCode <= 40959 || charCode >= 63744 && charCode <= 64255;
}
function isKatakana(charCode) {
  return charCode >= 12448 && charCode <= 12543;
}
function isHiragana(charCode) {
  return charCode >= 12352 && charCode <= 12447;
}
function isHalfwidthKatakana(charCode) {
  return charCode >= 65376 && charCode <= 65439;
}
function isThai(charCode) {
  return (charCode & 65408) === 3584;
}
function getCharacterType(charCode) {
  if (isAlphabeticalScript(charCode)) {
    if (isAscii(charCode)) {
      if (isAsciiSpace(charCode)) {
        return CharacterType.SPACE;
      } else if (isAsciiAlpha(charCode) || isAsciiDigit(charCode) || charCode === 95) {
        return CharacterType.ALPHA_LETTER;
      }
      return CharacterType.PUNCT;
    } else if (isThai(charCode)) {
      return CharacterType.THAI_LETTER;
    } else if (charCode === 160) {
      return CharacterType.SPACE;
    }
    return CharacterType.ALPHA_LETTER;
  }
  if (isHan(charCode)) {
    return CharacterType.HAN_LETTER;
  } else if (isKatakana(charCode)) {
    return CharacterType.KATAKANA_LETTER;
  } else if (isHiragana(charCode)) {
    return CharacterType.HIRAGANA_LETTER;
  } else if (isHalfwidthKatakana(charCode)) {
    return CharacterType.HALFWIDTH_KATAKANA_LETTER;
  }
  return CharacterType.ALPHA_LETTER;
}
let NormalizeWithNFKC;
function getNormalizeWithNFKC() {
  NormalizeWithNFKC || (NormalizeWithNFKC = ` ¨ª¯²-µ¸-º¼-¾Ĳ-ĳĿ-ŀŉſǄ-ǌǱ-ǳʰ-ʸ˘-˝ˠ-ˤʹͺ;΄-΅·ϐ-ϖϰ-ϲϴ-ϵϹևٵ-ٸक़-य़ড়-ঢ়য়ਲ਼ਸ਼ਖ਼-ਜ਼ਫ਼ଡ଼-ଢ଼ำຳໜ-ໝ༌གྷཌྷདྷབྷཛྷཀྵჼᴬ-ᴮᴰ-ᴺᴼ-ᵍᵏ-ᵪᵸᶛ-ᶿẚ-ẛάέήίόύώΆ᾽-῁ΈΉ῍-῏ΐΊ῝-῟ΰΎ῭-`ΌΏ´-῾ - ‑‗․-… ″-‴‶-‷‼‾⁇-⁉⁗ ⁰-ⁱ⁴-₎ₐ-ₜ₨℀-℃℅-ℇ℉-ℓℕ-№ℙ-ℝ℠-™ℤΩℨK-ℭℯ-ℱℳ-ℹ℻-⅀ⅅ-ⅉ⅐-ⅿ↉∬-∭∯-∰〈-〉①-⓪⨌⩴-⩶⫝̸ⱼ-ⱽⵯ⺟⻳⼀-⿕　〶〸-〺゛-゜ゟヿㄱ-ㆎ㆒-㆟㈀-㈞㈠-㉇㉐-㉾㊀-㏿ꚜ-ꚝꝰꟲ-ꟴꟸ-ꟹꭜ-ꭟꭩ豈-嗀塚晴凞-羽蘒諸逸-都飯-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-זּטּ-לּמּנּ-סּףּ-פּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-﷼︐-︙︰-﹄﹇-﹒﹔-﹦﹨-﹫ﹰ-ﹲﹴﹶ-ﻼ！-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ￠-￦`);
  return NormalizeWithNFKC;
}
const FindState = {
  FOUND: 0,
  NOT_FOUND: 1,
  WRAPPED: 2,
  PENDING: 3
};
const FIND_TIMEOUT = 250;
const MATCH_SCROLL_OFFSET_TOP = -50;
const MATCH_SCROLL_OFFSET_LEFT = -400;
const CHARACTERS_TO_NORMALIZE = {
  "‐": "-",
  "‘": "'",
  "’": "'",
  "‚": "'",
  "‛": "'",
  "“": '"',
  "”": '"',
  "„": '"',
  "‟": '"',
  "¼": "1/4",
  "½": "1/2",
  "¾": "3/4"
};
const DIACRITICS_EXCEPTION = /* @__PURE__ */ new Set([12441, 12442, 2381, 2509, 2637, 2765, 2893, 3021, 3149, 3277, 3387, 3388, 3405, 3530, 3642, 3770, 3972, 4153, 4154, 5908, 5940, 6098, 6752, 6980, 7082, 7083, 7154, 7155, 11647, 43014, 43052, 43204, 43347, 43456, 43766, 44013, 3158, 3953, 3954, 3962, 3963, 3964, 3965, 3968, 3956]);
let DIACRITICS_EXCEPTION_STR;
const DIACRITICS_REG_EXP = new RegExp("\\p{M}+", "gu");
const SPECIAL_CHARS_REG_EXP = new RegExp("([.*+?^${}()|[\\]\\\\])|(\\p{P})|(\\s+)|(\\p{M})|(\\p{L})", "gu");
const NOT_DIACRITIC_FROM_END_REG_EXP = new RegExp("([^\\p{M}])\\p{M}*$", "u");
const NOT_DIACRITIC_FROM_START_REG_EXP = new RegExp("^\\p{M}*([^\\p{M}])", "u");
const SYLLABLES_REG_EXP = /[\uAC00-\uD7AF\uFA6C\uFACF-\uFAD1\uFAD5-\uFAD7]+/g;
const SYLLABLES_LENGTHS = /* @__PURE__ */ new Map();
const FIRST_CHAR_SYLLABLES_REG_EXP = "[\\u1100-\\u1112\\ud7a4-\\ud7af\\ud84a\\ud84c\\ud850\\ud854\\ud857\\ud85f]";
const NFKC_CHARS_TO_NORMALIZE = /* @__PURE__ */ new Map();
let noSyllablesRegExp = null;
let withSyllablesRegExp = null;
function normalize(text) {
  const syllablePositions = [];
  let m;
  while ((m = SYLLABLES_REG_EXP.exec(text)) !== null) {
    let {
      index
    } = m;
    for (const char of m[0]) {
      let len = SYLLABLES_LENGTHS.get(char);
      if (!len) {
        len = char.normalize("NFD").length;
        SYLLABLES_LENGTHS.set(char, len);
      }
      syllablePositions.push([len, index++]);
    }
  }
  let normalizationRegex;
  if (syllablePositions.length === 0 && noSyllablesRegExp) {
    normalizationRegex = noSyllablesRegExp;
  } else if (syllablePositions.length > 0 && withSyllablesRegExp) {
    normalizationRegex = withSyllablesRegExp;
  } else {
    const replace = Object.keys(CHARACTERS_TO_NORMALIZE).join("");
    const toNormalizeWithNFKC = getNormalizeWithNFKC();
    const CJK = "(?:\\p{Ideographic}|[぀-ヿ])";
    const HKDiacritics = "(?:゙|゚)";
    const regexp = `([${replace}])|([${toNormalizeWithNFKC}])|(${HKDiacritics}\\n)|(\\p{M}+(?:-\\n)?)|(\\S-\\n)|(${CJK}\\n)|(\\n)`;
    if (syllablePositions.length === 0) {
      normalizationRegex = noSyllablesRegExp = new RegExp(regexp + "|(\\u0000)", "gum");
    } else {
      normalizationRegex = withSyllablesRegExp = new RegExp(regexp + `|(${FIRST_CHAR_SYLLABLES_REG_EXP})`, "gum");
    }
  }
  const rawDiacriticsPositions = [];
  while ((m = DIACRITICS_REG_EXP.exec(text)) !== null) {
    rawDiacriticsPositions.push([m[0].length, m.index]);
  }
  let normalized = text.normalize("NFD");
  const positions = [[0, 0]];
  let rawDiacriticsIndex = 0;
  let syllableIndex = 0;
  let shift = 0;
  let shiftOrigin = 0;
  let eol = 0;
  let hasDiacritics = false;
  normalized = normalized.replace(normalizationRegex, (match2, p1, p2, p3, p4, p5, p6, p7, p8, i) => {
    var _a, _b, _c;
    i -= shiftOrigin;
    if (p1) {
      const replacement = CHARACTERS_TO_NORMALIZE[p1];
      const jj = replacement.length;
      for (let j = 1; j < jj; j++) {
        positions.push([i - shift + j, shift - j]);
      }
      shift -= jj - 1;
      return replacement;
    }
    if (p2) {
      let replacement = NFKC_CHARS_TO_NORMALIZE.get(p2);
      if (!replacement) {
        replacement = p2.normalize("NFKC");
        NFKC_CHARS_TO_NORMALIZE.set(p2, replacement);
      }
      const jj = replacement.length;
      for (let j = 1; j < jj; j++) {
        positions.push([i - shift + j, shift - j]);
      }
      shift -= jj - 1;
      return replacement;
    }
    if (p3) {
      hasDiacritics = true;
      if (i + eol === ((_a = rawDiacriticsPositions[rawDiacriticsIndex]) == null ? void 0 : _a[1])) {
        ++rawDiacriticsIndex;
      } else {
        positions.push([i - 1 - shift + 1, shift - 1]);
        shift -= 1;
        shiftOrigin += 1;
      }
      positions.push([i - shift + 1, shift]);
      shiftOrigin += 1;
      eol += 1;
      return p3.charAt(0);
    }
    if (p4) {
      const hasTrailingDashEOL = p4.endsWith("\n");
      const len = hasTrailingDashEOL ? p4.length - 2 : p4.length;
      hasDiacritics = true;
      let jj = len;
      if (i + eol === ((_b = rawDiacriticsPositions[rawDiacriticsIndex]) == null ? void 0 : _b[1])) {
        jj -= rawDiacriticsPositions[rawDiacriticsIndex][0];
        ++rawDiacriticsIndex;
      }
      for (let j = 1; j <= jj; j++) {
        positions.push([i - 1 - shift + j, shift - j]);
      }
      shift -= jj;
      shiftOrigin += jj;
      if (hasTrailingDashEOL) {
        i += len - 1;
        positions.push([i - shift + 1, 1 + shift]);
        shift += 1;
        shiftOrigin += 1;
        eol += 1;
        return p4.slice(0, len);
      }
      return p4;
    }
    if (p5) {
      const len = p5.length - 2;
      positions.push([i - shift + len, 1 + shift]);
      shift += 1;
      shiftOrigin += 1;
      eol += 1;
      return p5.slice(0, -2);
    }
    if (p6) {
      const len = p6.length - 1;
      positions.push([i - shift + len, shift]);
      shiftOrigin += 1;
      eol += 1;
      return p6.slice(0, -1);
    }
    if (p7) {
      positions.push([i - shift + 1, shift - 1]);
      shift -= 1;
      shiftOrigin += 1;
      eol += 1;
      return " ";
    }
    if (i + eol === ((_c = syllablePositions[syllableIndex]) == null ? void 0 : _c[1])) {
      const newCharLen = syllablePositions[syllableIndex][0] - 1;
      ++syllableIndex;
      for (let j = 1; j <= newCharLen; j++) {
        positions.push([i - (shift - j), shift - j]);
      }
      shift -= newCharLen;
      shiftOrigin += newCharLen;
    }
    return p8;
  });
  positions.push([normalized.length, shift]);
  return [normalized, positions, hasDiacritics];
}
function getOriginalIndex(diffs, pos, len) {
  if (!diffs) {
    return [pos, len];
  }
  const start = pos;
  const end = pos + len - 1;
  let i = binarySearchFirstItem(diffs, (x) => x[0] >= start);
  if (diffs[i][0] > start) {
    --i;
  }
  let j = binarySearchFirstItem(diffs, (x) => x[0] >= end, i);
  if (diffs[j][0] > end) {
    --j;
  }
  const oldStart = start + diffs[i][1];
  const oldEnd = end + diffs[j][1];
  const oldLen = oldEnd + 1 - oldStart;
  return [oldStart, oldLen];
}
class PDFFindController {
  constructor({
    linkService,
    eventBus,
    updateMatchesCountOnProgress = true
  }) {
    __privateAdd(this, _PDFFindController_instances);
    __privateAdd(this, _state, null);
    __privateAdd(this, _updateMatchesCountOnProgress, true);
    __privateAdd(this, _visitedPagesCount, 0);
    this._linkService = linkService;
    this._eventBus = eventBus;
    __privateSet(this, _updateMatchesCountOnProgress, updateMatchesCountOnProgress);
    this.onIsPageVisible = null;
    __privateMethod(this, _PDFFindController_instances, reset_fn).call(this);
    eventBus._on("find", __privateMethod(this, _PDFFindController_instances, onFind_fn).bind(this));
    eventBus._on("findbarclose", __privateMethod(this, _PDFFindController_instances, onFindBarClose_fn).bind(this));
  }
  get highlightMatches() {
    return this._highlightMatches;
  }
  get pageMatches() {
    return this._pageMatches;
  }
  get pageMatchesLength() {
    return this._pageMatchesLength;
  }
  get selected() {
    return this._selected;
  }
  get state() {
    return __privateGet(this, _state);
  }
  setDocument(pdfDocument) {
    if (this._pdfDocument) {
      __privateMethod(this, _PDFFindController_instances, reset_fn).call(this);
    }
    if (!pdfDocument) {
      return;
    }
    this._pdfDocument = pdfDocument;
    this._firstPageCapability.resolve();
  }
  scrollMatchIntoView({
    element = null,
    selectedLeft = 0,
    pageIndex = -1,
    matchIndex = -1
  }) {
    if (!this._scrollMatches || !element) {
      return;
    } else if (matchIndex === -1 || matchIndex !== this._selected.matchIdx) {
      return;
    } else if (pageIndex === -1 || pageIndex !== this._selected.pageIdx) {
      return;
    }
    this._scrollMatches = false;
    const spot = {
      top: MATCH_SCROLL_OFFSET_TOP,
      left: selectedLeft + MATCH_SCROLL_OFFSET_LEFT
    };
    scrollIntoView(element, spot, true);
  }
}
_state = new WeakMap();
_updateMatchesCountOnProgress = new WeakMap();
_visitedPagesCount = new WeakMap();
_PDFFindController_instances = new WeakSet();
onFind_fn = function(state) {
  if (!state) {
    return;
  }
  const pdfDocument = this._pdfDocument;
  const {
    type
  } = state;
  if (__privateGet(this, _state) === null || __privateMethod(this, _PDFFindController_instances, shouldDirtyMatch_fn).call(this, state)) {
    this._dirtyMatch = true;
  }
  __privateSet(this, _state, state);
  if (type !== "highlightallchange") {
    __privateMethod(this, _PDFFindController_instances, updateUIState_fn).call(this, FindState.PENDING);
  }
  this._firstPageCapability.promise.then(() => {
    if (!this._pdfDocument || pdfDocument && this._pdfDocument !== pdfDocument) {
      return;
    }
    __privateMethod(this, _PDFFindController_instances, extractText_fn).call(this);
    const findbarClosed = !this._highlightMatches;
    const pendingTimeout = !!this._findTimeout;
    if (this._findTimeout) {
      clearTimeout(this._findTimeout);
      this._findTimeout = null;
    }
    if (!type) {
      this._findTimeout = setTimeout(() => {
        __privateMethod(this, _PDFFindController_instances, nextMatch_fn).call(this);
        this._findTimeout = null;
      }, FIND_TIMEOUT);
    } else if (this._dirtyMatch) {
      __privateMethod(this, _PDFFindController_instances, nextMatch_fn).call(this);
    } else if (type === "again") {
      __privateMethod(this, _PDFFindController_instances, nextMatch_fn).call(this);
      if (findbarClosed && __privateGet(this, _state).highlightAll) {
        __privateMethod(this, _PDFFindController_instances, updateAllPages_fn).call(this);
      }
    } else if (type === "highlightallchange") {
      if (pendingTimeout) {
        __privateMethod(this, _PDFFindController_instances, nextMatch_fn).call(this);
      } else {
        this._highlightMatches = true;
      }
      __privateMethod(this, _PDFFindController_instances, updateAllPages_fn).call(this);
    } else {
      __privateMethod(this, _PDFFindController_instances, nextMatch_fn).call(this);
    }
  });
};
reset_fn = function() {
  this._highlightMatches = false;
  this._scrollMatches = false;
  this._pdfDocument = null;
  this._pageMatches = [];
  this._pageMatchesLength = [];
  __privateSet(this, _visitedPagesCount, 0);
  __privateSet(this, _state, null);
  this._selected = {
    pageIdx: -1,
    matchIdx: -1
  };
  this._offset = {
    pageIdx: null,
    matchIdx: null,
    wrapped: false
  };
  this._extractTextPromises = [];
  this._pageContents = [];
  this._pageDiffs = [];
  this._hasDiacritics = [];
  this._matchesCountTotal = 0;
  this._pagesToSearch = null;
  this._pendingFindMatches = /* @__PURE__ */ new Set();
  this._resumePageIdx = null;
  this._dirtyMatch = false;
  clearTimeout(this._findTimeout);
  this._findTimeout = null;
  this._firstPageCapability = Promise.withResolvers();
};
query_get = function() {
  const {
    query
  } = __privateGet(this, _state);
  if (typeof query === "string") {
    if (query !== this._rawQuery) {
      this._rawQuery = query;
      [this._normalizedQuery] = normalize(query);
    }
    return this._normalizedQuery;
  }
  return (query || []).filter((q) => !!q).map((q) => normalize(q)[0]);
};
shouldDirtyMatch_fn = function(state) {
  var _a;
  const newQuery = state.query, prevQuery = __privateGet(this, _state).query;
  const newType = typeof newQuery, prevType = typeof prevQuery;
  if (newType !== prevType) {
    return true;
  }
  if (newType === "string") {
    if (newQuery !== prevQuery) {
      return true;
    }
  } else if (JSON.stringify(newQuery) !== JSON.stringify(prevQuery)) {
    return true;
  }
  switch (state.type) {
    case "again":
      const pageNumber = this._selected.pageIdx + 1;
      const linkService = this._linkService;
      return pageNumber >= 1 && pageNumber <= linkService.pagesCount && pageNumber !== linkService.page && !(((_a = this.onIsPageVisible) == null ? void 0 : _a.call(this, pageNumber)) ?? true);
    case "highlightallchange":
      return false;
  }
  return true;
};
isEntireWord_fn = function(content, startIdx, length) {
  let match2 = content.slice(0, startIdx).match(NOT_DIACRITIC_FROM_END_REG_EXP);
  if (match2) {
    const first = content.charCodeAt(startIdx);
    const limit = match2[1].charCodeAt(0);
    if (getCharacterType(first) === getCharacterType(limit)) {
      return false;
    }
  }
  match2 = content.slice(startIdx + length).match(NOT_DIACRITIC_FROM_START_REG_EXP);
  if (match2) {
    const last = content.charCodeAt(startIdx + length - 1);
    const limit = match2[1].charCodeAt(0);
    if (getCharacterType(last) === getCharacterType(limit)) {
      return false;
    }
  }
  return true;
};
calculateRegExpMatch_fn = function(query, entireWord, pageIndex, pageContent) {
  const matches = this._pageMatches[pageIndex] = [];
  const matchesLength = this._pageMatchesLength[pageIndex] = [];
  if (!query) {
    return;
  }
  const diffs = this._pageDiffs[pageIndex];
  let match2;
  while ((match2 = query.exec(pageContent)) !== null) {
    if (entireWord && !__privateMethod(this, _PDFFindController_instances, isEntireWord_fn).call(this, pageContent, match2.index, match2[0].length)) {
      continue;
    }
    const [matchPos, matchLen] = getOriginalIndex(diffs, match2.index, match2[0].length);
    if (matchLen) {
      matches.push(matchPos);
      matchesLength.push(matchLen);
    }
  }
};
convertToRegExpString_fn = function(query, hasDiacritics) {
  const {
    matchDiacritics
  } = __privateGet(this, _state);
  let isUnicode = false;
  query = query.replaceAll(SPECIAL_CHARS_REG_EXP, (match2, p1, p2, p3, p4, p5) => {
    if (p1) {
      return `[ ]*\\${p1}[ ]*`;
    }
    if (p2) {
      return `[ ]*${p2}[ ]*`;
    }
    if (p3) {
      return "[ ]+";
    }
    if (matchDiacritics) {
      return p4 || p5;
    }
    if (p4) {
      return DIACRITICS_EXCEPTION.has(p4.charCodeAt(0)) ? p4 : "";
    }
    if (hasDiacritics) {
      isUnicode = true;
      return `${p5}\\p{M}*`;
    }
    return p5;
  });
  const trailingSpaces = "[ ]*";
  if (query.endsWith(trailingSpaces)) {
    query = query.slice(0, query.length - trailingSpaces.length);
  }
  if (matchDiacritics) {
    if (hasDiacritics) {
      DIACRITICS_EXCEPTION_STR || (DIACRITICS_EXCEPTION_STR = String.fromCharCode(...DIACRITICS_EXCEPTION));
      isUnicode = true;
      query = `${query}(?=[${DIACRITICS_EXCEPTION_STR}]|[^\\p{M}]|$)`;
    }
  }
  return [isUnicode, query];
};
calculateMatch_fn = function(pageIndex) {
  let query = __privateGet(this, _PDFFindController_instances, query_get);
  if (query.length === 0) {
    return;
  }
  const {
    caseSensitive,
    entireWord
  } = __privateGet(this, _state);
  const pageContent = this._pageContents[pageIndex];
  const hasDiacritics = this._hasDiacritics[pageIndex];
  let isUnicode = false;
  if (typeof query === "string") {
    [isUnicode, query] = __privateMethod(this, _PDFFindController_instances, convertToRegExpString_fn).call(this, query, hasDiacritics);
  } else {
    query = query.sort().reverse().map((q) => {
      const [isUnicodePart, queryPart] = __privateMethod(this, _PDFFindController_instances, convertToRegExpString_fn).call(this, q, hasDiacritics);
      isUnicode || (isUnicode = isUnicodePart);
      return `(${queryPart})`;
    }).join("|");
  }
  const flags = `g${isUnicode ? "u" : ""}${caseSensitive ? "" : "i"}`;
  query = query ? new RegExp(query, flags) : null;
  __privateMethod(this, _PDFFindController_instances, calculateRegExpMatch_fn).call(this, query, entireWord, pageIndex, pageContent);
  if (__privateGet(this, _state).highlightAll) {
    __privateMethod(this, _PDFFindController_instances, updatePage_fn).call(this, pageIndex);
  }
  if (this._resumePageIdx === pageIndex) {
    this._resumePageIdx = null;
    __privateMethod(this, _PDFFindController_instances, nextPageMatch_fn).call(this);
  }
  const pageMatchesCount = this._pageMatches[pageIndex].length;
  this._matchesCountTotal += pageMatchesCount;
  if (__privateGet(this, _updateMatchesCountOnProgress)) {
    if (pageMatchesCount > 0) {
      __privateMethod(this, _PDFFindController_instances, updateUIResultsCount_fn).call(this);
    }
  } else if (++__privateWrapper(this, _visitedPagesCount)._ === this._linkService.pagesCount) {
    __privateMethod(this, _PDFFindController_instances, updateUIResultsCount_fn).call(this);
  }
};
extractText_fn = function() {
  if (this._extractTextPromises.length > 0) {
    return;
  }
  let deferred = Promise.resolve();
  const textOptions = {
    disableNormalization: true
  };
  for (let i = 0, ii = this._linkService.pagesCount; i < ii; i++) {
    const {
      promise,
      resolve
    } = Promise.withResolvers();
    this._extractTextPromises[i] = promise;
    deferred = deferred.then(() => {
      return this._pdfDocument.getPage(i + 1).then((pdfPage) => pdfPage.getTextContent(textOptions)).then((textContent) => {
        const strBuf = [];
        for (const textItem of textContent.items) {
          strBuf.push(textItem.str);
          if (textItem.hasEOL) {
            strBuf.push("\n");
          }
        }
        [this._pageContents[i], this._pageDiffs[i], this._hasDiacritics[i]] = normalize(strBuf.join(""));
        resolve();
      }, (reason) => {
        console.error(`Unable to get text content for page ${i + 1}`, reason);
        this._pageContents[i] = "";
        this._pageDiffs[i] = null;
        this._hasDiacritics[i] = false;
        resolve();
      });
    });
  }
};
updatePage_fn = function(index) {
  if (this._scrollMatches && this._selected.pageIdx === index) {
    this._linkService.page = index + 1;
  }
  this._eventBus.dispatch("updatetextlayermatches", {
    source: this,
    pageIndex: index
  });
};
updateAllPages_fn = function() {
  this._eventBus.dispatch("updatetextlayermatches", {
    source: this,
    pageIndex: -1
  });
};
nextMatch_fn = function() {
  const previous = __privateGet(this, _state).findPrevious;
  const currentPageIndex = this._linkService.page - 1;
  const numPages = this._linkService.pagesCount;
  this._highlightMatches = true;
  if (this._dirtyMatch) {
    this._dirtyMatch = false;
    this._selected.pageIdx = this._selected.matchIdx = -1;
    this._offset.pageIdx = currentPageIndex;
    this._offset.matchIdx = null;
    this._offset.wrapped = false;
    this._resumePageIdx = null;
    this._pageMatches.length = 0;
    this._pageMatchesLength.length = 0;
    __privateSet(this, _visitedPagesCount, 0);
    this._matchesCountTotal = 0;
    __privateMethod(this, _PDFFindController_instances, updateAllPages_fn).call(this);
    for (let i = 0; i < numPages; i++) {
      if (this._pendingFindMatches.has(i)) {
        continue;
      }
      this._pendingFindMatches.add(i);
      this._extractTextPromises[i].then(() => {
        this._pendingFindMatches.delete(i);
        __privateMethod(this, _PDFFindController_instances, calculateMatch_fn).call(this, i);
      });
    }
  }
  const query = __privateGet(this, _PDFFindController_instances, query_get);
  if (query.length === 0) {
    __privateMethod(this, _PDFFindController_instances, updateUIState_fn).call(this, FindState.FOUND);
    return;
  }
  if (this._resumePageIdx) {
    return;
  }
  const offset = this._offset;
  this._pagesToSearch = numPages;
  if (offset.matchIdx !== null) {
    const numPageMatches = this._pageMatches[offset.pageIdx].length;
    if (!previous && offset.matchIdx + 1 < numPageMatches || previous && offset.matchIdx > 0) {
      offset.matchIdx = previous ? offset.matchIdx - 1 : offset.matchIdx + 1;
      __privateMethod(this, _PDFFindController_instances, updateMatch_fn).call(this, true);
      return;
    }
    __privateMethod(this, _PDFFindController_instances, advanceOffsetPage_fn).call(this, previous);
  }
  __privateMethod(this, _PDFFindController_instances, nextPageMatch_fn).call(this);
};
matchesReady_fn = function(matches) {
  const offset = this._offset;
  const numMatches = matches.length;
  const previous = __privateGet(this, _state).findPrevious;
  if (numMatches) {
    offset.matchIdx = previous ? numMatches - 1 : 0;
    __privateMethod(this, _PDFFindController_instances, updateMatch_fn).call(this, true);
    return true;
  }
  __privateMethod(this, _PDFFindController_instances, advanceOffsetPage_fn).call(this, previous);
  if (offset.wrapped) {
    offset.matchIdx = null;
    if (this._pagesToSearch < 0) {
      __privateMethod(this, _PDFFindController_instances, updateMatch_fn).call(this, false);
      return true;
    }
  }
  return false;
};
nextPageMatch_fn = function() {
  if (this._resumePageIdx !== null) {
    console.error("There can only be one pending page.");
  }
  let matches = null;
  do {
    const pageIdx = this._offset.pageIdx;
    matches = this._pageMatches[pageIdx];
    if (!matches) {
      this._resumePageIdx = pageIdx;
      break;
    }
  } while (!__privateMethod(this, _PDFFindController_instances, matchesReady_fn).call(this, matches));
};
advanceOffsetPage_fn = function(previous) {
  const offset = this._offset;
  const numPages = this._linkService.pagesCount;
  offset.pageIdx = previous ? offset.pageIdx - 1 : offset.pageIdx + 1;
  offset.matchIdx = null;
  this._pagesToSearch--;
  if (offset.pageIdx >= numPages || offset.pageIdx < 0) {
    offset.pageIdx = previous ? numPages - 1 : 0;
    offset.wrapped = true;
  }
};
updateMatch_fn = function(found = false) {
  let state = FindState.NOT_FOUND;
  const wrapped = this._offset.wrapped;
  this._offset.wrapped = false;
  if (found) {
    const previousPage = this._selected.pageIdx;
    this._selected.pageIdx = this._offset.pageIdx;
    this._selected.matchIdx = this._offset.matchIdx;
    state = wrapped ? FindState.WRAPPED : FindState.FOUND;
    if (previousPage !== -1 && previousPage !== this._selected.pageIdx) {
      __privateMethod(this, _PDFFindController_instances, updatePage_fn).call(this, previousPage);
    }
  }
  __privateMethod(this, _PDFFindController_instances, updateUIState_fn).call(this, state, __privateGet(this, _state).findPrevious);
  if (this._selected.pageIdx !== -1) {
    this._scrollMatches = true;
    __privateMethod(this, _PDFFindController_instances, updatePage_fn).call(this, this._selected.pageIdx);
  }
};
onFindBarClose_fn = function(evt) {
  const pdfDocument = this._pdfDocument;
  this._firstPageCapability.promise.then(() => {
    if (!this._pdfDocument || pdfDocument && this._pdfDocument !== pdfDocument) {
      return;
    }
    if (this._findTimeout) {
      clearTimeout(this._findTimeout);
      this._findTimeout = null;
    }
    if (this._resumePageIdx) {
      this._resumePageIdx = null;
      this._dirtyMatch = true;
    }
    __privateMethod(this, _PDFFindController_instances, updateUIState_fn).call(this, FindState.FOUND);
    this._highlightMatches = false;
    __privateMethod(this, _PDFFindController_instances, updateAllPages_fn).call(this);
  });
};
requestMatchesCount_fn = function() {
  var _a;
  const {
    pageIdx,
    matchIdx
  } = this._selected;
  let current = 0, total = this._matchesCountTotal;
  if (matchIdx !== -1) {
    for (let i = 0; i < pageIdx; i++) {
      current += ((_a = this._pageMatches[i]) == null ? void 0 : _a.length) || 0;
    }
    current += matchIdx + 1;
  }
  if (current < 1 || current > total) {
    current = total = 0;
  }
  return {
    current,
    total
  };
};
updateUIResultsCount_fn = function() {
  this._eventBus.dispatch("updatefindmatchescount", {
    source: this,
    matchesCount: __privateMethod(this, _PDFFindController_instances, requestMatchesCount_fn).call(this)
  });
};
updateUIState_fn = function(state, previous = false) {
  var _a, _b;
  if (!__privateGet(this, _updateMatchesCountOnProgress) && (__privateGet(this, _visitedPagesCount) !== this._linkService.pagesCount || state === FindState.PENDING)) {
    return;
  }
  this._eventBus.dispatch("updatefindcontrolstate", {
    source: this,
    state,
    previous,
    entireWord: ((_a = __privateGet(this, _state)) == null ? void 0 : _a.entireWord) ?? null,
    matchesCount: __privateMethod(this, _PDFFindController_instances, requestMatchesCount_fn).call(this),
    rawQuery: ((_b = __privateGet(this, _state)) == null ? void 0 : _b.query) ?? null
  });
};
const DEFAULT_LINK_REL = "noopener noreferrer nofollow";
const LinkTarget = {
  NONE: 0,
  SELF: 1,
  BLANK: 2,
  PARENT: 3,
  TOP: 4
};
const _PDFLinkService = class _PDFLinkService {
  constructor({
    eventBus,
    externalLinkTarget = null,
    externalLinkRel = null,
    ignoreDestinationZoom = false
  } = {}) {
    __publicField(this, "externalLinkEnabled", true);
    this.eventBus = eventBus;
    this.externalLinkTarget = externalLinkTarget;
    this.externalLinkRel = externalLinkRel;
    this._ignoreDestinationZoom = ignoreDestinationZoom;
    this.baseUrl = null;
    this.pdfDocument = null;
    this.pdfViewer = null;
    this.pdfHistory = null;
  }
  setDocument(pdfDocument, baseUrl = null) {
    this.baseUrl = baseUrl;
    this.pdfDocument = pdfDocument;
  }
  setViewer(pdfViewer) {
    this.pdfViewer = pdfViewer;
  }
  setHistory(pdfHistory) {
    this.pdfHistory = pdfHistory;
  }
  get pagesCount() {
    return this.pdfDocument ? this.pdfDocument.numPages : 0;
  }
  get page() {
    return this.pdfDocument ? this.pdfViewer.currentPageNumber : 1;
  }
  set page(value) {
    if (this.pdfDocument) {
      this.pdfViewer.currentPageNumber = value;
    }
  }
  get rotation() {
    return this.pdfDocument ? this.pdfViewer.pagesRotation : 0;
  }
  set rotation(value) {
    if (this.pdfDocument) {
      this.pdfViewer.pagesRotation = value;
    }
  }
  get isInPresentationMode() {
    return this.pdfDocument ? this.pdfViewer.isInPresentationMode : false;
  }
  async goToDestination(dest) {
    if (!this.pdfDocument) {
      return;
    }
    let namedDest, explicitDest, pageNumber;
    if (typeof dest === "string") {
      namedDest = dest;
      explicitDest = await this.pdfDocument.getDestination(dest);
    } else {
      namedDest = null;
      explicitDest = await dest;
    }
    if (!Array.isArray(explicitDest)) {
      console.error(`goToDestination: "${explicitDest}" is not a valid destination array, for dest="${dest}".`);
      return;
    }
    const [destRef] = explicitDest;
    if (destRef && typeof destRef === "object") {
      pageNumber = this.pdfDocument.cachedPageNumber(destRef);
      if (!pageNumber) {
        try {
          pageNumber = await this.pdfDocument.getPageIndex(destRef) + 1;
        } catch {
          console.error(`goToDestination: "${destRef}" is not a valid page reference, for dest="${dest}".`);
          return;
        }
      }
    } else if (Number.isInteger(destRef)) {
      pageNumber = destRef + 1;
    }
    if (!pageNumber || pageNumber < 1 || pageNumber > this.pagesCount) {
      console.error(`goToDestination: "${pageNumber}" is not a valid page number, for dest="${dest}".`);
      return;
    }
    if (this.pdfHistory) {
      this.pdfHistory.pushCurrentPosition();
      this.pdfHistory.push({
        namedDest,
        explicitDest,
        pageNumber
      });
    }
    this.pdfViewer.scrollPageIntoView({
      pageNumber,
      destArray: explicitDest,
      ignoreDestinationZoom: this._ignoreDestinationZoom
    });
  }
  goToPage(val) {
    if (!this.pdfDocument) {
      return;
    }
    const pageNumber = typeof val === "string" && this.pdfViewer.pageLabelToPageNumber(val) || val | 0;
    if (!(Number.isInteger(pageNumber) && pageNumber > 0 && pageNumber <= this.pagesCount)) {
      console.error(`PDFLinkService.goToPage: "${val}" is not a valid page.`);
      return;
    }
    if (this.pdfHistory) {
      this.pdfHistory.pushCurrentPosition();
      this.pdfHistory.pushPage(pageNumber);
    }
    this.pdfViewer.scrollPageIntoView({
      pageNumber
    });
  }
  addLinkAttributes(link, url, newWindow = false) {
    if (!url || typeof url !== "string") {
      throw new Error('A valid "url" parameter must provided.');
    }
    const target = newWindow ? LinkTarget.BLANK : this.externalLinkTarget, rel = this.externalLinkRel;
    if (this.externalLinkEnabled) {
      link.href = link.title = url;
    } else {
      link.href = "";
      link.title = `Disabled: ${url}`;
      link.onclick = () => false;
    }
    let targetStr = "";
    switch (target) {
      case LinkTarget.NONE:
        break;
      case LinkTarget.SELF:
        targetStr = "_self";
        break;
      case LinkTarget.BLANK:
        targetStr = "_blank";
        break;
      case LinkTarget.PARENT:
        targetStr = "_parent";
        break;
      case LinkTarget.TOP:
        targetStr = "_top";
        break;
    }
    link.target = targetStr;
    link.rel = typeof rel === "string" ? rel : DEFAULT_LINK_REL;
  }
  getDestinationHash(dest) {
    if (typeof dest === "string") {
      if (dest.length > 0) {
        return this.getAnchorUrl("#" + escape(dest));
      }
    } else if (Array.isArray(dest)) {
      const str = JSON.stringify(dest);
      if (str.length > 0) {
        return this.getAnchorUrl("#" + escape(str));
      }
    }
    return this.getAnchorUrl("");
  }
  getAnchorUrl(anchor) {
    return this.baseUrl ? this.baseUrl + anchor : anchor;
  }
  setHash(hash) {
    var _a;
    if (!this.pdfDocument) {
      return;
    }
    let pageNumber, dest;
    if (hash.includes("=")) {
      const params = parseQueryString(hash);
      if (params.has("search")) {
        const query = params.get("search").replaceAll('"', ""), phrase = params.get("phrase") === "true";
        this.eventBus.dispatch("findfromurlhash", {
          source: this,
          query: phrase ? query : query.match(/\S+/g)
        });
      }
      if (params.has("page")) {
        pageNumber = params.get("page") | 0 || 1;
      }
      if (params.has("zoom")) {
        const zoomArgs = params.get("zoom").split(",");
        const zoomArg = zoomArgs[0];
        const zoomArgNumber = parseFloat(zoomArg);
        if (!zoomArg.includes("Fit")) {
          dest = [null, {
            name: "XYZ"
          }, zoomArgs.length > 1 ? zoomArgs[1] | 0 : null, zoomArgs.length > 2 ? zoomArgs[2] | 0 : null, zoomArgNumber ? zoomArgNumber / 100 : zoomArg];
        } else if (zoomArg === "Fit" || zoomArg === "FitB") {
          dest = [null, {
            name: zoomArg
          }];
        } else if (zoomArg === "FitH" || zoomArg === "FitBH" || zoomArg === "FitV" || zoomArg === "FitBV") {
          dest = [null, {
            name: zoomArg
          }, zoomArgs.length > 1 ? zoomArgs[1] | 0 : null];
        } else if (zoomArg === "FitR") {
          if (zoomArgs.length !== 5) {
            console.error('PDFLinkService.setHash: Not enough parameters for "FitR".');
          } else {
            dest = [null, {
              name: zoomArg
            }, zoomArgs[1] | 0, zoomArgs[2] | 0, zoomArgs[3] | 0, zoomArgs[4] | 0];
          }
        } else {
          console.error(`PDFLinkService.setHash: "${zoomArg}" is not a valid zoom value.`);
        }
      }
      if (dest) {
        this.pdfViewer.scrollPageIntoView({
          pageNumber: pageNumber || this.page,
          destArray: dest,
          allowNegativeOffset: true
        });
      } else if (pageNumber) {
        this.page = pageNumber;
      }
      if (params.has("pagemode")) {
        this.eventBus.dispatch("pagemode", {
          source: this,
          mode: params.get("pagemode")
        });
      }
      if (params.has("nameddest")) {
        this.goToDestination(params.get("nameddest"));
      }
      return;
    }
    dest = unescape(hash);
    try {
      dest = JSON.parse(dest);
      if (!Array.isArray(dest)) {
        dest = dest.toString();
      }
    } catch {
    }
    if (typeof dest === "string" || __privateMethod(_a = _PDFLinkService, _PDFLinkService_static, isValidExplicitDest_fn).call(_a, dest)) {
      this.goToDestination(dest);
      return;
    }
    console.error(`PDFLinkService.setHash: "${unescape(hash)}" is not a valid destination.`);
  }
  executeNamedAction(action) {
    var _a, _b;
    if (!this.pdfDocument) {
      return;
    }
    switch (action) {
      case "GoBack":
        (_a = this.pdfHistory) == null ? void 0 : _a.back();
        break;
      case "GoForward":
        (_b = this.pdfHistory) == null ? void 0 : _b.forward();
        break;
      case "NextPage":
        this.pdfViewer.nextPage();
        break;
      case "PrevPage":
        this.pdfViewer.previousPage();
        break;
      case "LastPage":
        this.page = this.pagesCount;
        break;
      case "FirstPage":
        this.page = 1;
        break;
    }
    this.eventBus.dispatch("namedaction", {
      source: this,
      action
    });
  }
  async executeSetOCGState(action) {
    if (!this.pdfDocument) {
      return;
    }
    const pdfDocument = this.pdfDocument, optionalContentConfig = await this.pdfViewer.optionalContentConfigPromise;
    if (pdfDocument !== this.pdfDocument) {
      return;
    }
    optionalContentConfig.setOCGState(action);
    this.pdfViewer.optionalContentConfigPromise = Promise.resolve(optionalContentConfig);
  }
};
_PDFLinkService_static = new WeakSet();
isValidExplicitDest_fn = function(dest) {
  if (!Array.isArray(dest) || dest.length < 2) {
    return false;
  }
  const [page, zoom, ...args] = dest;
  if (!(typeof page === "object" && Number.isInteger(page == null ? void 0 : page.num) && Number.isInteger(page == null ? void 0 : page.gen)) && !Number.isInteger(page)) {
    return false;
  }
  if (!(typeof zoom === "object" && typeof (zoom == null ? void 0 : zoom.name) === "string")) {
    return false;
  }
  let allowNull = true;
  switch (zoom.name) {
    case "XYZ":
      if (args.length !== 3) {
        return false;
      }
      break;
    case "Fit":
    case "FitB":
      return args.length === 0;
    case "FitH":
    case "FitBH":
    case "FitV":
    case "FitBV":
      if (args.length !== 1) {
        return false;
      }
      break;
    case "FitR":
      if (args.length !== 4) {
        return false;
      }
      allowNull = false;
      break;
    default:
      return false;
  }
  for (const arg of args) {
    if (!(typeof arg === "number" || allowNull && arg === null)) {
      return false;
    }
  }
  return true;
};
__privateAdd(_PDFLinkService, _PDFLinkService_static);
let PDFLinkService = _PDFLinkService;
class SimpleLinkService extends PDFLinkService {
  setDocument(pdfDocument, baseUrl = null) {
  }
}
const {
  AbortException,
  AnnotationEditorLayer,
  AnnotationEditorParamsType,
  AnnotationEditorType,
  AnnotationEditorUIManager,
  AnnotationLayer,
  AnnotationMode,
  build,
  CMapCompressionType,
  ColorPicker,
  createValidAbsoluteUrl,
  DOMSVGFactory,
  DrawLayer,
  FeatureTest,
  fetchData,
  getDocument,
  getFilenameFromUrl,
  getPdfFilenameFromUrl,
  getXfaPageViewport,
  GlobalWorkerOptions,
  ImageKind,
  InvalidPDFException,
  isDataScheme,
  isPdfFile,
  MissingPDFException,
  noContextMenu,
  normalizeUnicode,
  OPS,
  Outliner,
  PasswordResponses,
  PDFDataRangeTransport,
  PDFDateString,
  PDFWorker,
  PermissionFlag,
  PixelsPerInch,
  RenderingCancelledException,
  renderTextLayer,
  setLayerDimensions,
  shadow,
  TextLayer,
  UnexpectedResponseException,
  updateTextLayer,
  Util,
  VerbosityLevel,
  version,
  XfaLayer
} = globalThis.pdfjsLib;
class AnnotationLayerBuilder {
  constructor({
    pdfPage,
    linkService,
    downloadManager,
    annotationStorage = null,
    imageResourcesPath = "",
    renderForms = true,
    enableScripting = false,
    hasJSActionsPromise = null,
    fieldObjectsPromise = null,
    annotationCanvasMap = null,
    accessibilityManager = null,
    annotationEditorUIManager = null,
    onAppend = null
  }) {
    __privateAdd(this, _AnnotationLayerBuilder_instances);
    __privateAdd(this, _onAppend, null);
    __privateAdd(this, _eventAbortController, null);
    this.pdfPage = pdfPage;
    this.linkService = linkService;
    this.downloadManager = downloadManager;
    this.imageResourcesPath = imageResourcesPath;
    this.renderForms = renderForms;
    this.annotationStorage = annotationStorage;
    this.enableScripting = enableScripting;
    this._hasJSActionsPromise = hasJSActionsPromise || Promise.resolve(false);
    this._fieldObjectsPromise = fieldObjectsPromise || Promise.resolve(null);
    this._annotationCanvasMap = annotationCanvasMap;
    this._accessibilityManager = accessibilityManager;
    this._annotationEditorUIManager = annotationEditorUIManager;
    __privateSet(this, _onAppend, onAppend);
    this.annotationLayer = null;
    this.div = null;
    this._cancelled = false;
    this._eventBus = linkService.eventBus;
  }
  async render(viewport, intent = "display") {
    var _a, _b;
    if (this.div) {
      if (this._cancelled || !this.annotationLayer) {
        return;
      }
      this.annotationLayer.update({
        viewport: viewport.clone({
          dontFlip: true
        })
      });
      return;
    }
    const [annotations, hasJSActions, fieldObjects] = await Promise.all([this.pdfPage.getAnnotations({
      intent
    }), this._hasJSActionsPromise, this._fieldObjectsPromise]);
    if (this._cancelled) {
      return;
    }
    const div = this.div = document.createElement("div");
    div.className = "annotationLayer";
    (_a = __privateGet(this, _onAppend)) == null ? void 0 : _a.call(this, div);
    if (annotations.length === 0) {
      this.hide();
      return;
    }
    this.annotationLayer = new AnnotationLayer({
      div,
      accessibilityManager: this._accessibilityManager,
      annotationCanvasMap: this._annotationCanvasMap,
      annotationEditorUIManager: this._annotationEditorUIManager,
      page: this.pdfPage,
      viewport: viewport.clone({
        dontFlip: true
      })
    });
    await this.annotationLayer.render({
      annotations,
      imageResourcesPath: this.imageResourcesPath,
      renderForms: this.renderForms,
      linkService: this.linkService,
      downloadManager: this.downloadManager,
      annotationStorage: this.annotationStorage,
      enableScripting: this.enableScripting,
      hasJSActions,
      fieldObjects
    });
    if (this.linkService.isInPresentationMode) {
      __privateMethod(this, _AnnotationLayerBuilder_instances, updatePresentationModeState_fn).call(this, PresentationModeState.FULLSCREEN);
    }
    if (!__privateGet(this, _eventAbortController)) {
      __privateSet(this, _eventAbortController, new AbortController());
      (_b = this._eventBus) == null ? void 0 : _b._on("presentationmodechanged", (evt) => {
        __privateMethod(this, _AnnotationLayerBuilder_instances, updatePresentationModeState_fn).call(this, evt.state);
      }, {
        signal: __privateGet(this, _eventAbortController).signal
      });
    }
  }
  cancel() {
    var _a;
    this._cancelled = true;
    (_a = __privateGet(this, _eventAbortController)) == null ? void 0 : _a.abort();
    __privateSet(this, _eventAbortController, null);
  }
  hide() {
    if (!this.div) {
      return;
    }
    this.div.hidden = true;
  }
}
_onAppend = new WeakMap();
_eventAbortController = new WeakMap();
_AnnotationLayerBuilder_instances = new WeakSet();
updatePresentationModeState_fn = function(state) {
  if (!this.div) {
    return;
  }
  let disableFormElements = false;
  switch (state) {
    case PresentationModeState.FULLSCREEN:
      disableFormElements = true;
      break;
    case PresentationModeState.NORMAL:
      break;
    default:
      return;
  }
  for (const section of this.div.childNodes) {
    if (section.hasAttribute("data-internal-link")) {
      continue;
    }
    section.inert = disableFormElements;
  }
};
function download(blobUrl, filename) {
  const a = document.createElement("a");
  if (!a.click) {
    throw new Error('DownloadManager: "a.click()" is not supported.');
  }
  a.href = blobUrl;
  a.target = "_parent";
  if ("download" in a) {
    a.download = filename;
  }
  (document.body || document.documentElement).append(a);
  a.click();
  a.remove();
}
class DownloadManager {
  constructor() {
    __privateAdd(this, _openBlobUrls, /* @__PURE__ */ new WeakMap());
  }
  downloadData(data, filename, contentType) {
    const blobUrl = URL.createObjectURL(new Blob([data], {
      type: contentType
    }));
    download(blobUrl, filename);
  }
  openOrDownloadData(data, filename, dest = null) {
    const isPdfData = isPdfFile(filename);
    const contentType = isPdfData ? "application/pdf" : "";
    this.downloadData(data, filename, contentType);
    return false;
  }
  download(data, url, filename, _options) {
    let blobUrl;
    if (data) {
      blobUrl = URL.createObjectURL(new Blob([data], {
        type: "application/pdf"
      }));
    } else {
      if (!createValidAbsoluteUrl(url, "http://example.com")) {
        console.error(`download - not a valid URL: ${url}`);
        return;
      }
      blobUrl = url + "#pdfjs.action=download";
    }
    download(blobUrl, filename);
  }
}
_openBlobUrls = new WeakMap();
const WaitOnType = {
  EVENT: "event",
  TIMEOUT: "timeout"
};
async function waitOnEventOrTimeout({
  target,
  name,
  delay = 0
}) {
  if (typeof target !== "object" || !(name && typeof name === "string") || !(Number.isInteger(delay) && delay >= 0)) {
    throw new Error("waitOnEventOrTimeout - invalid parameters.");
  }
  const {
    promise,
    resolve
  } = Promise.withResolvers();
  const ac = new AbortController();
  function handler(type) {
    ac.abort();
    clearTimeout(timeout);
    resolve(type);
  }
  const evtMethod = target instanceof EventBus ? "_on" : "addEventListener";
  target[evtMethod](name, handler.bind(null, WaitOnType.EVENT), {
    signal: ac.signal
  });
  const timeout = setTimeout(handler.bind(null, WaitOnType.TIMEOUT), delay);
  return promise;
}
class EventBus {
  constructor() {
    __privateAdd(this, _listeners, /* @__PURE__ */ Object.create(null));
  }
  on(eventName, listener, options = null) {
    this._on(eventName, listener, {
      external: true,
      once: options == null ? void 0 : options.once,
      signal: options == null ? void 0 : options.signal
    });
  }
  off(eventName, listener, options = null) {
    this._off(eventName, listener);
  }
  dispatch(eventName, data) {
    const eventListeners = __privateGet(this, _listeners)[eventName];
    if (!eventListeners || eventListeners.length === 0) {
      return;
    }
    let externalListeners;
    for (const {
      listener,
      external,
      once
    } of eventListeners.slice(0)) {
      if (once) {
        this._off(eventName, listener);
      }
      if (external) {
        (externalListeners || (externalListeners = [])).push(listener);
        continue;
      }
      listener(data);
    }
    if (externalListeners) {
      for (const listener of externalListeners) {
        listener(data);
      }
      externalListeners = null;
    }
  }
  _on(eventName, listener, options = null) {
    var _a;
    let rmAbort = null;
    if ((options == null ? void 0 : options.signal) instanceof AbortSignal) {
      const {
        signal
      } = options;
      if (signal.aborted) {
        console.error("Cannot use an `aborted` signal.");
        return;
      }
      const onAbort = () => this._off(eventName, listener);
      rmAbort = () => signal.removeEventListener("abort", onAbort);
      signal.addEventListener("abort", onAbort);
    }
    const eventListeners = (_a = __privateGet(this, _listeners))[eventName] || (_a[eventName] = []);
    eventListeners.push({
      listener,
      external: (options == null ? void 0 : options.external) === true,
      once: (options == null ? void 0 : options.once) === true,
      rmAbort
    });
  }
  _off(eventName, listener, options = null) {
    var _a;
    const eventListeners = __privateGet(this, _listeners)[eventName];
    if (!eventListeners) {
      return;
    }
    for (let i = 0, ii = eventListeners.length; i < ii; i++) {
      const evt = eventListeners[i];
      if (evt.listener === listener) {
        (_a = evt.rmAbort) == null ? void 0 : _a.call(evt);
        eventListeners.splice(i, 1);
        return;
      }
    }
  }
}
_listeners = new WeakMap();
class FluentType {
  constructor(value) {
    this.value = value;
  }
  valueOf() {
    return this.value;
  }
}
class FluentNone extends FluentType {
  constructor(value = "???") {
    super(value);
  }
  toString(scope) {
    return `{${this.value}}`;
  }
}
class FluentNumber extends FluentType {
  constructor(value, opts = {}) {
    super(value);
    this.opts = opts;
  }
  toString(scope) {
    try {
      const nf = scope.memoizeIntlObject(Intl.NumberFormat, this.opts);
      return nf.format(this.value);
    } catch (err) {
      scope.reportError(err);
      return this.value.toString(10);
    }
  }
}
class FluentDateTime extends FluentType {
  constructor(value, opts = {}) {
    super(value);
    this.opts = opts;
  }
  toString(scope) {
    try {
      const dtf = scope.memoizeIntlObject(Intl.DateTimeFormat, this.opts);
      return dtf.format(this.value);
    } catch (err) {
      scope.reportError(err);
      return new Date(this.value).toISOString();
    }
  }
}
const MAX_PLACEABLES = 100;
const FSI = "⁨";
const PDI = "⁩";
function match(scope, selector, key) {
  if (key === selector) {
    return true;
  }
  if (key instanceof FluentNumber && selector instanceof FluentNumber && key.value === selector.value) {
    return true;
  }
  if (selector instanceof FluentNumber && typeof key === "string") {
    let category = scope.memoizeIntlObject(Intl.PluralRules, selector.opts).select(selector.value);
    if (key === category) {
      return true;
    }
  }
  return false;
}
function getDefault(scope, variants, star) {
  if (variants[star]) {
    return resolvePattern(scope, variants[star].value);
  }
  scope.reportError(new RangeError("No default"));
  return new FluentNone();
}
function getArguments(scope, args) {
  const positional = [];
  const named = /* @__PURE__ */ Object.create(null);
  for (const arg of args) {
    if (arg.type === "narg") {
      named[arg.name] = resolveExpression(scope, arg.value);
    } else {
      positional.push(resolveExpression(scope, arg));
    }
  }
  return {
    positional,
    named
  };
}
function resolveExpression(scope, expr) {
  switch (expr.type) {
    case "str":
      return expr.value;
    case "num":
      return new FluentNumber(expr.value, {
        minimumFractionDigits: expr.precision
      });
    case "var":
      return resolveVariableReference(scope, expr);
    case "mesg":
      return resolveMessageReference(scope, expr);
    case "term":
      return resolveTermReference(scope, expr);
    case "func":
      return resolveFunctionReference(scope, expr);
    case "select":
      return resolveSelectExpression(scope, expr);
    default:
      return new FluentNone();
  }
}
function resolveVariableReference(scope, {
  name
}) {
  let arg;
  if (scope.params) {
    if (Object.prototype.hasOwnProperty.call(scope.params, name)) {
      arg = scope.params[name];
    } else {
      return new FluentNone(`$${name}`);
    }
  } else if (scope.args && Object.prototype.hasOwnProperty.call(scope.args, name)) {
    arg = scope.args[name];
  } else {
    scope.reportError(new ReferenceError(`Unknown variable: $${name}`));
    return new FluentNone(`$${name}`);
  }
  if (arg instanceof FluentType) {
    return arg;
  }
  switch (typeof arg) {
    case "string":
      return arg;
    case "number":
      return new FluentNumber(arg);
    case "object":
      if (arg instanceof Date) {
        return new FluentDateTime(arg.getTime());
      }
    default:
      scope.reportError(new TypeError(`Variable type not supported: $${name}, ${typeof arg}`));
      return new FluentNone(`$${name}`);
  }
}
function resolveMessageReference(scope, {
  name,
  attr
}) {
  const message = scope.bundle._messages.get(name);
  if (!message) {
    scope.reportError(new ReferenceError(`Unknown message: ${name}`));
    return new FluentNone(name);
  }
  if (attr) {
    const attribute = message.attributes[attr];
    if (attribute) {
      return resolvePattern(scope, attribute);
    }
    scope.reportError(new ReferenceError(`Unknown attribute: ${attr}`));
    return new FluentNone(`${name}.${attr}`);
  }
  if (message.value) {
    return resolvePattern(scope, message.value);
  }
  scope.reportError(new ReferenceError(`No value: ${name}`));
  return new FluentNone(name);
}
function resolveTermReference(scope, {
  name,
  attr,
  args
}) {
  const id = `-${name}`;
  const term = scope.bundle._terms.get(id);
  if (!term) {
    scope.reportError(new ReferenceError(`Unknown term: ${id}`));
    return new FluentNone(id);
  }
  if (attr) {
    const attribute = term.attributes[attr];
    if (attribute) {
      scope.params = getArguments(scope, args).named;
      const resolved2 = resolvePattern(scope, attribute);
      scope.params = null;
      return resolved2;
    }
    scope.reportError(new ReferenceError(`Unknown attribute: ${attr}`));
    return new FluentNone(`${id}.${attr}`);
  }
  scope.params = getArguments(scope, args).named;
  const resolved = resolvePattern(scope, term.value);
  scope.params = null;
  return resolved;
}
function resolveFunctionReference(scope, {
  name,
  args
}) {
  let func = scope.bundle._functions[name];
  if (!func) {
    scope.reportError(new ReferenceError(`Unknown function: ${name}()`));
    return new FluentNone(`${name}()`);
  }
  if (typeof func !== "function") {
    scope.reportError(new TypeError(`Function ${name}() is not callable`));
    return new FluentNone(`${name}()`);
  }
  try {
    let resolved = getArguments(scope, args);
    return func(resolved.positional, resolved.named);
  } catch (err) {
    scope.reportError(err);
    return new FluentNone(`${name}()`);
  }
}
function resolveSelectExpression(scope, {
  selector,
  variants,
  star
}) {
  let sel = resolveExpression(scope, selector);
  if (sel instanceof FluentNone) {
    return getDefault(scope, variants, star);
  }
  for (const variant of variants) {
    const key = resolveExpression(scope, variant.key);
    if (match(scope, sel, key)) {
      return resolvePattern(scope, variant.value);
    }
  }
  return getDefault(scope, variants, star);
}
function resolveComplexPattern(scope, ptn) {
  if (scope.dirty.has(ptn)) {
    scope.reportError(new RangeError("Cyclic reference"));
    return new FluentNone();
  }
  scope.dirty.add(ptn);
  const result = [];
  const useIsolating = scope.bundle._useIsolating && ptn.length > 1;
  for (const elem of ptn) {
    if (typeof elem === "string") {
      result.push(scope.bundle._transform(elem));
      continue;
    }
    scope.placeables++;
    if (scope.placeables > MAX_PLACEABLES) {
      scope.dirty.delete(ptn);
      throw new RangeError(`Too many placeables expanded: ${scope.placeables}, max allowed is ${MAX_PLACEABLES}`);
    }
    if (useIsolating) {
      result.push(FSI);
    }
    result.push(resolveExpression(scope, elem).toString(scope));
    if (useIsolating) {
      result.push(PDI);
    }
  }
  scope.dirty.delete(ptn);
  return result.join("");
}
function resolvePattern(scope, value) {
  if (typeof value === "string") {
    return scope.bundle._transform(value);
  }
  return resolveComplexPattern(scope, value);
}
class Scope {
  constructor(bundle, errors, args) {
    this.dirty = /* @__PURE__ */ new WeakSet();
    this.params = null;
    this.placeables = 0;
    this.bundle = bundle;
    this.errors = errors;
    this.args = args;
  }
  reportError(error) {
    if (!this.errors || !(error instanceof Error)) {
      throw error;
    }
    this.errors.push(error);
  }
  memoizeIntlObject(ctor, opts) {
    let cache2 = this.bundle._intls.get(ctor);
    if (!cache2) {
      cache2 = {};
      this.bundle._intls.set(ctor, cache2);
    }
    let id = JSON.stringify(opts);
    if (!cache2[id]) {
      cache2[id] = new ctor(this.bundle.locales, opts);
    }
    return cache2[id];
  }
}
function values(opts, allowed) {
  const unwrapped = /* @__PURE__ */ Object.create(null);
  for (const [name, opt] of Object.entries(opts)) {
    if (allowed.includes(name)) {
      unwrapped[name] = opt.valueOf();
    }
  }
  return unwrapped;
}
const NUMBER_ALLOWED = ["unitDisplay", "currencyDisplay", "useGrouping", "minimumIntegerDigits", "minimumFractionDigits", "maximumFractionDigits", "minimumSignificantDigits", "maximumSignificantDigits"];
function NUMBER(args, opts) {
  let arg = args[0];
  if (arg instanceof FluentNone) {
    return new FluentNone(`NUMBER(${arg.valueOf()})`);
  }
  if (arg instanceof FluentNumber) {
    return new FluentNumber(arg.valueOf(), {
      ...arg.opts,
      ...values(opts, NUMBER_ALLOWED)
    });
  }
  if (arg instanceof FluentDateTime) {
    return new FluentNumber(arg.valueOf(), {
      ...values(opts, NUMBER_ALLOWED)
    });
  }
  throw new TypeError("Invalid argument to NUMBER");
}
const DATETIME_ALLOWED = ["dateStyle", "timeStyle", "fractionalSecondDigits", "dayPeriod", "hour12", "weekday", "era", "year", "month", "day", "hour", "minute", "second", "timeZoneName"];
function DATETIME(args, opts) {
  let arg = args[0];
  if (arg instanceof FluentNone) {
    return new FluentNone(`DATETIME(${arg.valueOf()})`);
  }
  if (arg instanceof FluentDateTime) {
    return new FluentDateTime(arg.valueOf(), {
      ...arg.opts,
      ...values(opts, DATETIME_ALLOWED)
    });
  }
  if (arg instanceof FluentNumber) {
    return new FluentDateTime(arg.valueOf(), {
      ...values(opts, DATETIME_ALLOWED)
    });
  }
  throw new TypeError("Invalid argument to DATETIME");
}
const cache = /* @__PURE__ */ new Map();
function getMemoizerForLocale(locales) {
  const stringLocale = Array.isArray(locales) ? locales.join(" ") : locales;
  let memoizer = cache.get(stringLocale);
  if (memoizer === void 0) {
    memoizer = /* @__PURE__ */ new Map();
    cache.set(stringLocale, memoizer);
  }
  return memoizer;
}
class FluentBundle {
  constructor(locales, {
    functions,
    useIsolating = true,
    transform = (v) => v
  } = {}) {
    this._terms = /* @__PURE__ */ new Map();
    this._messages = /* @__PURE__ */ new Map();
    this.locales = Array.isArray(locales) ? locales : [locales];
    this._functions = {
      NUMBER,
      DATETIME,
      ...functions
    };
    this._useIsolating = useIsolating;
    this._transform = transform;
    this._intls = getMemoizerForLocale(locales);
  }
  hasMessage(id) {
    return this._messages.has(id);
  }
  getMessage(id) {
    return this._messages.get(id);
  }
  addResource(res, {
    allowOverrides = false
  } = {}) {
    const errors = [];
    for (let i = 0; i < res.body.length; i++) {
      let entry = res.body[i];
      if (entry.id.startsWith("-")) {
        if (allowOverrides === false && this._terms.has(entry.id)) {
          errors.push(new Error(`Attempt to override an existing term: "${entry.id}"`));
          continue;
        }
        this._terms.set(entry.id, entry);
      } else {
        if (allowOverrides === false && this._messages.has(entry.id)) {
          errors.push(new Error(`Attempt to override an existing message: "${entry.id}"`));
          continue;
        }
        this._messages.set(entry.id, entry);
      }
    }
    return errors;
  }
  formatPattern(pattern, args = null, errors = null) {
    if (typeof pattern === "string") {
      return this._transform(pattern);
    }
    let scope = new Scope(this, errors, args);
    try {
      let value = resolveComplexPattern(scope, pattern);
      return value.toString(scope);
    } catch (err) {
      if (scope.errors && err instanceof Error) {
        scope.errors.push(err);
        return new FluentNone().toString(scope);
      }
      throw err;
    }
  }
}
const RE_MESSAGE_START = /^(-?[a-zA-Z][\w-]*) *= */gm;
const RE_ATTRIBUTE_START = /\.([a-zA-Z][\w-]*) *= */y;
const RE_VARIANT_START = /\*?\[/y;
const RE_NUMBER_LITERAL = /(-?[0-9]+(?:\.([0-9]+))?)/y;
const RE_IDENTIFIER = /([a-zA-Z][\w-]*)/y;
const RE_REFERENCE = /([$-])?([a-zA-Z][\w-]*)(?:\.([a-zA-Z][\w-]*))?/y;
const RE_FUNCTION_NAME = /^[A-Z][A-Z0-9_-]*$/;
const RE_TEXT_RUN = /([^{}\n\r]+)/y;
const RE_STRING_RUN = /([^\\"\n\r]*)/y;
const RE_STRING_ESCAPE = /\\([\\"])/y;
const RE_UNICODE_ESCAPE = /\\u([a-fA-F0-9]{4})|\\U([a-fA-F0-9]{6})/y;
const RE_LEADING_NEWLINES = /^\n+/;
const RE_TRAILING_SPACES = / +$/;
const RE_BLANK_LINES = / *\r?\n/g;
const RE_INDENT = /( *)$/;
const TOKEN_BRACE_OPEN = /{\s*/y;
const TOKEN_BRACE_CLOSE = /\s*}/y;
const TOKEN_BRACKET_OPEN = /\[\s*/y;
const TOKEN_BRACKET_CLOSE = /\s*] */y;
const TOKEN_PAREN_OPEN = /\s*\(\s*/y;
const TOKEN_ARROW = /\s*->\s*/y;
const TOKEN_COLON = /\s*:\s*/y;
const TOKEN_COMMA = /\s*,?\s*/y;
const TOKEN_BLANK = /\s+/y;
class FluentResource {
  constructor(source) {
    this.body = [];
    RE_MESSAGE_START.lastIndex = 0;
    let cursor = 0;
    while (true) {
      let next = RE_MESSAGE_START.exec(source);
      if (next === null) {
        break;
      }
      cursor = RE_MESSAGE_START.lastIndex;
      try {
        this.body.push(parseMessage(next[1]));
      } catch (err) {
        if (err instanceof SyntaxError) {
          continue;
        }
        throw err;
      }
    }
    function test(re) {
      re.lastIndex = cursor;
      return re.test(source);
    }
    function consumeChar(char, errorClass) {
      if (source[cursor] === char) {
        cursor++;
        return true;
      }
      if (errorClass) {
        throw new errorClass(`Expected ${char}`);
      }
      return false;
    }
    function consumeToken(re, errorClass) {
      if (test(re)) {
        cursor = re.lastIndex;
        return true;
      }
      if (errorClass) {
        throw new errorClass(`Expected ${re.toString()}`);
      }
      return false;
    }
    function match2(re) {
      re.lastIndex = cursor;
      let result = re.exec(source);
      if (result === null) {
        throw new SyntaxError(`Expected ${re.toString()}`);
      }
      cursor = re.lastIndex;
      return result;
    }
    function match1(re) {
      return match2(re)[1];
    }
    function parseMessage(id) {
      let value = parsePattern();
      let attributes = parseAttributes();
      if (value === null && Object.keys(attributes).length === 0) {
        throw new SyntaxError("Expected message value or attributes");
      }
      return {
        id,
        value,
        attributes
      };
    }
    function parseAttributes() {
      let attrs = /* @__PURE__ */ Object.create(null);
      while (test(RE_ATTRIBUTE_START)) {
        let name = match1(RE_ATTRIBUTE_START);
        let value = parsePattern();
        if (value === null) {
          throw new SyntaxError("Expected attribute value");
        }
        attrs[name] = value;
      }
      return attrs;
    }
    function parsePattern() {
      let first;
      if (test(RE_TEXT_RUN)) {
        first = match1(RE_TEXT_RUN);
      }
      if (source[cursor] === "{" || source[cursor] === "}") {
        return parsePatternElements(first ? [first] : [], Infinity);
      }
      let indent = parseIndent();
      if (indent) {
        if (first) {
          return parsePatternElements([first, indent], indent.length);
        }
        indent.value = trim(indent.value, RE_LEADING_NEWLINES);
        return parsePatternElements([indent], indent.length);
      }
      if (first) {
        return trim(first, RE_TRAILING_SPACES);
      }
      return null;
    }
    function parsePatternElements(elements = [], commonIndent) {
      while (true) {
        if (test(RE_TEXT_RUN)) {
          elements.push(match1(RE_TEXT_RUN));
          continue;
        }
        if (source[cursor] === "{") {
          elements.push(parsePlaceable());
          continue;
        }
        if (source[cursor] === "}") {
          throw new SyntaxError("Unbalanced closing brace");
        }
        let indent = parseIndent();
        if (indent) {
          elements.push(indent);
          commonIndent = Math.min(commonIndent, indent.length);
          continue;
        }
        break;
      }
      let lastIndex = elements.length - 1;
      let lastElement = elements[lastIndex];
      if (typeof lastElement === "string") {
        elements[lastIndex] = trim(lastElement, RE_TRAILING_SPACES);
      }
      let baked = [];
      for (let element of elements) {
        if (element instanceof Indent) {
          element = element.value.slice(0, element.value.length - commonIndent);
        }
        if (element) {
          baked.push(element);
        }
      }
      return baked;
    }
    function parsePlaceable() {
      consumeToken(TOKEN_BRACE_OPEN, SyntaxError);
      let selector = parseInlineExpression();
      if (consumeToken(TOKEN_BRACE_CLOSE)) {
        return selector;
      }
      if (consumeToken(TOKEN_ARROW)) {
        let variants = parseVariants();
        consumeToken(TOKEN_BRACE_CLOSE, SyntaxError);
        return {
          type: "select",
          selector,
          ...variants
        };
      }
      throw new SyntaxError("Unclosed placeable");
    }
    function parseInlineExpression() {
      if (source[cursor] === "{") {
        return parsePlaceable();
      }
      if (test(RE_REFERENCE)) {
        let [, sigil, name, attr = null] = match2(RE_REFERENCE);
        if (sigil === "$") {
          return {
            type: "var",
            name
          };
        }
        if (consumeToken(TOKEN_PAREN_OPEN)) {
          let args = parseArguments();
          if (sigil === "-") {
            return {
              type: "term",
              name,
              attr,
              args
            };
          }
          if (RE_FUNCTION_NAME.test(name)) {
            return {
              type: "func",
              name,
              args
            };
          }
          throw new SyntaxError("Function names must be all upper-case");
        }
        if (sigil === "-") {
          return {
            type: "term",
            name,
            attr,
            args: []
          };
        }
        return {
          type: "mesg",
          name,
          attr
        };
      }
      return parseLiteral();
    }
    function parseArguments() {
      let args = [];
      while (true) {
        switch (source[cursor]) {
          case ")":
            cursor++;
            return args;
          case void 0:
            throw new SyntaxError("Unclosed argument list");
        }
        args.push(parseArgument());
        consumeToken(TOKEN_COMMA);
      }
    }
    function parseArgument() {
      let expr = parseInlineExpression();
      if (expr.type !== "mesg") {
        return expr;
      }
      if (consumeToken(TOKEN_COLON)) {
        return {
          type: "narg",
          name: expr.name,
          value: parseLiteral()
        };
      }
      return expr;
    }
    function parseVariants() {
      let variants = [];
      let count = 0;
      let star;
      while (test(RE_VARIANT_START)) {
        if (consumeChar("*")) {
          star = count;
        }
        let key = parseVariantKey();
        let value = parsePattern();
        if (value === null) {
          throw new SyntaxError("Expected variant value");
        }
        variants[count++] = {
          key,
          value
        };
      }
      if (count === 0) {
        return null;
      }
      if (star === void 0) {
        throw new SyntaxError("Expected default variant");
      }
      return {
        variants,
        star
      };
    }
    function parseVariantKey() {
      consumeToken(TOKEN_BRACKET_OPEN, SyntaxError);
      let key;
      if (test(RE_NUMBER_LITERAL)) {
        key = parseNumberLiteral();
      } else {
        key = {
          type: "str",
          value: match1(RE_IDENTIFIER)
        };
      }
      consumeToken(TOKEN_BRACKET_CLOSE, SyntaxError);
      return key;
    }
    function parseLiteral() {
      if (test(RE_NUMBER_LITERAL)) {
        return parseNumberLiteral();
      }
      if (source[cursor] === '"') {
        return parseStringLiteral();
      }
      throw new SyntaxError("Invalid expression");
    }
    function parseNumberLiteral() {
      let [, value, fraction = ""] = match2(RE_NUMBER_LITERAL);
      let precision = fraction.length;
      return {
        type: "num",
        value: parseFloat(value),
        precision
      };
    }
    function parseStringLiteral() {
      consumeChar('"', SyntaxError);
      let value = "";
      while (true) {
        value += match1(RE_STRING_RUN);
        if (source[cursor] === "\\") {
          value += parseEscapeSequence();
          continue;
        }
        if (consumeChar('"')) {
          return {
            type: "str",
            value
          };
        }
        throw new SyntaxError("Unclosed string literal");
      }
    }
    function parseEscapeSequence() {
      if (test(RE_STRING_ESCAPE)) {
        return match1(RE_STRING_ESCAPE);
      }
      if (test(RE_UNICODE_ESCAPE)) {
        let [, codepoint4, codepoint6] = match2(RE_UNICODE_ESCAPE);
        let codepoint = parseInt(codepoint4 || codepoint6, 16);
        return codepoint <= 55295 || 57344 <= codepoint ? String.fromCodePoint(codepoint) : "�";
      }
      throw new SyntaxError("Unknown escape sequence");
    }
    function parseIndent() {
      let start = cursor;
      consumeToken(TOKEN_BLANK);
      switch (source[cursor]) {
        case ".":
        case "[":
        case "*":
        case "}":
        case void 0:
          return false;
        case "{":
          return makeIndent(source.slice(start, cursor));
      }
      if (source[cursor - 1] === " ") {
        return makeIndent(source.slice(start, cursor));
      }
      return false;
    }
    function trim(text, re) {
      return text.replace(re, "");
    }
    function makeIndent(blank) {
      let value = blank.replace(RE_BLANK_LINES, "\n");
      let length = RE_INDENT.exec(blank)[1].length;
      return new Indent(value, length);
    }
  }
}
class Indent {
  constructor(value, length) {
    this.value = value;
    this.length = length;
  }
}
const reOverlay = /<|&#?\w+;/;
const TEXT_LEVEL_ELEMENTS = {
  "http://www.w3.org/1999/xhtml": ["em", "strong", "small", "s", "cite", "q", "dfn", "abbr", "data", "time", "code", "var", "samp", "kbd", "sub", "sup", "i", "b", "u", "mark", "bdi", "bdo", "span", "br", "wbr"]
};
const LOCALIZABLE_ATTRIBUTES = {
  "http://www.w3.org/1999/xhtml": {
    global: ["title", "aria-label", "aria-valuetext"],
    a: ["download"],
    area: ["download", "alt"],
    input: ["alt", "placeholder"],
    menuitem: ["label"],
    menu: ["label"],
    optgroup: ["label"],
    option: ["label"],
    track: ["label"],
    img: ["alt"],
    textarea: ["placeholder"],
    th: ["abbr"]
  },
  "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul": {
    global: ["accesskey", "aria-label", "aria-valuetext", "label", "title", "tooltiptext"],
    description: ["value"],
    key: ["key", "keycode"],
    label: ["value"],
    textbox: ["placeholder", "value"]
  }
};
function translateElement(element, translation) {
  const {
    value
  } = translation;
  if (typeof value === "string") {
    if (element.localName === "title" && element.namespaceURI === "http://www.w3.org/1999/xhtml") {
      element.textContent = value;
    } else if (!reOverlay.test(value)) {
      element.textContent = value;
    } else {
      const templateElement = element.ownerDocument.createElementNS("http://www.w3.org/1999/xhtml", "template");
      templateElement.innerHTML = value;
      overlayChildNodes(templateElement.content, element);
    }
  }
  overlayAttributes(translation, element);
}
function overlayChildNodes(fromFragment, toElement) {
  for (const childNode of fromFragment.childNodes) {
    if (childNode.nodeType === childNode.TEXT_NODE) {
      continue;
    }
    if (childNode.hasAttribute("data-l10n-name")) {
      const sanitized = getNodeForNamedElement(toElement, childNode);
      fromFragment.replaceChild(sanitized, childNode);
      continue;
    }
    if (isElementAllowed(childNode)) {
      const sanitized = createSanitizedElement(childNode);
      fromFragment.replaceChild(sanitized, childNode);
      continue;
    }
    console.warn(`An element of forbidden type "${childNode.localName}" was found in the translation. Only safe text-level elements and elements with data-l10n-name are allowed.`);
    fromFragment.replaceChild(createTextNodeFromTextContent(childNode), childNode);
  }
  toElement.textContent = "";
  toElement.appendChild(fromFragment);
}
function hasAttribute(attributes, name) {
  if (!attributes) {
    return false;
  }
  for (let attr of attributes) {
    if (attr.name === name) {
      return true;
    }
  }
  return false;
}
function overlayAttributes(fromElement, toElement) {
  const explicitlyAllowed = toElement.hasAttribute("data-l10n-attrs") ? toElement.getAttribute("data-l10n-attrs").split(",").map((i) => i.trim()) : null;
  for (const attr of Array.from(toElement.attributes)) {
    if (isAttrNameLocalizable(attr.name, toElement, explicitlyAllowed) && !hasAttribute(fromElement.attributes, attr.name)) {
      toElement.removeAttribute(attr.name);
    }
  }
  if (!fromElement.attributes) {
    return;
  }
  for (const attr of Array.from(fromElement.attributes)) {
    if (isAttrNameLocalizable(attr.name, toElement, explicitlyAllowed) && toElement.getAttribute(attr.name) !== attr.value) {
      toElement.setAttribute(attr.name, attr.value);
    }
  }
}
function getNodeForNamedElement(sourceElement, translatedChild) {
  const childName = translatedChild.getAttribute("data-l10n-name");
  const sourceChild = sourceElement.querySelector(`[data-l10n-name="${childName}"]`);
  if (!sourceChild) {
    console.warn(`An element named "${childName}" wasn't found in the source.`);
    return createTextNodeFromTextContent(translatedChild);
  }
  if (sourceChild.localName !== translatedChild.localName) {
    console.warn(`An element named "${childName}" was found in the translation but its type ${translatedChild.localName} didn't match the element found in the source (${sourceChild.localName}).`);
    return createTextNodeFromTextContent(translatedChild);
  }
  sourceElement.removeChild(sourceChild);
  const clone = sourceChild.cloneNode(false);
  return shallowPopulateUsing(translatedChild, clone);
}
function createSanitizedElement(element) {
  const clone = element.ownerDocument.createElement(element.localName);
  return shallowPopulateUsing(element, clone);
}
function createTextNodeFromTextContent(element) {
  return element.ownerDocument.createTextNode(element.textContent);
}
function isElementAllowed(element) {
  const allowed = TEXT_LEVEL_ELEMENTS[element.namespaceURI];
  return allowed && allowed.includes(element.localName);
}
function isAttrNameLocalizable(name, element, explicitlyAllowed = null) {
  if (explicitlyAllowed && explicitlyAllowed.includes(name)) {
    return true;
  }
  const allowed = LOCALIZABLE_ATTRIBUTES[element.namespaceURI];
  if (!allowed) {
    return false;
  }
  const attrName = name.toLowerCase();
  const elemName = element.localName;
  if (allowed.global.includes(attrName)) {
    return true;
  }
  if (!allowed[elemName]) {
    return false;
  }
  if (allowed[elemName].includes(attrName)) {
    return true;
  }
  if (element.namespaceURI === "http://www.w3.org/1999/xhtml" && elemName === "input" && attrName === "value") {
    const type = element.type.toLowerCase();
    if (type === "submit" || type === "button" || type === "reset") {
      return true;
    }
  }
  return false;
}
function shallowPopulateUsing(fromElement, toElement) {
  toElement.textContent = fromElement.textContent;
  overlayAttributes(fromElement, toElement);
  return toElement;
}
class CachedIterable extends Array {
  static from(iterable) {
    if (iterable instanceof this) {
      return iterable;
    }
    return new this(iterable);
  }
}
class CachedAsyncIterable extends CachedIterable {
  constructor(iterable) {
    super();
    if (Symbol.asyncIterator in Object(iterable)) {
      this.iterator = iterable[Symbol.asyncIterator]();
    } else if (Symbol.iterator in Object(iterable)) {
      this.iterator = iterable[Symbol.iterator]();
    } else {
      throw new TypeError("Argument must implement the iteration protocol.");
    }
  }
  [Symbol.asyncIterator]() {
    const cached = this;
    let cur = 0;
    return {
      async next() {
        if (cached.length <= cur) {
          cached.push(cached.iterator.next());
        }
        return cached[cur++];
      }
    };
  }
  async touchNext(count = 1) {
    let idx = 0;
    while (idx++ < count) {
      const last = this[this.length - 1];
      if (last && (await last).done) {
        break;
      }
      this.push(this.iterator.next());
    }
    return this[this.length - 1];
  }
}
class Localization {
  constructor(resourceIds = [], generateBundles) {
    this.resourceIds = resourceIds;
    this.generateBundles = generateBundles;
    this.onChange(true);
  }
  addResourceIds(resourceIds, eager = false) {
    this.resourceIds.push(...resourceIds);
    this.onChange(eager);
    return this.resourceIds.length;
  }
  removeResourceIds(resourceIds) {
    this.resourceIds = this.resourceIds.filter((r) => !resourceIds.includes(r));
    this.onChange();
    return this.resourceIds.length;
  }
  async formatWithFallback(keys, method) {
    const translations = [];
    let hasAtLeastOneBundle = false;
    for await (const bundle of this.bundles) {
      hasAtLeastOneBundle = true;
      const missingIds = keysFromBundle(method, bundle, keys, translations);
      if (missingIds.size === 0) {
        break;
      }
      if (typeof console !== "undefined") {
        const locale = bundle.locales[0];
        const ids = Array.from(missingIds).join(", ");
        console.warn(`[fluent] Missing translations in ${locale}: ${ids}`);
      }
    }
    if (!hasAtLeastOneBundle && typeof console !== "undefined") {
      console.warn(`[fluent] Request for keys failed because no resource bundles got generated.
  keys: ${JSON.stringify(keys)}.
  resourceIds: ${JSON.stringify(this.resourceIds)}.`);
    }
    return translations;
  }
  formatMessages(keys) {
    return this.formatWithFallback(keys, messageFromBundle);
  }
  formatValues(keys) {
    return this.formatWithFallback(keys, valueFromBundle);
  }
  async formatValue(id, args) {
    const [val] = await this.formatValues([{
      id,
      args
    }]);
    return val;
  }
  handleEvent() {
    this.onChange();
  }
  onChange(eager = false) {
    this.bundles = CachedAsyncIterable.from(this.generateBundles(this.resourceIds));
    if (eager) {
      this.bundles.touchNext(2);
    }
  }
}
function valueFromBundle(bundle, errors, message, args) {
  if (message.value) {
    return bundle.formatPattern(message.value, args, errors);
  }
  return null;
}
function messageFromBundle(bundle, errors, message, args) {
  const formatted = {
    value: null,
    attributes: null
  };
  if (message.value) {
    formatted.value = bundle.formatPattern(message.value, args, errors);
  }
  let attrNames = Object.keys(message.attributes);
  if (attrNames.length > 0) {
    formatted.attributes = new Array(attrNames.length);
    for (let [i, name] of attrNames.entries()) {
      let value = bundle.formatPattern(message.attributes[name], args, errors);
      formatted.attributes[i] = {
        name,
        value
      };
    }
  }
  return formatted;
}
function keysFromBundle(method, bundle, keys, translations) {
  const messageErrors = [];
  const missingIds = /* @__PURE__ */ new Set();
  keys.forEach(({
    id,
    args
  }, i) => {
    if (translations[i] !== void 0) {
      return;
    }
    let message = bundle.getMessage(id);
    if (message) {
      messageErrors.length = 0;
      translations[i] = method(bundle, messageErrors, message, args);
      if (messageErrors.length > 0 && typeof console !== "undefined") {
        const locale = bundle.locales[0];
        const errors = messageErrors.join(", ");
        console.warn(`[fluent][resolver] errors in ${locale}/${id}: ${errors}.`);
      }
    } else {
      missingIds.add(id);
    }
  });
  return missingIds;
}
const L10NID_ATTR_NAME = "data-l10n-id";
const L10NARGS_ATTR_NAME = "data-l10n-args";
const L10N_ELEMENT_QUERY = `[${L10NID_ATTR_NAME}]`;
class DOMLocalization extends Localization {
  constructor(resourceIds, generateBundles) {
    super(resourceIds, generateBundles);
    this.roots = /* @__PURE__ */ new Set();
    this.pendingrAF = null;
    this.pendingElements = /* @__PURE__ */ new Set();
    this.windowElement = null;
    this.mutationObserver = null;
    this.observerConfig = {
      attributes: true,
      characterData: false,
      childList: true,
      subtree: true,
      attributeFilter: [L10NID_ATTR_NAME, L10NARGS_ATTR_NAME]
    };
  }
  onChange(eager = false) {
    super.onChange(eager);
    if (this.roots) {
      this.translateRoots();
    }
  }
  setAttributes(element, id, args) {
    element.setAttribute(L10NID_ATTR_NAME, id);
    if (args) {
      element.setAttribute(L10NARGS_ATTR_NAME, JSON.stringify(args));
    } else {
      element.removeAttribute(L10NARGS_ATTR_NAME);
    }
    return element;
  }
  getAttributes(element) {
    return {
      id: element.getAttribute(L10NID_ATTR_NAME),
      args: JSON.parse(element.getAttribute(L10NARGS_ATTR_NAME) || null)
    };
  }
  connectRoot(newRoot) {
    for (const root of this.roots) {
      if (root === newRoot || root.contains(newRoot) || newRoot.contains(root)) {
        throw new Error("Cannot add a root that overlaps with existing root.");
      }
    }
    if (this.windowElement) {
      if (this.windowElement !== newRoot.ownerDocument.defaultView) {
        throw new Error(`Cannot connect a root:
          DOMLocalization already has a root from a different window.`);
      }
    } else {
      this.windowElement = newRoot.ownerDocument.defaultView;
      this.mutationObserver = new this.windowElement.MutationObserver((mutations) => this.translateMutations(mutations));
    }
    this.roots.add(newRoot);
    this.mutationObserver.observe(newRoot, this.observerConfig);
  }
  disconnectRoot(root) {
    this.roots.delete(root);
    this.pauseObserving();
    if (this.roots.size === 0) {
      this.mutationObserver = null;
      if (this.windowElement && this.pendingrAF) {
        this.windowElement.cancelAnimationFrame(this.pendingrAF);
      }
      this.windowElement = null;
      this.pendingrAF = null;
      this.pendingElements.clear();
      return true;
    }
    this.resumeObserving();
    return false;
  }
  translateRoots() {
    const roots = Array.from(this.roots);
    return Promise.all(roots.map((root) => this.translateFragment(root)));
  }
  pauseObserving() {
    if (!this.mutationObserver) {
      return;
    }
    this.translateMutations(this.mutationObserver.takeRecords());
    this.mutationObserver.disconnect();
  }
  resumeObserving() {
    if (!this.mutationObserver) {
      return;
    }
    for (const root of this.roots) {
      this.mutationObserver.observe(root, this.observerConfig);
    }
  }
  translateMutations(mutations) {
    for (const mutation of mutations) {
      switch (mutation.type) {
        case "attributes":
          if (mutation.target.hasAttribute("data-l10n-id")) {
            this.pendingElements.add(mutation.target);
          }
          break;
        case "childList":
          for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeType === addedNode.ELEMENT_NODE) {
              if (addedNode.childElementCount) {
                for (const element of this.getTranslatables(addedNode)) {
                  this.pendingElements.add(element);
                }
              } else if (addedNode.hasAttribute(L10NID_ATTR_NAME)) {
                this.pendingElements.add(addedNode);
              }
            }
          }
          break;
      }
    }
    if (this.pendingElements.size > 0) {
      if (this.pendingrAF === null) {
        this.pendingrAF = this.windowElement.requestAnimationFrame(() => {
          this.translateElements(Array.from(this.pendingElements));
          this.pendingElements.clear();
          this.pendingrAF = null;
        });
      }
    }
  }
  translateFragment(frag) {
    return this.translateElements(this.getTranslatables(frag));
  }
  async translateElements(elements) {
    if (!elements.length) {
      return void 0;
    }
    const keys = elements.map(this.getKeysForElement);
    const translations = await this.formatMessages(keys);
    return this.applyTranslations(elements, translations);
  }
  applyTranslations(elements, translations) {
    this.pauseObserving();
    for (let i = 0; i < elements.length; i++) {
      if (translations[i] !== void 0) {
        translateElement(elements[i], translations[i]);
      }
    }
    this.resumeObserving();
  }
  getTranslatables(element) {
    const nodes = Array.from(element.querySelectorAll(L10N_ELEMENT_QUERY));
    if (typeof element.hasAttribute === "function" && element.hasAttribute(L10NID_ATTR_NAME)) {
      nodes.push(element);
    }
    return nodes;
  }
  getKeysForElement(element) {
    return {
      id: element.getAttribute(L10NID_ATTR_NAME),
      args: JSON.parse(element.getAttribute(L10NARGS_ATTR_NAME) || null)
    };
  }
}
const _L10n = class _L10n {
  constructor({
    lang,
    isRTL
  }, l10n = null) {
    __privateAdd(this, _dir);
    __privateAdd(this, _elements, /* @__PURE__ */ new Set());
    __privateAdd(this, _lang);
    __privateAdd(this, _l10n);
    var _a, _b;
    __privateSet(this, _lang, __privateMethod(_a = _L10n, _L10n_static, fixupLangCode_fn).call(_a, lang));
    __privateSet(this, _l10n, l10n);
    __privateSet(this, _dir, isRTL ?? __privateMethod(_b = _L10n, _L10n_static, isRTL_fn).call(_b, __privateGet(this, _lang)) ? "rtl" : "ltr");
  }
  _setL10n(l10n) {
    __privateSet(this, _l10n, l10n);
  }
  getLanguage() {
    return __privateGet(this, _lang);
  }
  getDirection() {
    return __privateGet(this, _dir);
  }
  async get(ids, args = null, fallback) {
    if (Array.isArray(ids)) {
      ids = ids.map((id) => ({
        id
      }));
      const messages2 = await __privateGet(this, _l10n).formatMessages(ids);
      return messages2.map((message) => message.value);
    }
    const messages = await __privateGet(this, _l10n).formatMessages([{
      id: ids,
      args
    }]);
    return (messages == null ? void 0 : messages[0].value) || fallback;
  }
  async translate(element) {
    __privateGet(this, _elements).add(element);
    try {
      __privateGet(this, _l10n).connectRoot(element);
      await __privateGet(this, _l10n).translateRoots();
    } catch {
    }
  }
  async destroy() {
    for (const element of __privateGet(this, _elements)) {
      __privateGet(this, _l10n).disconnectRoot(element);
    }
    __privateGet(this, _elements).clear();
    __privateGet(this, _l10n).pauseObserving();
  }
  pause() {
    __privateGet(this, _l10n).pauseObserving();
  }
  resume() {
    __privateGet(this, _l10n).resumeObserving();
  }
};
_dir = new WeakMap();
_elements = new WeakMap();
_lang = new WeakMap();
_l10n = new WeakMap();
_L10n_static = new WeakSet();
fixupLangCode_fn = function(langCode) {
  langCode = (langCode == null ? void 0 : langCode.toLowerCase()) || "en-us";
  const PARTIAL_LANG_CODES = {
    en: "en-us",
    es: "es-es",
    fy: "fy-nl",
    ga: "ga-ie",
    gu: "gu-in",
    hi: "hi-in",
    hy: "hy-am",
    nb: "nb-no",
    ne: "ne-np",
    nn: "nn-no",
    pa: "pa-in",
    pt: "pt-pt",
    sv: "sv-se",
    zh: "zh-cn"
  };
  return PARTIAL_LANG_CODES[langCode] || langCode;
};
isRTL_fn = function(lang) {
  const shortCode = lang.split("-", 1)[0];
  return ["ar", "he", "fa", "ps", "ur"].includes(shortCode);
};
__privateAdd(_L10n, _L10n_static);
let L10n = _L10n;
function createBundle(lang, text) {
  const resource = new FluentResource(text);
  const bundle = new FluentBundle(lang);
  const errors = bundle.addResource(resource);
  if (errors.length) {
    console.error("L10n errors", errors);
  }
  return bundle;
}
const _genericl10n_GenericL10n = class _genericl10n_GenericL10n extends L10n {
  constructor(lang) {
    super({
      lang
    });
    const generateBundles = !lang ? __privateMethod(_genericl10n_GenericL10n, _genericl10n_GenericL10n_static, generateBundlesFallback_fn).bind(_genericl10n_GenericL10n, this.getLanguage()) : __privateMethod(_genericl10n_GenericL10n, _genericl10n_GenericL10n_static, generateBundles_fn).bind(_genericl10n_GenericL10n, "en-us", this.getLanguage());
    this._setL10n(new DOMLocalization([], generateBundles));
  }
};
_genericl10n_GenericL10n_static = new WeakSet();
generateBundles_fn = async function* (defaultLang, baseLang) {
  const {
    baseURL,
    paths
  } = await __privateMethod(this, _genericl10n_GenericL10n_static, getPaths_fn).call(this);
  const langs = [baseLang];
  if (defaultLang !== baseLang) {
    const shortLang = baseLang.split("-", 1)[0];
    if (shortLang !== baseLang) {
      langs.push(shortLang);
    }
    langs.push(defaultLang);
  }
  for (const lang of langs) {
    const bundle = await __privateMethod(this, _genericl10n_GenericL10n_static, createBundle_fn).call(this, lang, baseURL, paths);
    if (bundle) {
      yield bundle;
    } else if (lang === "en-us") {
      yield __privateMethod(this, _genericl10n_GenericL10n_static, createBundleFallback_fn).call(this, lang);
    }
  }
};
createBundle_fn = async function(lang, baseURL, paths) {
  const path = paths[lang];
  if (!path) {
    return null;
  }
  const url = new URL(path, baseURL);
  const text = await fetchData(url, "text");
  return createBundle(lang, text);
};
getPaths_fn = async function() {
  try {
    const {
      href
    } = document.querySelector(`link[type="application/l10n"]`);
    const paths = await fetchData(href, "json");
    return {
      baseURL: href.replace(/[^/]*$/, "") || "./",
      paths
    };
  } catch {
  }
  return {
    baseURL: "./",
    paths: /* @__PURE__ */ Object.create(null)
  };
};
generateBundlesFallback_fn = async function* (lang) {
  yield __privateMethod(this, _genericl10n_GenericL10n_static, createBundleFallback_fn).call(this, lang);
};
createBundleFallback_fn = async function(lang) {
  const text = "pdfjs-previous-button =\n    .title = Previous Page\npdfjs-previous-button-label = Previous\npdfjs-next-button =\n    .title = Next Page\npdfjs-next-button-label = Next\npdfjs-page-input =\n    .title = Page\npdfjs-of-pages = of { $pagesCount }\npdfjs-page-of-pages = ({ $pageNumber } of { $pagesCount })\npdfjs-zoom-out-button =\n    .title = Zoom Out\npdfjs-zoom-out-button-label = Zoom Out\npdfjs-zoom-in-button =\n    .title = Zoom In\npdfjs-zoom-in-button-label = Zoom In\npdfjs-zoom-select =\n    .title = Zoom\npdfjs-presentation-mode-button =\n    .title = Switch to Presentation Mode\npdfjs-presentation-mode-button-label = Presentation Mode\npdfjs-open-file-button =\n    .title = Open File\npdfjs-open-file-button-label = Open\npdfjs-print-button =\n    .title = Print\npdfjs-print-button-label = Print\npdfjs-save-button =\n    .title = Save\npdfjs-save-button-label = Save\npdfjs-download-button =\n    .title = Download\npdfjs-download-button-label = Download\npdfjs-bookmark-button =\n    .title = Current Page (View URL from Current Page)\npdfjs-bookmark-button-label = Current Page\npdfjs-tools-button =\n    .title = Tools\npdfjs-tools-button-label = Tools\npdfjs-first-page-button =\n    .title = Go to First Page\npdfjs-first-page-button-label = Go to First Page\npdfjs-last-page-button =\n    .title = Go to Last Page\npdfjs-last-page-button-label = Go to Last Page\npdfjs-page-rotate-cw-button =\n    .title = Rotate Clockwise\npdfjs-page-rotate-cw-button-label = Rotate Clockwise\npdfjs-page-rotate-ccw-button =\n    .title = Rotate Counterclockwise\npdfjs-page-rotate-ccw-button-label = Rotate Counterclockwise\npdfjs-cursor-text-select-tool-button =\n    .title = Enable Text Selection Tool\npdfjs-cursor-text-select-tool-button-label = Text Selection Tool\npdfjs-cursor-hand-tool-button =\n    .title = Enable Hand Tool\npdfjs-cursor-hand-tool-button-label = Hand Tool\npdfjs-scroll-page-button =\n    .title = Use Page Scrolling\npdfjs-scroll-page-button-label = Page Scrolling\npdfjs-scroll-vertical-button =\n    .title = Use Vertical Scrolling\npdfjs-scroll-vertical-button-label = Vertical Scrolling\npdfjs-scroll-horizontal-button =\n    .title = Use Horizontal Scrolling\npdfjs-scroll-horizontal-button-label = Horizontal Scrolling\npdfjs-scroll-wrapped-button =\n    .title = Use Wrapped Scrolling\npdfjs-scroll-wrapped-button-label = Wrapped Scrolling\npdfjs-spread-none-button =\n    .title = Do not join page spreads\npdfjs-spread-none-button-label = No Spreads\npdfjs-spread-odd-button =\n    .title = Join page spreads starting with odd-numbered pages\npdfjs-spread-odd-button-label = Odd Spreads\npdfjs-spread-even-button =\n    .title = Join page spreads starting with even-numbered pages\npdfjs-spread-even-button-label = Even Spreads\npdfjs-document-properties-button =\n    .title = Document Properties…\npdfjs-document-properties-button-label = Document Properties…\npdfjs-document-properties-file-name = File name:\npdfjs-document-properties-file-size = File size:\npdfjs-document-properties-kb = { $size_kb } KB ({ $size_b } bytes)\npdfjs-document-properties-mb = { $size_mb } MB ({ $size_b } bytes)\npdfjs-document-properties-title = Title:\npdfjs-document-properties-author = Author:\npdfjs-document-properties-subject = Subject:\npdfjs-document-properties-keywords = Keywords:\npdfjs-document-properties-creation-date = Creation Date:\npdfjs-document-properties-modification-date = Modification Date:\npdfjs-document-properties-date-string = { $date }, { $time }\npdfjs-document-properties-creator = Creator:\npdfjs-document-properties-producer = PDF Producer:\npdfjs-document-properties-version = PDF Version:\npdfjs-document-properties-page-count = Page Count:\npdfjs-document-properties-page-size = Page Size:\npdfjs-document-properties-page-size-unit-inches = in\npdfjs-document-properties-page-size-unit-millimeters = mm\npdfjs-document-properties-page-size-orientation-portrait = portrait\npdfjs-document-properties-page-size-orientation-landscape = landscape\npdfjs-document-properties-page-size-name-a-three = A3\npdfjs-document-properties-page-size-name-a-four = A4\npdfjs-document-properties-page-size-name-letter = Letter\npdfjs-document-properties-page-size-name-legal = Legal\npdfjs-document-properties-page-size-dimension-string = { $width } × { $height } { $unit } ({ $orientation })\npdfjs-document-properties-page-size-dimension-name-string = { $width } × { $height } { $unit } ({ $name }, { $orientation })\npdfjs-document-properties-linearized = Fast Web View:\npdfjs-document-properties-linearized-yes = Yes\npdfjs-document-properties-linearized-no = No\npdfjs-document-properties-close-button = Close\npdfjs-print-progress-message = Preparing document for printing…\npdfjs-print-progress-percent = { $progress }%\npdfjs-print-progress-close-button = Cancel\npdfjs-printing-not-supported = Warning: Printing is not fully supported by this browser.\npdfjs-printing-not-ready = Warning: The PDF is not fully loaded for printing.\npdfjs-toggle-sidebar-button =\n    .title = Toggle Sidebar\npdfjs-toggle-sidebar-notification-button =\n    .title = Toggle Sidebar (document contains outline/attachments/layers)\npdfjs-toggle-sidebar-button-label = Toggle Sidebar\npdfjs-document-outline-button =\n    .title = Show Document Outline (double-click to expand/collapse all items)\npdfjs-document-outline-button-label = Document Outline\npdfjs-attachments-button =\n    .title = Show Attachments\npdfjs-attachments-button-label = Attachments\npdfjs-layers-button =\n    .title = Show Layers (double-click to reset all layers to the default state)\npdfjs-layers-button-label = Layers\npdfjs-thumbs-button =\n    .title = Show Thumbnails\npdfjs-thumbs-button-label = Thumbnails\npdfjs-current-outline-item-button =\n    .title = Find Current Outline Item\npdfjs-current-outline-item-button-label = Current Outline Item\npdfjs-findbar-button =\n    .title = Find in Document\npdfjs-findbar-button-label = Find\npdfjs-additional-layers = Additional Layers\npdfjs-thumb-page-title =\n    .title = Page { $page }\npdfjs-thumb-page-canvas =\n    .aria-label = Thumbnail of Page { $page }\npdfjs-find-input =\n    .title = Find\n    .placeholder = Find in document…\npdfjs-find-previous-button =\n    .title = Find the previous occurrence of the phrase\npdfjs-find-previous-button-label = Previous\npdfjs-find-next-button =\n    .title = Find the next occurrence of the phrase\npdfjs-find-next-button-label = Next\npdfjs-find-highlight-checkbox = Highlight All\npdfjs-find-match-case-checkbox-label = Match Case\npdfjs-find-match-diacritics-checkbox-label = Match Diacritics\npdfjs-find-entire-word-checkbox-label = Whole Words\npdfjs-find-reached-top = Reached top of document, continued from bottom\npdfjs-find-reached-bottom = Reached end of document, continued from top\npdfjs-find-match-count =\n    { $total ->\n        [one] { $current } of { $total } match\n       *[other] { $current } of { $total } matches\n    }\npdfjs-find-match-count-limit =\n    { $limit ->\n        [one] More than { $limit } match\n       *[other] More than { $limit } matches\n    }\npdfjs-find-not-found = Phrase not found\npdfjs-page-scale-width = Page Width\npdfjs-page-scale-fit = Page Fit\npdfjs-page-scale-auto = Automatic Zoom\npdfjs-page-scale-actual = Actual Size\npdfjs-page-scale-percent = { $scale }%\npdfjs-page-landmark =\n    .aria-label = Page { $page }\npdfjs-loading-error = An error occurred while loading the PDF.\npdfjs-invalid-file-error = Invalid or corrupted PDF file.\npdfjs-missing-file-error = Missing PDF file.\npdfjs-unexpected-response-error = Unexpected server response.\npdfjs-rendering-error = An error occurred while rendering the page.\npdfjs-annotation-date-string = { $date }, { $time }\npdfjs-text-annotation-type =\n    .alt = [{ $type } Annotation]\npdfjs-password-label = Enter the password to open this PDF file.\npdfjs-password-invalid = Invalid password. Please try again.\npdfjs-password-ok-button = OK\npdfjs-password-cancel-button = Cancel\npdfjs-web-fonts-disabled = Web fonts are disabled: unable to use embedded PDF fonts.\npdfjs-editor-free-text-button =\n    .title = Text\npdfjs-editor-free-text-button-label = Text\npdfjs-editor-ink-button =\n    .title = Draw\npdfjs-editor-ink-button-label = Draw\npdfjs-editor-stamp-button =\n    .title = Add or edit images\npdfjs-editor-stamp-button-label = Add or edit images\npdfjs-editor-highlight-button =\n    .title = Highlight\npdfjs-editor-highlight-button-label = Highlight\npdfjs-highlight-floating-button1 =\n    .title = Highlight\n    .aria-label = Highlight\npdfjs-highlight-floating-button-label = Highlight\npdfjs-editor-remove-ink-button =\n    .title = Remove drawing\npdfjs-editor-remove-freetext-button =\n    .title = Remove text\npdfjs-editor-remove-stamp-button =\n    .title = Remove image\npdfjs-editor-remove-highlight-button =\n    .title = Remove highlight\npdfjs-editor-free-text-color-input = Color\npdfjs-editor-free-text-size-input = Size\npdfjs-editor-ink-color-input = Color\npdfjs-editor-ink-thickness-input = Thickness\npdfjs-editor-ink-opacity-input = Opacity\npdfjs-editor-stamp-add-image-button =\n    .title = Add image\npdfjs-editor-stamp-add-image-button-label = Add image\npdfjs-editor-free-highlight-thickness-input = Thickness\npdfjs-editor-free-highlight-thickness-title =\n    .title = Change thickness when highlighting items other than text\npdfjs-free-text =\n    .aria-label = Text Editor\npdfjs-free-text-default-content = Start typing…\npdfjs-ink =\n    .aria-label = Draw Editor\npdfjs-ink-canvas =\n    .aria-label = User-created image\npdfjs-editor-alt-text-button-label = Alt text\npdfjs-editor-alt-text-edit-button-label = Edit alt text\npdfjs-editor-alt-text-dialog-label = Choose an option\npdfjs-editor-alt-text-dialog-description = Alt text (alternative text) helps when people can’t see the image or when it doesn’t load.\npdfjs-editor-alt-text-add-description-label = Add a description\npdfjs-editor-alt-text-add-description-description = Aim for 1-2 sentences that describe the subject, setting, or actions.\npdfjs-editor-alt-text-mark-decorative-label = Mark as decorative\npdfjs-editor-alt-text-mark-decorative-description = This is used for ornamental images, like borders or watermarks.\npdfjs-editor-alt-text-cancel-button = Cancel\npdfjs-editor-alt-text-save-button = Save\npdfjs-editor-alt-text-decorative-tooltip = Marked as decorative\npdfjs-editor-alt-text-textarea =\n    .placeholder = For example, “A young man sits down at a table to eat a meal”\npdfjs-editor-resizer-label-top-left = Top left corner — resize\npdfjs-editor-resizer-label-top-middle = Top middle — resize\npdfjs-editor-resizer-label-top-right = Top right corner — resize\npdfjs-editor-resizer-label-middle-right = Middle right — resize\npdfjs-editor-resizer-label-bottom-right = Bottom right corner — resize\npdfjs-editor-resizer-label-bottom-middle = Bottom middle — resize\npdfjs-editor-resizer-label-bottom-left = Bottom left corner — resize\npdfjs-editor-resizer-label-middle-left = Middle left — resize\npdfjs-editor-highlight-colorpicker-label = Highlight color\npdfjs-editor-colorpicker-button =\n    .title = Change color\npdfjs-editor-colorpicker-dropdown =\n    .aria-label = Color choices\npdfjs-editor-colorpicker-yellow =\n    .title = Yellow\npdfjs-editor-colorpicker-green =\n    .title = Green\npdfjs-editor-colorpicker-blue =\n    .title = Blue\npdfjs-editor-colorpicker-pink =\n    .title = Pink\npdfjs-editor-colorpicker-red =\n    .title = Red\npdfjs-editor-highlight-show-all-button-label = Show all\npdfjs-editor-highlight-show-all-button =\n    .title = Show all";
  return createBundle(lang, text);
};
__privateAdd(_genericl10n_GenericL10n, _genericl10n_GenericL10n_static);
let genericl10n_GenericL10n = _genericl10n_GenericL10n;
const HASH_CHANGE_TIMEOUT = 1e3;
const POSITION_UPDATED_THRESHOLD = 50;
const UPDATE_VIEWAREA_TIMEOUT = 1e3;
function getCurrentHash() {
  return document.location.hash;
}
class PDFHistory {
  constructor({
    linkService,
    eventBus
  }) {
    __privateAdd(this, _PDFHistory_instances);
    __privateAdd(this, _eventAbortController2, null);
    this.linkService = linkService;
    this.eventBus = eventBus;
    this._initialized = false;
    this._fingerprint = "";
    this.reset();
    this.eventBus._on("pagesinit", () => {
      this._isPagesLoaded = false;
      this.eventBus._on("pagesloaded", (evt) => {
        this._isPagesLoaded = !!evt.pagesCount;
      }, {
        once: true
      });
    });
  }
  initialize({
    fingerprint,
    resetHistory = false,
    updateUrl = false
  }) {
    if (!fingerprint || typeof fingerprint !== "string") {
      console.error('PDFHistory.initialize: The "fingerprint" must be a non-empty string.');
      return;
    }
    if (this._initialized) {
      this.reset();
    }
    const reInitialized = this._fingerprint !== "" && this._fingerprint !== fingerprint;
    this._fingerprint = fingerprint;
    this._updateUrl = updateUrl === true;
    this._initialized = true;
    __privateMethod(this, _PDFHistory_instances, bindEvents_fn).call(this);
    const state = window.history.state;
    this._popStateInProgress = false;
    this._blockHashChange = 0;
    this._currentHash = getCurrentHash();
    this._numPositionUpdates = 0;
    this._uid = this._maxUid = 0;
    this._destination = null;
    this._position = null;
    if (!__privateMethod(this, _PDFHistory_instances, isValidState_fn).call(this, state, true) || resetHistory) {
      const {
        hash,
        page,
        rotation
      } = __privateMethod(this, _PDFHistory_instances, parseCurrentHash_fn).call(this, true);
      if (!hash || reInitialized || resetHistory) {
        __privateMethod(this, _PDFHistory_instances, pushOrReplaceState_fn).call(this, null, true);
        return;
      }
      __privateMethod(this, _PDFHistory_instances, pushOrReplaceState_fn).call(this, {
        hash,
        page,
        rotation
      }, true);
      return;
    }
    const destination = state.destination;
    __privateMethod(this, _PDFHistory_instances, updateInternalState_fn).call(this, destination, state.uid, true);
    if (destination.rotation !== void 0) {
      this._initialRotation = destination.rotation;
    }
    if (destination.dest) {
      this._initialBookmark = JSON.stringify(destination.dest);
      this._destination.page = null;
    } else if (destination.hash) {
      this._initialBookmark = destination.hash;
    } else if (destination.page) {
      this._initialBookmark = `page=${destination.page}`;
    }
  }
  reset() {
    if (this._initialized) {
      __privateMethod(this, _PDFHistory_instances, pageHide_fn).call(this);
      this._initialized = false;
      __privateMethod(this, _PDFHistory_instances, unbindEvents_fn).call(this);
    }
    if (this._updateViewareaTimeout) {
      clearTimeout(this._updateViewareaTimeout);
      this._updateViewareaTimeout = null;
    }
    this._initialBookmark = null;
    this._initialRotation = null;
  }
  push({
    namedDest = null,
    explicitDest,
    pageNumber
  }) {
    if (!this._initialized) {
      return;
    }
    if (namedDest && typeof namedDest !== "string") {
      console.error(`PDFHistory.push: "${namedDest}" is not a valid namedDest parameter.`);
      return;
    } else if (!Array.isArray(explicitDest)) {
      console.error(`PDFHistory.push: "${explicitDest}" is not a valid explicitDest parameter.`);
      return;
    } else if (!__privateMethod(this, _PDFHistory_instances, isValidPage_fn).call(this, pageNumber)) {
      if (pageNumber !== null || this._destination) {
        console.error(`PDFHistory.push: "${pageNumber}" is not a valid pageNumber parameter.`);
        return;
      }
    }
    const hash = namedDest || JSON.stringify(explicitDest);
    if (!hash) {
      return;
    }
    let forceReplace = false;
    if (this._destination && (isDestHashesEqual(this._destination.hash, hash) || isDestArraysEqual(this._destination.dest, explicitDest))) {
      if (this._destination.page) {
        return;
      }
      forceReplace = true;
    }
    if (this._popStateInProgress && !forceReplace) {
      return;
    }
    __privateMethod(this, _PDFHistory_instances, pushOrReplaceState_fn).call(this, {
      dest: explicitDest,
      hash,
      page: pageNumber,
      rotation: this.linkService.rotation
    }, forceReplace);
    if (!this._popStateInProgress) {
      this._popStateInProgress = true;
      Promise.resolve().then(() => {
        this._popStateInProgress = false;
      });
    }
  }
  pushPage(pageNumber) {
    var _a;
    if (!this._initialized) {
      return;
    }
    if (!__privateMethod(this, _PDFHistory_instances, isValidPage_fn).call(this, pageNumber)) {
      console.error(`PDFHistory.pushPage: "${pageNumber}" is not a valid page number.`);
      return;
    }
    if (((_a = this._destination) == null ? void 0 : _a.page) === pageNumber) {
      return;
    }
    if (this._popStateInProgress) {
      return;
    }
    __privateMethod(this, _PDFHistory_instances, pushOrReplaceState_fn).call(this, {
      dest: null,
      hash: `page=${pageNumber}`,
      page: pageNumber,
      rotation: this.linkService.rotation
    });
    if (!this._popStateInProgress) {
      this._popStateInProgress = true;
      Promise.resolve().then(() => {
        this._popStateInProgress = false;
      });
    }
  }
  pushCurrentPosition() {
    if (!this._initialized || this._popStateInProgress) {
      return;
    }
    __privateMethod(this, _PDFHistory_instances, tryPushCurrentPosition_fn).call(this);
  }
  back() {
    if (!this._initialized || this._popStateInProgress) {
      return;
    }
    const state = window.history.state;
    if (__privateMethod(this, _PDFHistory_instances, isValidState_fn).call(this, state) && state.uid > 0) {
      window.history.back();
    }
  }
  forward() {
    if (!this._initialized || this._popStateInProgress) {
      return;
    }
    const state = window.history.state;
    if (__privateMethod(this, _PDFHistory_instances, isValidState_fn).call(this, state) && state.uid < this._maxUid) {
      window.history.forward();
    }
  }
  get popStateInProgress() {
    return this._initialized && (this._popStateInProgress || this._blockHashChange > 0);
  }
  get initialBookmark() {
    return this._initialized ? this._initialBookmark : null;
  }
  get initialRotation() {
    return this._initialized ? this._initialRotation : null;
  }
}
_eventAbortController2 = new WeakMap();
_PDFHistory_instances = new WeakSet();
pushOrReplaceState_fn = function(destination, forceReplace = false) {
  const shouldReplace = forceReplace || !this._destination;
  const newState = {
    fingerprint: this._fingerprint,
    uid: shouldReplace ? this._uid : this._uid + 1,
    destination
  };
  __privateMethod(this, _PDFHistory_instances, updateInternalState_fn).call(this, destination, newState.uid);
  let newUrl;
  if (this._updateUrl && (destination == null ? void 0 : destination.hash)) {
    const baseUrl = document.location.href.split("#", 1)[0];
    if (!baseUrl.startsWith("file://")) {
      newUrl = `${baseUrl}#${destination.hash}`;
    }
  }
  if (shouldReplace) {
    window.history.replaceState(newState, "", newUrl);
  } else {
    window.history.pushState(newState, "", newUrl);
  }
};
tryPushCurrentPosition_fn = function(temporary = false) {
  if (!this._position) {
    return;
  }
  let position = this._position;
  if (temporary) {
    position = Object.assign(/* @__PURE__ */ Object.create(null), this._position);
    position.temporary = true;
  }
  if (!this._destination) {
    __privateMethod(this, _PDFHistory_instances, pushOrReplaceState_fn).call(this, position);
    return;
  }
  if (this._destination.temporary) {
    __privateMethod(this, _PDFHistory_instances, pushOrReplaceState_fn).call(this, position, true);
    return;
  }
  if (this._destination.hash === position.hash) {
    return;
  }
  if (!this._destination.page && this._numPositionUpdates <= POSITION_UPDATED_THRESHOLD) {
    return;
  }
  let forceReplace = false;
  if (this._destination.page >= position.first && this._destination.page <= position.page) {
    if (this._destination.dest !== void 0 || !this._destination.first) {
      return;
    }
    forceReplace = true;
  }
  __privateMethod(this, _PDFHistory_instances, pushOrReplaceState_fn).call(this, position, forceReplace);
};
isValidPage_fn = function(val) {
  return Number.isInteger(val) && val > 0 && val <= this.linkService.pagesCount;
};
isValidState_fn = function(state, checkReload = false) {
  if (!state) {
    return false;
  }
  if (state.fingerprint !== this._fingerprint) {
    if (checkReload) {
      if (typeof state.fingerprint !== "string" || state.fingerprint.length !== this._fingerprint.length) {
        return false;
      }
      const [perfEntry] = performance.getEntriesByType("navigation");
      if ((perfEntry == null ? void 0 : perfEntry.type) !== "reload") {
        return false;
      }
    } else {
      return false;
    }
  }
  if (!Number.isInteger(state.uid) || state.uid < 0) {
    return false;
  }
  if (state.destination === null || typeof state.destination !== "object") {
    return false;
  }
  return true;
};
updateInternalState_fn = function(destination, uid, removeTemporary = false) {
  if (this._updateViewareaTimeout) {
    clearTimeout(this._updateViewareaTimeout);
    this._updateViewareaTimeout = null;
  }
  if (removeTemporary && (destination == null ? void 0 : destination.temporary)) {
    delete destination.temporary;
  }
  this._destination = destination;
  this._uid = uid;
  this._maxUid = Math.max(this._maxUid, uid);
  this._numPositionUpdates = 0;
};
parseCurrentHash_fn = function(checkNameddest = false) {
  const hash = unescape(getCurrentHash()).substring(1);
  const params = parseQueryString(hash);
  const nameddest = params.get("nameddest") || "";
  let page = params.get("page") | 0;
  if (!__privateMethod(this, _PDFHistory_instances, isValidPage_fn).call(this, page) || checkNameddest && nameddest.length > 0) {
    page = null;
  }
  return {
    hash,
    page,
    rotation: this.linkService.rotation
  };
};
updateViewarea_fn = function({
  location
}) {
  if (this._updateViewareaTimeout) {
    clearTimeout(this._updateViewareaTimeout);
    this._updateViewareaTimeout = null;
  }
  this._position = {
    hash: location.pdfOpenParams.substring(1),
    page: this.linkService.page,
    first: location.pageNumber,
    rotation: location.rotation
  };
  if (this._popStateInProgress) {
    return;
  }
  if (this._isPagesLoaded && this._destination && !this._destination.page) {
    this._numPositionUpdates++;
  }
  {
    this._updateViewareaTimeout = setTimeout(() => {
      if (!this._popStateInProgress) {
        __privateMethod(this, _PDFHistory_instances, tryPushCurrentPosition_fn).call(this, true);
      }
      this._updateViewareaTimeout = null;
    }, UPDATE_VIEWAREA_TIMEOUT);
  }
};
popState_fn = function({
  state
}) {
  const newHash = getCurrentHash(), hashChanged = this._currentHash !== newHash;
  this._currentHash = newHash;
  if (!state) {
    this._uid++;
    const {
      hash,
      page,
      rotation
    } = __privateMethod(this, _PDFHistory_instances, parseCurrentHash_fn).call(this);
    __privateMethod(this, _PDFHistory_instances, pushOrReplaceState_fn).call(this, {
      hash,
      page,
      rotation
    }, true);
    return;
  }
  if (!__privateMethod(this, _PDFHistory_instances, isValidState_fn).call(this, state)) {
    return;
  }
  this._popStateInProgress = true;
  if (hashChanged) {
    this._blockHashChange++;
    waitOnEventOrTimeout({
      target: window,
      name: "hashchange",
      delay: HASH_CHANGE_TIMEOUT
    }).then(() => {
      this._blockHashChange--;
    });
  }
  const destination = state.destination;
  __privateMethod(this, _PDFHistory_instances, updateInternalState_fn).call(this, destination, state.uid, true);
  if (isValidRotation(destination.rotation)) {
    this.linkService.rotation = destination.rotation;
  }
  if (destination.dest) {
    this.linkService.goToDestination(destination.dest);
  } else if (destination.hash) {
    this.linkService.setHash(destination.hash);
  } else if (destination.page) {
    this.linkService.page = destination.page;
  }
  Promise.resolve().then(() => {
    this._popStateInProgress = false;
  });
};
pageHide_fn = function() {
  if (!this._destination || this._destination.temporary) {
    __privateMethod(this, _PDFHistory_instances, tryPushCurrentPosition_fn).call(this);
  }
};
bindEvents_fn = function() {
  if (__privateGet(this, _eventAbortController2)) {
    return;
  }
  __privateSet(this, _eventAbortController2, new AbortController());
  const {
    signal
  } = __privateGet(this, _eventAbortController2);
  this.eventBus._on("updateviewarea", __privateMethod(this, _PDFHistory_instances, updateViewarea_fn).bind(this), {
    signal
  });
  window.addEventListener("popstate", __privateMethod(this, _PDFHistory_instances, popState_fn).bind(this), {
    signal
  });
  window.addEventListener("pagehide", __privateMethod(this, _PDFHistory_instances, pageHide_fn).bind(this), {
    signal
  });
};
unbindEvents_fn = function() {
  var _a;
  (_a = __privateGet(this, _eventAbortController2)) == null ? void 0 : _a.abort();
  __privateSet(this, _eventAbortController2, null);
};
function isDestHashesEqual(destHash, pushHash) {
  if (typeof destHash !== "string" || typeof pushHash !== "string") {
    return false;
  }
  if (destHash === pushHash) {
    return true;
  }
  const nameddest = parseQueryString(destHash).get("nameddest");
  if (nameddest === pushHash) {
    return true;
  }
  return false;
}
function isDestArraysEqual(firstDest, secondDest) {
  function isEntryEqual(first, second) {
    if (typeof first !== typeof second) {
      return false;
    }
    if (Array.isArray(first) || Array.isArray(second)) {
      return false;
    }
    if (first !== null && typeof first === "object" && second !== null) {
      if (Object.keys(first).length !== Object.keys(second).length) {
        return false;
      }
      for (const key in first) {
        if (!isEntryEqual(first[key], second[key])) {
          return false;
        }
      }
      return true;
    }
    return first === second || Number.isNaN(first) && Number.isNaN(second);
  }
  if (!(Array.isArray(firstDest) && Array.isArray(secondDest))) {
    return false;
  }
  if (firstDest.length !== secondDest.length) {
    return false;
  }
  for (let i = 0, ii = firstDest.length; i < ii; i++) {
    if (!isEntryEqual(firstDest[i], secondDest[i])) {
      return false;
    }
  }
  return true;
}
class AnnotationEditorLayerBuilder {
  constructor(options) {
    __privateAdd(this, _annotationLayer, null);
    __privateAdd(this, _drawLayer, null);
    __privateAdd(this, _onAppend2, null);
    __privateAdd(this, _textLayer, null);
    __privateAdd(this, _uiManager);
    this.pdfPage = options.pdfPage;
    this.accessibilityManager = options.accessibilityManager;
    this.l10n = options.l10n;
    this.l10n || (this.l10n = new genericl10n_GenericL10n());
    this.annotationEditorLayer = null;
    this.div = null;
    this._cancelled = false;
    __privateSet(this, _uiManager, options.uiManager);
    __privateSet(this, _annotationLayer, options.annotationLayer || null);
    __privateSet(this, _textLayer, options.textLayer || null);
    __privateSet(this, _drawLayer, options.drawLayer || null);
    __privateSet(this, _onAppend2, options.onAppend || null);
  }
  async render(viewport, intent = "display") {
    var _a;
    if (intent !== "display") {
      return;
    }
    if (this._cancelled) {
      return;
    }
    const clonedViewport = viewport.clone({
      dontFlip: true
    });
    if (this.div) {
      this.annotationEditorLayer.update({
        viewport: clonedViewport
      });
      this.show();
      return;
    }
    const div = this.div = document.createElement("div");
    div.className = "annotationEditorLayer";
    div.hidden = true;
    div.dir = __privateGet(this, _uiManager).direction;
    (_a = __privateGet(this, _onAppend2)) == null ? void 0 : _a.call(this, div);
    this.annotationEditorLayer = new AnnotationEditorLayer({
      uiManager: __privateGet(this, _uiManager),
      div,
      accessibilityManager: this.accessibilityManager,
      pageIndex: this.pdfPage.pageNumber - 1,
      l10n: this.l10n,
      viewport: clonedViewport,
      annotationLayer: __privateGet(this, _annotationLayer),
      textLayer: __privateGet(this, _textLayer),
      drawLayer: __privateGet(this, _drawLayer)
    });
    const parameters = {
      viewport: clonedViewport,
      div,
      annotations: null,
      intent
    };
    this.annotationEditorLayer.render(parameters);
    this.show();
  }
  cancel() {
    this._cancelled = true;
    if (!this.div) {
      return;
    }
    this.annotationEditorLayer.destroy();
  }
  hide() {
    if (!this.div) {
      return;
    }
    this.div.hidden = true;
  }
  show() {
    if (!this.div || this.annotationEditorLayer.isInvisible) {
      return;
    }
    this.div.hidden = false;
  }
}
_annotationLayer = new WeakMap();
_drawLayer = new WeakMap();
_onAppend2 = new WeakMap();
_textLayer = new WeakMap();
_uiManager = new WeakMap();
{
  var compatibilityParams = /* @__PURE__ */ Object.create(null);
  const userAgent = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 1;
  const isAndroid = /Android/.test(userAgent);
  const isIOS = /\b(iPad|iPhone|iPod)(?=;)/.test(userAgent) || platform === "MacIntel" && maxTouchPoints > 1;
  (function checkCanvasSizeLimitation() {
    if (isIOS || isAndroid) {
      compatibilityParams.maxCanvasPixels = 5242880;
    }
  })();
}
const OptionKind = {
  BROWSER: 1,
  VIEWER: 2,
  API: 4,
  WORKER: 8,
  PREFERENCE: 128
};
const defaultOptions = {
  canvasMaxAreaInBytes: {
    value: -1,
    kind: OptionKind.BROWSER + OptionKind.API
  },
  isInAutomation: {
    value: false,
    kind: OptionKind.BROWSER
  },
  supportsCaretBrowsingMode: {
    value: false,
    kind: OptionKind.BROWSER
  },
  supportsDocumentFonts: {
    value: true,
    kind: OptionKind.BROWSER
  },
  supportsIntegratedFind: {
    value: false,
    kind: OptionKind.BROWSER
  },
  supportsMouseWheelZoomCtrlKey: {
    value: true,
    kind: OptionKind.BROWSER
  },
  supportsMouseWheelZoomMetaKey: {
    value: true,
    kind: OptionKind.BROWSER
  },
  supportsPinchToZoom: {
    value: true,
    kind: OptionKind.BROWSER
  },
  annotationEditorMode: {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  annotationMode: {
    value: 2,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  cursorToolOnLoad: {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  debuggerSrc: {
    value: "./debugger.mjs",
    kind: OptionKind.VIEWER
  },
  defaultZoomDelay: {
    value: 400,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  defaultZoomValue: {
    value: "",
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  disableHistory: {
    value: false,
    kind: OptionKind.VIEWER
  },
  disablePageLabels: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableHighlightEditor: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableHighlightFloatingButton: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableML: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enablePermissions: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enablePrintAutoRotate: {
    value: true,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableScripting: {
    value: true,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableStampEditor: {
    value: true,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  externalLinkRel: {
    value: "noopener noreferrer nofollow",
    kind: OptionKind.VIEWER
  },
  externalLinkTarget: {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  highlightEditorColors: {
    value: "yellow=#FFFF98,green=#53FFBC,blue=#80EBFF,pink=#FFCBE6,red=#FF4F5F",
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  historyUpdateUrl: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  ignoreDestinationZoom: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  imageResourcesPath: {
    value: "./images/",
    kind: OptionKind.VIEWER
  },
  maxCanvasPixels: {
    value: 2 ** 25,
    kind: OptionKind.VIEWER
  },
  forcePageColors: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  pageColorsBackground: {
    value: "Canvas",
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  pageColorsForeground: {
    value: "CanvasText",
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  pdfBugEnabled: {
    value: false,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  printResolution: {
    value: 150,
    kind: OptionKind.VIEWER
  },
  sidebarViewOnLoad: {
    value: -1,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  scrollModeOnLoad: {
    value: -1,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  spreadModeOnLoad: {
    value: -1,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  textLayerMode: {
    value: 1,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  viewOnLoad: {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  cMapPacked: {
    value: true,
    kind: OptionKind.API
  },
  cMapUrl: {
    value: "../web/cmaps/",
    kind: OptionKind.API
  },
  disableAutoFetch: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  disableFontFace: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  disableRange: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  disableStream: {
    value: false,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  docBaseUrl: {
    value: "",
    kind: OptionKind.API
  },
  enableHWA: {
    value: true,
    kind: OptionKind.API + OptionKind.VIEWER + OptionKind.PREFERENCE
  },
  enableXfa: {
    value: true,
    kind: OptionKind.API + OptionKind.PREFERENCE
  },
  fontExtraProperties: {
    value: false,
    kind: OptionKind.API
  },
  isEvalSupported: {
    value: true,
    kind: OptionKind.API
  },
  isOffscreenCanvasSupported: {
    value: true,
    kind: OptionKind.API
  },
  maxImageSize: {
    value: -1,
    kind: OptionKind.API
  },
  pdfBug: {
    value: false,
    kind: OptionKind.API
  },
  standardFontDataUrl: {
    value: "../web/standard_fonts/",
    kind: OptionKind.API
  },
  verbosity: {
    value: 1,
    kind: OptionKind.API
  },
  workerPort: {
    value: null,
    kind: OptionKind.WORKER
  },
  workerSrc: {
    value: "../build/pdf.worker.mjs",
    kind: OptionKind.WORKER
  }
};
{
  defaultOptions.defaultUrl = {
    value: "compressed.tracemonkey-pldi-09.pdf",
    kind: OptionKind.VIEWER
  };
  defaultOptions.sandboxBundleSrc = {
    value: "../build/pdf.sandbox.mjs",
    kind: OptionKind.VIEWER
  };
  defaultOptions.viewerCssTheme = {
    value: 0,
    kind: OptionKind.VIEWER + OptionKind.PREFERENCE
  };
}
{
  defaultOptions.disablePreferences = {
    value: false,
    kind: OptionKind.VIEWER
  };
  defaultOptions.locale = {
    value: navigator.language || "en-US",
    kind: OptionKind.VIEWER
  };
}
const userOptions = /* @__PURE__ */ Object.create(null);
{
  for (const name in compatibilityParams) {
    userOptions[name] = compatibilityParams[name];
  }
}
class AppOptions {
  constructor() {
    throw new Error("Cannot initialize AppOptions.");
  }
  static get(name) {
    var _a;
    return userOptions[name] ?? ((_a = defaultOptions[name]) == null ? void 0 : _a.value) ?? void 0;
  }
  static getAll(kind = null, defaultOnly = false) {
    const options = /* @__PURE__ */ Object.create(null);
    for (const name in defaultOptions) {
      const defaultOption = defaultOptions[name];
      if (kind && !(kind & defaultOption.kind)) {
        continue;
      }
      options[name] = defaultOnly ? defaultOption.value : userOptions[name] ?? defaultOption.value;
    }
    return options;
  }
  static set(name, value) {
    userOptions[name] = value;
  }
  static setAll(options, init = false) {
    if (init) {
      if (this.get("disablePreferences")) {
        return;
      }
      for (const name in userOptions) {
        if (compatibilityParams[name] !== void 0) {
          continue;
        }
        console.warn('setAll: The Preferences may override manually set AppOptions; please use the "disablePreferences"-option in order to prevent that.');
        break;
      }
    }
    for (const name in options) {
      userOptions[name] = options[name];
    }
  }
  static remove(name) {
    delete userOptions[name];
    const val = compatibilityParams[name];
    if (val !== void 0) {
      userOptions[name] = val;
    }
  }
}
class DrawLayerBuilder {
  constructor(options) {
    __privateAdd(this, _drawLayer2, null);
    this.pageIndex = options.pageIndex;
  }
  async render(intent = "display") {
    if (intent !== "display" || __privateGet(this, _drawLayer2) || this._cancelled) {
      return;
    }
    __privateSet(this, _drawLayer2, new DrawLayer({
      pageIndex: this.pageIndex
    }));
  }
  cancel() {
    this._cancelled = true;
    if (!__privateGet(this, _drawLayer2)) {
      return;
    }
    __privateGet(this, _drawLayer2).destroy();
    __privateSet(this, _drawLayer2, null);
  }
  setParent(parent) {
    var _a;
    (_a = __privateGet(this, _drawLayer2)) == null ? void 0 : _a.setParent(parent);
  }
  getDrawLayer() {
    return __privateGet(this, _drawLayer2);
  }
}
_drawLayer2 = new WeakMap();
const PDF_ROLE_TO_HTML_ROLE = {
  Document: null,
  DocumentFragment: null,
  Part: "group",
  Sect: "group",
  Div: "group",
  Aside: "note",
  NonStruct: "none",
  P: null,
  H: "heading",
  Title: null,
  FENote: "note",
  Sub: "group",
  Lbl: null,
  Span: null,
  Em: null,
  Strong: null,
  Link: "link",
  Annot: "note",
  Form: "form",
  Ruby: null,
  RB: null,
  RT: null,
  RP: null,
  Warichu: null,
  WT: null,
  WP: null,
  L: "list",
  LI: "listitem",
  LBody: null,
  Table: "table",
  TR: "row",
  TH: "columnheader",
  TD: "cell",
  THead: "columnheader",
  TBody: null,
  TFoot: null,
  Caption: null,
  Figure: "figure",
  Formula: null,
  Artifact: null
};
const HEADING_PATTERN = /^H(\d+)$/;
class StructTreeLayerBuilder {
  constructor() {
    __privateAdd(this, _StructTreeLayerBuilder_instances);
    __privateAdd(this, _treeDom);
  }
  get renderingDone() {
    return __privateGet(this, _treeDom) !== void 0;
  }
  render(structTree) {
    if (__privateGet(this, _treeDom) !== void 0) {
      return __privateGet(this, _treeDom);
    }
    const treeDom = __privateMethod(this, _StructTreeLayerBuilder_instances, walk_fn).call(this, structTree);
    treeDom == null ? void 0 : treeDom.classList.add("structTree");
    return __privateSet(this, _treeDom, treeDom);
  }
  hide() {
    if (__privateGet(this, _treeDom) && !__privateGet(this, _treeDom).hidden) {
      __privateGet(this, _treeDom).hidden = true;
    }
  }
  show() {
    var _a;
    if ((_a = __privateGet(this, _treeDom)) == null ? void 0 : _a.hidden) {
      __privateGet(this, _treeDom).hidden = false;
    }
  }
}
_treeDom = new WeakMap();
_StructTreeLayerBuilder_instances = new WeakSet();
setAttributes_fn = function(structElement, htmlElement) {
  const {
    alt,
    id,
    lang
  } = structElement;
  if (alt !== void 0) {
    htmlElement.setAttribute("aria-label", removeNullCharacters(alt));
  }
  if (id !== void 0) {
    htmlElement.setAttribute("aria-owns", id);
  }
  if (lang !== void 0) {
    htmlElement.setAttribute("lang", removeNullCharacters(lang, true));
  }
};
walk_fn = function(node) {
  if (!node) {
    return null;
  }
  const element = document.createElement("span");
  if ("role" in node) {
    const {
      role
    } = node;
    const match2 = role.match(HEADING_PATTERN);
    if (match2) {
      element.setAttribute("role", "heading");
      element.setAttribute("aria-level", match2[1]);
    } else if (PDF_ROLE_TO_HTML_ROLE[role]) {
      element.setAttribute("role", PDF_ROLE_TO_HTML_ROLE[role]);
    }
  }
  __privateMethod(this, _StructTreeLayerBuilder_instances, setAttributes_fn).call(this, node, element);
  if (node.children) {
    if (node.children.length === 1 && "id" in node.children[0]) {
      __privateMethod(this, _StructTreeLayerBuilder_instances, setAttributes_fn).call(this, node.children[0], element);
    } else {
      for (const kid of node.children) {
        element.append(__privateMethod(this, _StructTreeLayerBuilder_instances, walk_fn).call(this, kid));
      }
    }
  }
  return element;
};
const _TextAccessibilityManager = class _TextAccessibilityManager {
  constructor() {
    __privateAdd(this, _TextAccessibilityManager_instances);
    __privateAdd(this, _enabled, false);
    __privateAdd(this, _textChildren, null);
    __privateAdd(this, _textNodes, /* @__PURE__ */ new Map());
    __privateAdd(this, _waitingElements, /* @__PURE__ */ new Map());
  }
  setTextMapping(textDivs) {
    __privateSet(this, _textChildren, textDivs);
  }
  enable() {
    if (__privateGet(this, _enabled)) {
      throw new Error("TextAccessibilityManager is already enabled.");
    }
    if (!__privateGet(this, _textChildren)) {
      throw new Error("Text divs and strings have not been set.");
    }
    __privateSet(this, _enabled, true);
    __privateSet(this, _textChildren, __privateGet(this, _textChildren).slice());
    __privateGet(this, _textChildren).sort(__privateMethod(_TextAccessibilityManager, _TextAccessibilityManager_static, compareElementPositions_fn));
    if (__privateGet(this, _textNodes).size > 0) {
      const textChildren = __privateGet(this, _textChildren);
      for (const [id, nodeIndex] of __privateGet(this, _textNodes)) {
        const element = document.getElementById(id);
        if (!element) {
          __privateGet(this, _textNodes).delete(id);
          continue;
        }
        __privateMethod(this, _TextAccessibilityManager_instances, addIdToAriaOwns_fn).call(this, id, textChildren[nodeIndex]);
      }
    }
    for (const [element, isRemovable] of __privateGet(this, _waitingElements)) {
      this.addPointerInTextLayer(element, isRemovable);
    }
    __privateGet(this, _waitingElements).clear();
  }
  disable() {
    if (!__privateGet(this, _enabled)) {
      return;
    }
    __privateGet(this, _waitingElements).clear();
    __privateSet(this, _textChildren, null);
    __privateSet(this, _enabled, false);
  }
  removePointerInTextLayer(element) {
    if (!__privateGet(this, _enabled)) {
      __privateGet(this, _waitingElements).delete(element);
      return;
    }
    const children = __privateGet(this, _textChildren);
    if (!children || children.length === 0) {
      return;
    }
    const {
      id
    } = element;
    const nodeIndex = __privateGet(this, _textNodes).get(id);
    if (nodeIndex === void 0) {
      return;
    }
    const node = children[nodeIndex];
    __privateGet(this, _textNodes).delete(id);
    let owns = node.getAttribute("aria-owns");
    if (owns == null ? void 0 : owns.includes(id)) {
      owns = owns.split(" ").filter((x) => x !== id).join(" ");
      if (owns) {
        node.setAttribute("aria-owns", owns);
      } else {
        node.removeAttribute("aria-owns");
        node.setAttribute("role", "presentation");
      }
    }
  }
  addPointerInTextLayer(element, isRemovable) {
    const {
      id
    } = element;
    if (!id) {
      return null;
    }
    if (!__privateGet(this, _enabled)) {
      __privateGet(this, _waitingElements).set(element, isRemovable);
      return null;
    }
    if (isRemovable) {
      this.removePointerInTextLayer(element);
    }
    const children = __privateGet(this, _textChildren);
    if (!children || children.length === 0) {
      return null;
    }
    const index = binarySearchFirstItem(children, (node) => {
      var _a;
      return __privateMethod(_a = _TextAccessibilityManager, _TextAccessibilityManager_static, compareElementPositions_fn).call(_a, element, node) < 0;
    });
    const nodeIndex = Math.max(0, index - 1);
    const child = children[nodeIndex];
    __privateMethod(this, _TextAccessibilityManager_instances, addIdToAriaOwns_fn).call(this, id, child);
    __privateGet(this, _textNodes).set(id, nodeIndex);
    const parent = child.parentNode;
    return (parent == null ? void 0 : parent.classList.contains("markedContent")) ? parent.id : null;
  }
  moveElementInDOM(container, element, contentElement, isRemovable) {
    const id = this.addPointerInTextLayer(contentElement, isRemovable);
    if (!container.hasChildNodes()) {
      container.append(element);
      return id;
    }
    const children = Array.from(container.childNodes).filter((node) => node !== element);
    if (children.length === 0) {
      return id;
    }
    const elementToCompare = contentElement || element;
    const index = binarySearchFirstItem(children, (node) => {
      var _a;
      return __privateMethod(_a = _TextAccessibilityManager, _TextAccessibilityManager_static, compareElementPositions_fn).call(_a, elementToCompare, node) < 0;
    });
    if (index === 0) {
      children[0].before(element);
    } else {
      children[index - 1].after(element);
    }
    return id;
  }
};
_enabled = new WeakMap();
_textChildren = new WeakMap();
_textNodes = new WeakMap();
_waitingElements = new WeakMap();
_TextAccessibilityManager_static = new WeakSet();
compareElementPositions_fn = function(e1, e2) {
  const rect1 = e1.getBoundingClientRect();
  const rect2 = e2.getBoundingClientRect();
  if (rect1.width === 0 && rect1.height === 0) {
    return 1;
  }
  if (rect2.width === 0 && rect2.height === 0) {
    return -1;
  }
  const top1 = rect1.y;
  const bot1 = rect1.y + rect1.height;
  const mid1 = rect1.y + rect1.height / 2;
  const top2 = rect2.y;
  const bot2 = rect2.y + rect2.height;
  const mid2 = rect2.y + rect2.height / 2;
  if (mid1 <= top2 && mid2 >= bot1) {
    return -1;
  }
  if (mid2 <= top1 && mid1 >= bot2) {
    return 1;
  }
  const centerX1 = rect1.x + rect1.width / 2;
  const centerX2 = rect2.x + rect2.width / 2;
  return centerX1 - centerX2;
};
_TextAccessibilityManager_instances = new WeakSet();
addIdToAriaOwns_fn = function(id, node) {
  const owns = node.getAttribute("aria-owns");
  if (!(owns == null ? void 0 : owns.includes(id))) {
    node.setAttribute("aria-owns", owns ? `${owns} ${id}` : id);
  }
  node.removeAttribute("role");
};
__privateAdd(_TextAccessibilityManager, _TextAccessibilityManager_static);
let TextAccessibilityManager = _TextAccessibilityManager;
class TextHighlighter {
  constructor({
    findController,
    eventBus,
    pageIndex
  }) {
    __privateAdd(this, _eventAbortController3, null);
    this.findController = findController;
    this.matches = [];
    this.eventBus = eventBus;
    this.pageIdx = pageIndex;
    this.textDivs = null;
    this.textContentItemsStr = null;
    this.enabled = false;
  }
  setTextMapping(divs, texts) {
    this.textDivs = divs;
    this.textContentItemsStr = texts;
  }
  enable() {
    if (!this.textDivs || !this.textContentItemsStr) {
      throw new Error("Text divs and strings have not been set.");
    }
    if (this.enabled) {
      throw new Error("TextHighlighter is already enabled.");
    }
    this.enabled = true;
    if (!__privateGet(this, _eventAbortController3)) {
      __privateSet(this, _eventAbortController3, new AbortController());
      this.eventBus._on("updatetextlayermatches", (evt) => {
        if (evt.pageIndex === this.pageIdx || evt.pageIndex === -1) {
          this._updateMatches();
        }
      }, {
        signal: __privateGet(this, _eventAbortController3).signal
      });
    }
    this._updateMatches();
  }
  disable() {
    var _a;
    if (!this.enabled) {
      return;
    }
    this.enabled = false;
    (_a = __privateGet(this, _eventAbortController3)) == null ? void 0 : _a.abort();
    __privateSet(this, _eventAbortController3, null);
    this._updateMatches(true);
  }
  _convertMatches(matches, matchesLength) {
    if (!matches) {
      return [];
    }
    const {
      textContentItemsStr
    } = this;
    let i = 0, iIndex = 0;
    const end = textContentItemsStr.length - 1;
    const result = [];
    for (let m = 0, mm = matches.length; m < mm; m++) {
      let matchIdx = matches[m];
      while (i !== end && matchIdx >= iIndex + textContentItemsStr[i].length) {
        iIndex += textContentItemsStr[i].length;
        i++;
      }
      if (i === textContentItemsStr.length) {
        console.error("Could not find a matching mapping");
      }
      const match2 = {
        begin: {
          divIdx: i,
          offset: matchIdx - iIndex
        }
      };
      matchIdx += matchesLength[m];
      while (i !== end && matchIdx > iIndex + textContentItemsStr[i].length) {
        iIndex += textContentItemsStr[i].length;
        i++;
      }
      match2.end = {
        divIdx: i,
        offset: matchIdx - iIndex
      };
      result.push(match2);
    }
    return result;
  }
  _renderMatches(matches) {
    if (matches.length === 0) {
      return;
    }
    const {
      findController,
      pageIdx
    } = this;
    const {
      textContentItemsStr,
      textDivs
    } = this;
    const isSelectedPage = pageIdx === findController.selected.pageIdx;
    const selectedMatchIdx = findController.selected.matchIdx;
    const highlightAll = findController.state.highlightAll;
    let prevEnd = null;
    const infinity = {
      divIdx: -1,
      offset: void 0
    };
    function beginText(begin, className) {
      const divIdx = begin.divIdx;
      textDivs[divIdx].textContent = "";
      return appendTextToDiv(divIdx, 0, begin.offset, className);
    }
    function appendTextToDiv(divIdx, fromOffset, toOffset, className) {
      let div = textDivs[divIdx];
      if (div.nodeType === Node.TEXT_NODE) {
        const span = document.createElement("span");
        div.before(span);
        span.append(div);
        textDivs[divIdx] = span;
        div = span;
      }
      const content = textContentItemsStr[divIdx].substring(fromOffset, toOffset);
      const node = document.createTextNode(content);
      if (className) {
        const span = document.createElement("span");
        span.className = `${className} appended`;
        span.append(node);
        div.append(span);
        return className.includes("selected") ? span.offsetLeft : 0;
      }
      div.append(node);
      return 0;
    }
    let i0 = selectedMatchIdx, i1 = i0 + 1;
    if (highlightAll) {
      i0 = 0;
      i1 = matches.length;
    } else if (!isSelectedPage) {
      return;
    }
    let lastDivIdx = -1;
    let lastOffset = -1;
    for (let i = i0; i < i1; i++) {
      const match2 = matches[i];
      const begin = match2.begin;
      if (begin.divIdx === lastDivIdx && begin.offset === lastOffset) {
        continue;
      }
      lastDivIdx = begin.divIdx;
      lastOffset = begin.offset;
      const end = match2.end;
      const isSelected = isSelectedPage && i === selectedMatchIdx;
      const highlightSuffix = isSelected ? " selected" : "";
      let selectedLeft = 0;
      if (!prevEnd || begin.divIdx !== prevEnd.divIdx) {
        if (prevEnd !== null) {
          appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
        }
        beginText(begin);
      } else {
        appendTextToDiv(prevEnd.divIdx, prevEnd.offset, begin.offset);
      }
      if (begin.divIdx === end.divIdx) {
        selectedLeft = appendTextToDiv(begin.divIdx, begin.offset, end.offset, "highlight" + highlightSuffix);
      } else {
        selectedLeft = appendTextToDiv(begin.divIdx, begin.offset, infinity.offset, "highlight begin" + highlightSuffix);
        for (let n0 = begin.divIdx + 1, n1 = end.divIdx; n0 < n1; n0++) {
          textDivs[n0].className = "highlight middle" + highlightSuffix;
        }
        beginText(end, "highlight end" + highlightSuffix);
      }
      prevEnd = end;
      if (isSelected) {
        findController.scrollMatchIntoView({
          element: textDivs[begin.divIdx],
          selectedLeft,
          pageIndex: pageIdx,
          matchIndex: selectedMatchIdx
        });
      }
    }
    if (prevEnd) {
      appendTextToDiv(prevEnd.divIdx, prevEnd.offset, infinity.offset);
    }
  }
  _updateMatches(reset = false) {
    if (!this.enabled && !reset) {
      return;
    }
    const {
      findController,
      matches,
      pageIdx
    } = this;
    const {
      textContentItemsStr,
      textDivs
    } = this;
    let clearedUntilDivIdx = -1;
    for (const match2 of matches) {
      const begin = Math.max(clearedUntilDivIdx, match2.begin.divIdx);
      for (let n = begin, end = match2.end.divIdx; n <= end; n++) {
        const div = textDivs[n];
        div.textContent = textContentItemsStr[n];
        div.className = "";
      }
      clearedUntilDivIdx = match2.end.divIdx + 1;
    }
    if (!(findController == null ? void 0 : findController.highlightMatches) || reset) {
      return;
    }
    const pageMatches = findController.pageMatches[pageIdx] || null;
    const pageMatchesLength = findController.pageMatchesLength[pageIdx] || null;
    this.matches = this._convertMatches(pageMatches, pageMatchesLength);
    this._renderMatches(this.matches);
  }
}
_eventAbortController3 = new WeakMap();
const _TextLayerBuilder = class _TextLayerBuilder {
  constructor({
    pdfPage,
    highlighter = null,
    accessibilityManager = null,
    enablePermissions = false,
    onAppend = null
  }) {
    __privateAdd(this, _TextLayerBuilder_instances);
    __privateAdd(this, _enablePermissions, false);
    __privateAdd(this, _onAppend3, null);
    __privateAdd(this, _renderingDone, false);
    __privateAdd(this, _textLayer2, null);
    this.pdfPage = pdfPage;
    this.highlighter = highlighter;
    this.accessibilityManager = accessibilityManager;
    __privateSet(this, _enablePermissions, enablePermissions === true);
    __privateSet(this, _onAppend3, onAppend);
    this.div = document.createElement("div");
    this.div.tabIndex = 0;
    this.div.className = "textLayer";
  }
  async render(viewport, textContentParams = null) {
    var _a, _b, _c, _d, _e;
    if (__privateGet(this, _renderingDone) && __privateGet(this, _textLayer2)) {
      __privateGet(this, _textLayer2).update({
        viewport,
        onBefore: this.hide.bind(this)
      });
      this.show();
      return;
    }
    this.cancel();
    __privateSet(this, _textLayer2, new TextLayer({
      textContentSource: this.pdfPage.streamTextContent(textContentParams || {
        includeMarkedContent: true,
        disableNormalization: true
      }),
      container: this.div,
      viewport
    }));
    const {
      textDivs,
      textContentItemsStr
    } = __privateGet(this, _textLayer2);
    (_a = this.highlighter) == null ? void 0 : _a.setTextMapping(textDivs, textContentItemsStr);
    (_b = this.accessibilityManager) == null ? void 0 : _b.setTextMapping(textDivs);
    await __privateGet(this, _textLayer2).render();
    __privateSet(this, _renderingDone, true);
    const endOfContent = document.createElement("div");
    endOfContent.className = "endOfContent";
    this.div.append(endOfContent);
    __privateMethod(this, _TextLayerBuilder_instances, bindMouse_fn).call(this, endOfContent);
    (_c = __privateGet(this, _onAppend3)) == null ? void 0 : _c.call(this, this.div);
    (_d = this.highlighter) == null ? void 0 : _d.enable();
    (_e = this.accessibilityManager) == null ? void 0 : _e.enable();
  }
  hide() {
    var _a;
    if (!this.div.hidden && __privateGet(this, _renderingDone)) {
      (_a = this.highlighter) == null ? void 0 : _a.disable();
      this.div.hidden = true;
    }
  }
  show() {
    var _a;
    if (this.div.hidden && __privateGet(this, _renderingDone)) {
      this.div.hidden = false;
      (_a = this.highlighter) == null ? void 0 : _a.enable();
    }
  }
  cancel() {
    var _a, _b, _c, _d;
    (_a = __privateGet(this, _textLayer2)) == null ? void 0 : _a.cancel();
    __privateSet(this, _textLayer2, null);
    (_b = this.highlighter) == null ? void 0 : _b.disable();
    (_c = this.accessibilityManager) == null ? void 0 : _c.disable();
    __privateMethod(_d = _TextLayerBuilder, _TextLayerBuilder_static, removeGlobalSelectionListener_fn).call(_d, this.div);
  }
};
_enablePermissions = new WeakMap();
_onAppend3 = new WeakMap();
_renderingDone = new WeakMap();
_textLayer2 = new WeakMap();
_textLayers = new WeakMap();
_selectionChangeAbortController = new WeakMap();
_TextLayerBuilder_instances = new WeakSet();
bindMouse_fn = function(end) {
  var _a;
  const {
    div
  } = this;
  div.addEventListener("mousedown", (evt) => {
    end.classList.add("active");
  });
  div.addEventListener("copy", (event) => {
    if (!__privateGet(this, _enablePermissions)) {
      const selection = document.getSelection();
      event.clipboardData.setData("text/plain", removeNullCharacters(normalizeUnicode(selection.toString())));
    }
    event.preventDefault();
    event.stopPropagation();
  });
  __privateGet(_TextLayerBuilder, _textLayers).set(div, end);
  __privateMethod(_a = _TextLayerBuilder, _TextLayerBuilder_static, enableGlobalSelectionListener_fn).call(_a);
};
_TextLayerBuilder_static = new WeakSet();
removeGlobalSelectionListener_fn = function(textLayerDiv) {
  var _a;
  __privateGet(this, _textLayers).delete(textLayerDiv);
  if (__privateGet(this, _textLayers).size === 0) {
    (_a = __privateGet(this, _selectionChangeAbortController)) == null ? void 0 : _a.abort();
    __privateSet(this, _selectionChangeAbortController, null);
  }
};
enableGlobalSelectionListener_fn = function() {
  if (__privateGet(this, _selectionChangeAbortController)) {
    return;
  }
  __privateSet(this, _selectionChangeAbortController, new AbortController());
  const {
    signal
  } = __privateGet(this, _selectionChangeAbortController);
  const reset = (end, textLayer) => {
    textLayer.append(end);
    end.style.width = "";
    end.style.height = "";
    end.classList.remove("active");
  };
  document.addEventListener("pointerup", () => {
    __privateGet(this, _textLayers).forEach(reset);
  }, {
    signal
  });
  var isFirefox, prevRange;
  document.addEventListener("selectionchange", () => {
    const selection = document.getSelection();
    if (selection.rangeCount === 0) {
      __privateGet(this, _textLayers).forEach(reset);
      return;
    }
    const activeTextLayers = /* @__PURE__ */ new Set();
    for (let i = 0; i < selection.rangeCount; i++) {
      const range2 = selection.getRangeAt(i);
      for (const textLayerDiv of __privateGet(this, _textLayers).keys()) {
        if (!activeTextLayers.has(textLayerDiv) && range2.intersectsNode(textLayerDiv)) {
          activeTextLayers.add(textLayerDiv);
        }
      }
    }
    for (const [textLayerDiv, endDiv2] of __privateGet(this, _textLayers)) {
      if (activeTextLayers.has(textLayerDiv)) {
        endDiv2.classList.add("active");
      } else {
        reset(endDiv2, textLayerDiv);
      }
    }
    isFirefox ?? (isFirefox = getComputedStyle(__privateGet(this, _textLayers).values().next().value).getPropertyValue("-moz-user-select") === "none");
    if (isFirefox) {
      return;
    }
    const range = selection.getRangeAt(0);
    const modifyStart = prevRange && (range.compareBoundaryPoints(Range.END_TO_END, prevRange) === 0 || range.compareBoundaryPoints(Range.START_TO_END, prevRange) === 0);
    let anchor = modifyStart ? range.startContainer : range.endContainer;
    if (anchor.nodeType === Node.TEXT_NODE) {
      anchor = anchor.parentNode;
    }
    const parentTextLayer = anchor.parentElement.closest(".textLayer");
    const endDiv = __privateGet(this, _textLayers).get(parentTextLayer);
    if (endDiv) {
      endDiv.style.width = parentTextLayer.style.width;
      endDiv.style.height = parentTextLayer.style.height;
      anchor.parentElement.insertBefore(endDiv, modifyStart ? anchor : anchor.nextSibling);
    }
    prevRange = range.cloneRange();
  }, {
    signal
  });
};
__privateAdd(_TextLayerBuilder, _TextLayerBuilder_static);
__privateAdd(_TextLayerBuilder, _textLayers, /* @__PURE__ */ new Map());
__privateAdd(_TextLayerBuilder, _selectionChangeAbortController, null);
let TextLayerBuilder = _TextLayerBuilder;
class XfaLayerBuilder {
  constructor({
    pdfPage,
    annotationStorage = null,
    linkService,
    xfaHtml = null
  }) {
    this.pdfPage = pdfPage;
    this.annotationStorage = annotationStorage;
    this.linkService = linkService;
    this.xfaHtml = xfaHtml;
    this.div = null;
    this._cancelled = false;
  }
  async render(viewport, intent = "display") {
    if (intent === "print") {
      const parameters2 = {
        viewport: viewport.clone({
          dontFlip: true
        }),
        div: this.div,
        xfaHtml: this.xfaHtml,
        annotationStorage: this.annotationStorage,
        linkService: this.linkService,
        intent
      };
      this.div = document.createElement("div");
      parameters2.div = this.div;
      return XfaLayer.render(parameters2);
    }
    const xfaHtml = await this.pdfPage.getXfa();
    if (this._cancelled || !xfaHtml) {
      return {
        textDivs: []
      };
    }
    const parameters = {
      viewport: viewport.clone({
        dontFlip: true
      }),
      div: this.div,
      xfaHtml,
      annotationStorage: this.annotationStorage,
      linkService: this.linkService,
      intent
    };
    if (this.div) {
      return XfaLayer.update(parameters);
    }
    this.div = document.createElement("div");
    parameters.div = this.div;
    return XfaLayer.render(parameters);
  }
  cancel() {
    this._cancelled = true;
  }
  hide() {
    if (!this.div) {
      return;
    }
    this.div.hidden = true;
  }
}
const DEFAULT_LAYER_PROPERTIES = {
  annotationEditorUIManager: null,
  annotationStorage: null,
  downloadManager: null,
  enableScripting: false,
  fieldObjectsPromise: null,
  findController: null,
  hasJSActionsPromise: null,
  get linkService() {
    return new SimpleLinkService();
  }
};
const LAYERS_ORDER = /* @__PURE__ */ new Map([["canvasWrapper", 0], ["textLayer", 1], ["annotationLayer", 2], ["annotationEditorLayer", 3], ["xfaLayer", 3]]);
class PDFPageView {
  constructor(options) {
    __privateAdd(this, _PDFPageView_instances);
    __privateAdd(this, _annotationMode, AnnotationMode.ENABLE_FORMS);
    __privateAdd(this, _enableHWA, false);
    __privateAdd(this, _hasRestrictedScaling, false);
    __privateAdd(this, _layerProperties, null);
    __privateAdd(this, _loadingId, null);
    __privateAdd(this, _previousRotation, null);
    __privateAdd(this, _renderError, null);
    __privateAdd(this, _renderingState, RenderingStates.INITIAL);
    __privateAdd(this, _textLayerMode, TextLayerMode.ENABLE);
    __privateAdd(this, _useThumbnailCanvas, {
      directDrawing: true,
      initialOptionalContent: true,
      regularAnnotations: true
    });
    __privateAdd(this, _viewportMap, /* @__PURE__ */ new WeakMap());
    __privateAdd(this, _layers, [null, null, null, null]);
    var _a;
    const container = options.container;
    const defaultViewport = options.defaultViewport;
    this.id = options.id;
    this.renderingId = "page" + this.id;
    __privateSet(this, _layerProperties, options.layerProperties || DEFAULT_LAYER_PROPERTIES);
    this.pdfPage = null;
    this.pageLabel = null;
    this.rotation = 0;
    this.scale = options.scale || DEFAULT_SCALE;
    this.viewport = defaultViewport;
    this.pdfPageRotate = defaultViewport.rotation;
    this._optionalContentConfigPromise = options.optionalContentConfigPromise || null;
    __privateSet(this, _textLayerMode, options.textLayerMode ?? TextLayerMode.ENABLE);
    __privateSet(this, _annotationMode, options.annotationMode ?? AnnotationMode.ENABLE_FORMS);
    this.imageResourcesPath = options.imageResourcesPath || "";
    this.maxCanvasPixels = options.maxCanvasPixels ?? AppOptions.get("maxCanvasPixels");
    this.pageColors = options.pageColors || null;
    __privateSet(this, _enableHWA, options.enableHWA || false);
    this.eventBus = options.eventBus;
    this.renderingQueue = options.renderingQueue;
    this.l10n = options.l10n;
    this.l10n || (this.l10n = new genericl10n_GenericL10n());
    this.renderTask = null;
    this.resume = null;
    this._isStandalone = !((_a = this.renderingQueue) == null ? void 0 : _a.hasViewer());
    this._container = container;
    this._annotationCanvasMap = null;
    this.annotationLayer = null;
    this.annotationEditorLayer = null;
    this.textLayer = null;
    this.zoomLayer = null;
    this.xfaLayer = null;
    this.structTreeLayer = null;
    this.drawLayer = null;
    const div = document.createElement("div");
    div.className = "page";
    div.setAttribute("data-page-number", this.id);
    div.setAttribute("role", "region");
    div.setAttribute("data-l10n-id", "pdfjs-page-landmark");
    div.setAttribute("data-l10n-args", JSON.stringify({
      page: this.id
    }));
    this.div = div;
    __privateMethod(this, _PDFPageView_instances, setDimensions_fn).call(this);
    container == null ? void 0 : container.append(div);
    if (this._isStandalone) {
      container == null ? void 0 : container.style.setProperty("--scale-factor", this.scale * PixelsPerInch.PDF_TO_CSS_UNITS);
      const {
        optionalContentConfigPromise
      } = options;
      if (optionalContentConfigPromise) {
        optionalContentConfigPromise.then((optionalContentConfig) => {
          if (optionalContentConfigPromise !== this._optionalContentConfigPromise) {
            return;
          }
          __privateGet(this, _useThumbnailCanvas).initialOptionalContent = optionalContentConfig.hasInitialVisibility;
        });
      }
      if (!options.l10n) {
        this.l10n.translate(this.div);
      }
    }
  }
  get renderingState() {
    return __privateGet(this, _renderingState);
  }
  set renderingState(state) {
    if (state === __privateGet(this, _renderingState)) {
      return;
    }
    __privateSet(this, _renderingState, state);
    if (__privateGet(this, _loadingId)) {
      clearTimeout(__privateGet(this, _loadingId));
      __privateSet(this, _loadingId, null);
    }
    switch (state) {
      case RenderingStates.PAUSED:
        this.div.classList.remove("loading");
        break;
      case RenderingStates.RUNNING:
        this.div.classList.add("loadingIcon");
        __privateSet(this, _loadingId, setTimeout(() => {
          this.div.classList.add("loading");
          __privateSet(this, _loadingId, null);
        }, 0));
        break;
      case RenderingStates.INITIAL:
      case RenderingStates.FINISHED:
        this.div.classList.remove("loadingIcon", "loading");
        break;
    }
  }
  setPdfPage(pdfPage) {
    var _a, _b, _c, _d;
    if (this._isStandalone && (((_a = this.pageColors) == null ? void 0 : _a.foreground) === "CanvasText" || ((_b = this.pageColors) == null ? void 0 : _b.background) === "Canvas")) {
      (_c = this._container) == null ? void 0 : _c.style.setProperty("--hcm-highlight-filter", pdfPage.filterFactory.addHighlightHCMFilter("highlight", "CanvasText", "Canvas", "HighlightText", "Highlight"));
      (_d = this._container) == null ? void 0 : _d.style.setProperty("--hcm-highlight-selected-filter", pdfPage.filterFactory.addHighlightHCMFilter("highlight_selected", "CanvasText", "Canvas", "HighlightText", "Highlight"));
    }
    this.pdfPage = pdfPage;
    this.pdfPageRotate = pdfPage.rotate;
    const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
    this.viewport = pdfPage.getViewport({
      scale: this.scale * PixelsPerInch.PDF_TO_CSS_UNITS,
      rotation: totalRotation
    });
    __privateMethod(this, _PDFPageView_instances, setDimensions_fn).call(this);
    this.reset();
  }
  destroy() {
    var _a;
    this.reset();
    (_a = this.pdfPage) == null ? void 0 : _a.cleanup();
  }
  get _textHighlighter() {
    return shadow(this, "_textHighlighter", new TextHighlighter({
      pageIndex: this.id - 1,
      eventBus: this.eventBus,
      findController: __privateGet(this, _layerProperties).findController
    }));
  }
  _resetZoomLayer(removeFromDOM = false) {
    if (!this.zoomLayer) {
      return;
    }
    const zoomLayerCanvas = this.zoomLayer.firstChild;
    __privateGet(this, _viewportMap).delete(zoomLayerCanvas);
    zoomLayerCanvas.width = 0;
    zoomLayerCanvas.height = 0;
    if (removeFromDOM) {
      this.zoomLayer.remove();
    }
    this.zoomLayer = null;
  }
  reset({
    keepZoomLayer = false,
    keepAnnotationLayer = false,
    keepAnnotationEditorLayer = false,
    keepXfaLayer = false,
    keepTextLayer = false
  } = {}) {
    var _a, _b, _c, _d, _e;
    this.cancelRendering({
      keepAnnotationLayer,
      keepAnnotationEditorLayer,
      keepXfaLayer,
      keepTextLayer
    });
    this.renderingState = RenderingStates.INITIAL;
    const div = this.div;
    const childNodes = div.childNodes, zoomLayerNode = keepZoomLayer && this.zoomLayer || null, annotationLayerNode = keepAnnotationLayer && ((_a = this.annotationLayer) == null ? void 0 : _a.div) || null, annotationEditorLayerNode = keepAnnotationEditorLayer && ((_b = this.annotationEditorLayer) == null ? void 0 : _b.div) || null, xfaLayerNode = keepXfaLayer && ((_c = this.xfaLayer) == null ? void 0 : _c.div) || null, textLayerNode = keepTextLayer && ((_d = this.textLayer) == null ? void 0 : _d.div) || null;
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const node = childNodes[i];
      switch (node) {
        case zoomLayerNode:
        case annotationLayerNode:
        case annotationEditorLayerNode:
        case xfaLayerNode:
        case textLayerNode:
          continue;
      }
      node.remove();
      const layerIndex = __privateGet(this, _layers).indexOf(node);
      if (layerIndex >= 0) {
        __privateGet(this, _layers)[layerIndex] = null;
      }
    }
    div.removeAttribute("data-loaded");
    if (annotationLayerNode) {
      this.annotationLayer.hide();
    }
    if (annotationEditorLayerNode) {
      this.annotationEditorLayer.hide();
    }
    if (xfaLayerNode) {
      this.xfaLayer.hide();
    }
    if (textLayerNode) {
      this.textLayer.hide();
    }
    (_e = this.structTreeLayer) == null ? void 0 : _e.hide();
    if (!zoomLayerNode) {
      if (this.canvas) {
        __privateGet(this, _viewportMap).delete(this.canvas);
        this.canvas.width = 0;
        this.canvas.height = 0;
        delete this.canvas;
      }
      this._resetZoomLayer();
    }
  }
  update({
    scale = 0,
    rotation = null,
    optionalContentConfigPromise = null,
    drawingDelay = -1
  }) {
    var _a;
    this.scale = scale || this.scale;
    if (typeof rotation === "number") {
      this.rotation = rotation;
    }
    if (optionalContentConfigPromise instanceof Promise) {
      this._optionalContentConfigPromise = optionalContentConfigPromise;
      optionalContentConfigPromise.then((optionalContentConfig) => {
        if (optionalContentConfigPromise !== this._optionalContentConfigPromise) {
          return;
        }
        __privateGet(this, _useThumbnailCanvas).initialOptionalContent = optionalContentConfig.hasInitialVisibility;
      });
    }
    __privateGet(this, _useThumbnailCanvas).directDrawing = true;
    const totalRotation = (this.rotation + this.pdfPageRotate) % 360;
    this.viewport = this.viewport.clone({
      scale: this.scale * PixelsPerInch.PDF_TO_CSS_UNITS,
      rotation: totalRotation
    });
    __privateMethod(this, _PDFPageView_instances, setDimensions_fn).call(this);
    if (this._isStandalone) {
      (_a = this._container) == null ? void 0 : _a.style.setProperty("--scale-factor", this.viewport.scale);
    }
    if (this.canvas) {
      let onlyCssZoom = false;
      if (__privateGet(this, _hasRestrictedScaling)) {
        if (this.maxCanvasPixels === 0) {
          onlyCssZoom = true;
        } else if (this.maxCanvasPixels > 0) {
          const {
            width,
            height
          } = this.viewport;
          const {
            sx,
            sy
          } = this.outputScale;
          onlyCssZoom = (Math.floor(width) * sx | 0) * (Math.floor(height) * sy | 0) > this.maxCanvasPixels;
        }
      }
      const postponeDrawing = drawingDelay >= 0 && drawingDelay < 1e3;
      if (postponeDrawing || onlyCssZoom) {
        if (postponeDrawing && !onlyCssZoom && this.renderingState !== RenderingStates.FINISHED) {
          this.cancelRendering({
            keepZoomLayer: true,
            keepAnnotationLayer: true,
            keepAnnotationEditorLayer: true,
            keepXfaLayer: true,
            keepTextLayer: true,
            cancelExtraDelay: drawingDelay
          });
          this.renderingState = RenderingStates.FINISHED;
          __privateGet(this, _useThumbnailCanvas).directDrawing = false;
        }
        this.cssTransform({
          target: this.canvas,
          redrawAnnotationLayer: true,
          redrawAnnotationEditorLayer: true,
          redrawXfaLayer: true,
          redrawTextLayer: !postponeDrawing,
          hideTextLayer: postponeDrawing
        });
        if (postponeDrawing) {
          return;
        }
        this.eventBus.dispatch("pagerendered", {
          source: this,
          pageNumber: this.id,
          cssTransform: true,
          timestamp: performance.now(),
          error: __privateGet(this, _renderError)
        });
        return;
      }
      if (!this.zoomLayer && !this.canvas.hidden) {
        this.zoomLayer = this.canvas.parentNode;
        this.zoomLayer.style.position = "absolute";
      }
    }
    if (this.zoomLayer) {
      this.cssTransform({
        target: this.zoomLayer.firstChild
      });
    }
    this.reset({
      keepZoomLayer: true,
      keepAnnotationLayer: true,
      keepAnnotationEditorLayer: true,
      keepXfaLayer: true,
      keepTextLayer: true
    });
  }
  cancelRendering({
    keepAnnotationLayer = false,
    keepAnnotationEditorLayer = false,
    keepXfaLayer = false,
    keepTextLayer = false,
    cancelExtraDelay = 0
  } = {}) {
    var _a;
    if (this.renderTask) {
      this.renderTask.cancel(cancelExtraDelay);
      this.renderTask = null;
    }
    this.resume = null;
    if (this.textLayer && (!keepTextLayer || !this.textLayer.div)) {
      this.textLayer.cancel();
      this.textLayer = null;
    }
    if (this.structTreeLayer && !this.textLayer) {
      this.structTreeLayer = null;
    }
    if (this.annotationLayer && (!keepAnnotationLayer || !this.annotationLayer.div)) {
      this.annotationLayer.cancel();
      this.annotationLayer = null;
      this._annotationCanvasMap = null;
    }
    if (this.annotationEditorLayer && (!keepAnnotationEditorLayer || !this.annotationEditorLayer.div)) {
      if (this.drawLayer) {
        this.drawLayer.cancel();
        this.drawLayer = null;
      }
      this.annotationEditorLayer.cancel();
      this.annotationEditorLayer = null;
    }
    if (this.xfaLayer && (!keepXfaLayer || !this.xfaLayer.div)) {
      this.xfaLayer.cancel();
      this.xfaLayer = null;
      (_a = this._textHighlighter) == null ? void 0 : _a.disable();
    }
  }
  cssTransform({
    target,
    redrawAnnotationLayer = false,
    redrawAnnotationEditorLayer = false,
    redrawXfaLayer = false,
    redrawTextLayer = false,
    hideTextLayer = false
  }) {
    var _a;
    if (!target.hasAttribute("zooming")) {
      target.setAttribute("zooming", true);
      const {
        style
      } = target;
      style.width = style.height = "";
    }
    const originalViewport = __privateGet(this, _viewportMap).get(target);
    if (this.viewport !== originalViewport) {
      const relativeRotation = this.viewport.rotation - originalViewport.rotation;
      const absRotation = Math.abs(relativeRotation);
      let scaleX = 1, scaleY = 1;
      if (absRotation === 90 || absRotation === 270) {
        const {
          width,
          height
        } = this.viewport;
        scaleX = height / width;
        scaleY = width / height;
      }
      target.style.transform = `rotate(${relativeRotation}deg) scale(${scaleX}, ${scaleY})`;
    }
    if (redrawAnnotationLayer && this.annotationLayer) {
      __privateMethod(this, _PDFPageView_instances, renderAnnotationLayer_fn).call(this);
    }
    if (redrawAnnotationEditorLayer && this.annotationEditorLayer) {
      if (this.drawLayer) {
        __privateMethod(this, _PDFPageView_instances, renderDrawLayer_fn).call(this);
      }
      __privateMethod(this, _PDFPageView_instances, renderAnnotationEditorLayer_fn).call(this);
    }
    if (redrawXfaLayer && this.xfaLayer) {
      __privateMethod(this, _PDFPageView_instances, renderXfaLayer_fn).call(this);
    }
    if (this.textLayer) {
      if (hideTextLayer) {
        this.textLayer.hide();
        (_a = this.structTreeLayer) == null ? void 0 : _a.hide();
      } else if (redrawTextLayer) {
        __privateMethod(this, _PDFPageView_instances, renderTextLayer_fn).call(this);
      }
    }
  }
  get width() {
    return this.viewport.width;
  }
  get height() {
    return this.viewport.height;
  }
  getPagePoint(x, y) {
    return this.viewport.convertToPdfPoint(x, y);
  }
  async draw() {
    if (this.renderingState !== RenderingStates.INITIAL) {
      console.error("Must be in new state before drawing");
      this.reset();
    }
    const {
      div,
      l10n,
      pageColors,
      pdfPage,
      viewport
    } = this;
    if (!pdfPage) {
      this.renderingState = RenderingStates.FINISHED;
      throw new Error("pdfPage is not loaded");
    }
    this.renderingState = RenderingStates.RUNNING;
    const canvasWrapper = document.createElement("div");
    canvasWrapper.classList.add("canvasWrapper");
    __privateMethod(this, _PDFPageView_instances, addLayer_fn).call(this, canvasWrapper, "canvasWrapper");
    if (!this.textLayer && __privateGet(this, _textLayerMode) !== TextLayerMode.DISABLE && !pdfPage.isPureXfa) {
      this._accessibilityManager || (this._accessibilityManager = new TextAccessibilityManager());
      this.textLayer = new TextLayerBuilder({
        pdfPage,
        highlighter: this._textHighlighter,
        accessibilityManager: this._accessibilityManager,
        enablePermissions: __privateGet(this, _textLayerMode) === TextLayerMode.ENABLE_PERMISSIONS,
        onAppend: (textLayerDiv) => {
          this.l10n.pause();
          __privateMethod(this, _PDFPageView_instances, addLayer_fn).call(this, textLayerDiv, "textLayer");
          this.l10n.resume();
        }
      });
    }
    if (!this.annotationLayer && __privateGet(this, _annotationMode) !== AnnotationMode.DISABLE) {
      const {
        annotationStorage,
        annotationEditorUIManager,
        downloadManager,
        enableScripting,
        fieldObjectsPromise,
        hasJSActionsPromise,
        linkService
      } = __privateGet(this, _layerProperties);
      this._annotationCanvasMap || (this._annotationCanvasMap = /* @__PURE__ */ new Map());
      this.annotationLayer = new AnnotationLayerBuilder({
        pdfPage,
        annotationStorage,
        imageResourcesPath: this.imageResourcesPath,
        renderForms: __privateGet(this, _annotationMode) === AnnotationMode.ENABLE_FORMS,
        linkService,
        downloadManager,
        enableScripting,
        hasJSActionsPromise,
        fieldObjectsPromise,
        annotationCanvasMap: this._annotationCanvasMap,
        accessibilityManager: this._accessibilityManager,
        annotationEditorUIManager,
        onAppend: (annotationLayerDiv) => {
          __privateMethod(this, _PDFPageView_instances, addLayer_fn).call(this, annotationLayerDiv, "annotationLayer");
        }
      });
    }
    const renderContinueCallback = (cont) => {
      showCanvas == null ? void 0 : showCanvas(false);
      if (this.renderingQueue && !this.renderingQueue.isHighestPriority(this)) {
        this.renderingState = RenderingStates.PAUSED;
        this.resume = () => {
          this.renderingState = RenderingStates.RUNNING;
          cont();
        };
        return;
      }
      cont();
    };
    const {
      width,
      height
    } = viewport;
    const canvas = document.createElement("canvas");
    canvas.setAttribute("role", "presentation");
    canvas.hidden = true;
    const hasHCM = !!((pageColors == null ? void 0 : pageColors.background) && (pageColors == null ? void 0 : pageColors.foreground));
    let showCanvas = (isLastShow) => {
      if (!hasHCM || isLastShow) {
        canvas.hidden = false;
        showCanvas = null;
      }
    };
    canvasWrapper.append(canvas);
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: !__privateGet(this, _enableHWA)
    });
    const outputScale = this.outputScale = new OutputScale();
    if (this.maxCanvasPixels === 0) {
      const invScale = 1 / this.scale;
      outputScale.sx *= invScale;
      outputScale.sy *= invScale;
      __privateSet(this, _hasRestrictedScaling, true);
    } else if (this.maxCanvasPixels > 0) {
      const pixelsInViewport = width * height;
      const maxScale = Math.sqrt(this.maxCanvasPixels / pixelsInViewport);
      if (outputScale.sx > maxScale || outputScale.sy > maxScale) {
        outputScale.sx = maxScale;
        outputScale.sy = maxScale;
        __privateSet(this, _hasRestrictedScaling, true);
      } else {
        __privateSet(this, _hasRestrictedScaling, false);
      }
    }
    const sfx = approximateFraction(outputScale.sx);
    const sfy = approximateFraction(outputScale.sy);
    canvas.width = floorToDivide(width * outputScale.sx, sfx[0]);
    canvas.height = floorToDivide(height * outputScale.sy, sfy[0]);
    const {
      style
    } = canvas;
    style.width = floorToDivide(width, sfx[1]) + "px";
    style.height = floorToDivide(height, sfy[1]) + "px";
    __privateGet(this, _viewportMap).set(canvas, viewport);
    const transform = outputScale.scaled ? [outputScale.sx, 0, 0, outputScale.sy, 0, 0] : null;
    const renderContext = {
      canvasContext: ctx,
      transform,
      viewport,
      annotationMode: __privateGet(this, _annotationMode),
      optionalContentConfigPromise: this._optionalContentConfigPromise,
      annotationCanvasMap: this._annotationCanvasMap,
      pageColors
    };
    const renderTask = this.renderTask = pdfPage.render(renderContext);
    renderTask.onContinue = renderContinueCallback;
    const resultPromise = renderTask.promise.then(async () => {
      var _a;
      showCanvas == null ? void 0 : showCanvas(true);
      await __privateMethod(this, _PDFPageView_instances, finishRenderTask_fn).call(this, renderTask);
      __privateMethod(this, _PDFPageView_instances, renderTextLayer_fn).call(this);
      if (this.annotationLayer) {
        await __privateMethod(this, _PDFPageView_instances, renderAnnotationLayer_fn).call(this);
      }
      const {
        annotationEditorUIManager
      } = __privateGet(this, _layerProperties);
      if (!annotationEditorUIManager) {
        return;
      }
      this.drawLayer || (this.drawLayer = new DrawLayerBuilder({
        pageIndex: this.id
      }));
      await __privateMethod(this, _PDFPageView_instances, renderDrawLayer_fn).call(this);
      this.drawLayer.setParent(canvasWrapper);
      if (!this.annotationEditorLayer) {
        this.annotationEditorLayer = new AnnotationEditorLayerBuilder({
          uiManager: annotationEditorUIManager,
          pdfPage,
          l10n,
          accessibilityManager: this._accessibilityManager,
          annotationLayer: (_a = this.annotationLayer) == null ? void 0 : _a.annotationLayer,
          textLayer: this.textLayer,
          drawLayer: this.drawLayer.getDrawLayer(),
          onAppend: (annotationEditorLayerDiv) => {
            __privateMethod(this, _PDFPageView_instances, addLayer_fn).call(this, annotationEditorLayerDiv, "annotationEditorLayer");
          }
        });
      }
      __privateMethod(this, _PDFPageView_instances, renderAnnotationEditorLayer_fn).call(this);
    }, (error) => {
      if (!(error instanceof RenderingCancelledException)) {
        showCanvas == null ? void 0 : showCanvas(true);
      }
      return __privateMethod(this, _PDFPageView_instances, finishRenderTask_fn).call(this, renderTask, error);
    });
    if (pdfPage.isPureXfa) {
      if (!this.xfaLayer) {
        const {
          annotationStorage,
          linkService
        } = __privateGet(this, _layerProperties);
        this.xfaLayer = new XfaLayerBuilder({
          pdfPage,
          annotationStorage,
          linkService
        });
      }
      __privateMethod(this, _PDFPageView_instances, renderXfaLayer_fn).call(this);
    }
    div.setAttribute("data-loaded", true);
    this.eventBus.dispatch("pagerender", {
      source: this,
      pageNumber: this.id
    });
    return resultPromise;
  }
  setPageLabel(label) {
    this.pageLabel = typeof label === "string" ? label : null;
    this.div.setAttribute("data-l10n-args", JSON.stringify({
      page: this.pageLabel ?? this.id
    }));
    if (this.pageLabel !== null) {
      this.div.setAttribute("data-page-label", this.pageLabel);
    } else {
      this.div.removeAttribute("data-page-label");
    }
  }
  get thumbnailCanvas() {
    const {
      directDrawing,
      initialOptionalContent,
      regularAnnotations
    } = __privateGet(this, _useThumbnailCanvas);
    return directDrawing && initialOptionalContent && regularAnnotations ? this.canvas : null;
  }
}
_annotationMode = new WeakMap();
_enableHWA = new WeakMap();
_hasRestrictedScaling = new WeakMap();
_layerProperties = new WeakMap();
_loadingId = new WeakMap();
_previousRotation = new WeakMap();
_renderError = new WeakMap();
_renderingState = new WeakMap();
_textLayerMode = new WeakMap();
_useThumbnailCanvas = new WeakMap();
_viewportMap = new WeakMap();
_layers = new WeakMap();
_PDFPageView_instances = new WeakSet();
addLayer_fn = function(div, name) {
  const pos = LAYERS_ORDER.get(name);
  const oldDiv = __privateGet(this, _layers)[pos];
  __privateGet(this, _layers)[pos] = div;
  if (oldDiv) {
    oldDiv.replaceWith(div);
    return;
  }
  for (let i = pos - 1; i >= 0; i--) {
    const layer = __privateGet(this, _layers)[i];
    if (layer) {
      layer.after(div);
      return;
    }
  }
  this.div.prepend(div);
};
setDimensions_fn = function() {
  const {
    viewport
  } = this;
  if (this.pdfPage) {
    if (__privateGet(this, _previousRotation) === viewport.rotation) {
      return;
    }
    __privateSet(this, _previousRotation, viewport.rotation);
  }
  setLayerDimensions(this.div, viewport, true, false);
};
dispatchLayerRendered_fn = function(name, error) {
  this.eventBus.dispatch(name, {
    source: this,
    pageNumber: this.id,
    error
  });
};
renderAnnotationLayer_fn = async function() {
  let error = null;
  try {
    await this.annotationLayer.render(this.viewport, "display");
  } catch (ex) {
    console.error(`#renderAnnotationLayer: "${ex}".`);
    error = ex;
  } finally {
    __privateMethod(this, _PDFPageView_instances, dispatchLayerRendered_fn).call(this, "annotationlayerrendered", error);
  }
};
renderAnnotationEditorLayer_fn = async function() {
  let error = null;
  try {
    await this.annotationEditorLayer.render(this.viewport, "display");
  } catch (ex) {
    console.error(`#renderAnnotationEditorLayer: "${ex}".`);
    error = ex;
  } finally {
    __privateMethod(this, _PDFPageView_instances, dispatchLayerRendered_fn).call(this, "annotationeditorlayerrendered", error);
  }
};
renderDrawLayer_fn = async function() {
  try {
    await this.drawLayer.render("display");
  } catch (ex) {
    console.error(`#renderDrawLayer: "${ex}".`);
  }
};
renderXfaLayer_fn = async function() {
  var _a;
  let error = null;
  try {
    const result = await this.xfaLayer.render(this.viewport, "display");
    if ((result == null ? void 0 : result.textDivs) && this._textHighlighter) {
      __privateMethod(this, _PDFPageView_instances, buildXfaTextContentItems_fn).call(this, result.textDivs);
    }
  } catch (ex) {
    console.error(`#renderXfaLayer: "${ex}".`);
    error = ex;
  } finally {
    if ((_a = this.xfaLayer) == null ? void 0 : _a.div) {
      this.l10n.pause();
      __privateMethod(this, _PDFPageView_instances, addLayer_fn).call(this, this.xfaLayer.div, "xfaLayer");
      this.l10n.resume();
    }
    __privateMethod(this, _PDFPageView_instances, dispatchLayerRendered_fn).call(this, "xfalayerrendered", error);
  }
};
renderTextLayer_fn = async function() {
  if (!this.textLayer) {
    return;
  }
  let error = null;
  try {
    await this.textLayer.render(this.viewport);
  } catch (ex) {
    if (ex instanceof AbortException) {
      return;
    }
    console.error(`#renderTextLayer: "${ex}".`);
    error = ex;
  }
  __privateMethod(this, _PDFPageView_instances, dispatchLayerRendered_fn).call(this, "textlayerrendered", error);
  __privateMethod(this, _PDFPageView_instances, renderStructTreeLayer_fn).call(this);
};
renderStructTreeLayer_fn = async function() {
  var _a, _b, _c;
  if (!this.textLayer) {
    return;
  }
  this.structTreeLayer || (this.structTreeLayer = new StructTreeLayerBuilder());
  const tree = await (!this.structTreeLayer.renderingDone ? this.pdfPage.getStructTree() : null);
  const treeDom = (_a = this.structTreeLayer) == null ? void 0 : _a.render(tree);
  if (treeDom) {
    this.l10n.pause();
    (_b = this.canvas) == null ? void 0 : _b.append(treeDom);
    this.l10n.resume();
  }
  (_c = this.structTreeLayer) == null ? void 0 : _c.show();
};
buildXfaTextContentItems_fn = async function(textDivs) {
  const text = await this.pdfPage.getTextContent();
  const items = [];
  for (const item of text.items) {
    items.push(item.str);
  }
  this._textHighlighter.setTextMapping(textDivs, items);
  this._textHighlighter.enable();
};
finishRenderTask_fn = async function(renderTask, error = null) {
  if (renderTask === this.renderTask) {
    this.renderTask = null;
  }
  if (error instanceof RenderingCancelledException) {
    __privateSet(this, _renderError, null);
    return;
  }
  __privateSet(this, _renderError, error);
  this.renderingState = RenderingStates.FINISHED;
  this._resetZoomLayer(true);
  __privateGet(this, _useThumbnailCanvas).regularAnnotations = !renderTask.separateAnnots;
  this.eventBus.dispatch("pagerendered", {
    source: this,
    pageNumber: this.id,
    cssTransform: false,
    timestamp: performance.now(),
    error: __privateGet(this, _renderError)
  });
  if (error) {
    throw error;
  }
};
async function docProperties(pdfDocument) {
  const url = "", baseUrl = url.split("#", 1)[0];
  let {
    info,
    metadata,
    contentDispositionFilename,
    contentLength
  } = await pdfDocument.getMetadata();
  if (!contentLength) {
    const {
      length
    } = await pdfDocument.getDownloadInfo();
    contentLength = length;
  }
  return {
    ...info,
    baseURL: baseUrl,
    filesize: contentLength,
    filename: contentDispositionFilename || getPdfFilenameFromUrl(url),
    metadata: metadata == null ? void 0 : metadata.getRaw(),
    authors: metadata == null ? void 0 : metadata.get("dc:creator"),
    numPages: pdfDocument.numPages,
    URL: url
  };
}
class GenericScripting {
  constructor(sandboxBundleSrc) {
    this._ready = new Promise((resolve, reject) => {
      const sandbox = import(
        /*webpackIgnore: true*/
        sandboxBundleSrc
      );
      sandbox.then((pdfjsSandbox) => {
        resolve(pdfjsSandbox.QuickJSSandbox());
      }).catch(reject);
    });
  }
  async createSandbox(data) {
    const sandbox = await this._ready;
    sandbox.create(data);
  }
  async dispatchEventInSandbox(event) {
    const sandbox = await this._ready;
    setTimeout(() => sandbox.dispatchEvent(event), 0);
  }
  async destroySandbox() {
    const sandbox = await this._ready;
    sandbox.nukeSandbox();
  }
}
class PDFScriptingManager {
  constructor({
    eventBus,
    externalServices = null,
    docProperties: docProperties2 = null
  }) {
    __privateAdd(this, _PDFScriptingManager_instances);
    __privateAdd(this, _closeCapability, null);
    __privateAdd(this, _destroyCapability, null);
    __privateAdd(this, _docProperties, null);
    __privateAdd(this, _eventAbortController4, null);
    __privateAdd(this, _eventBus, null);
    __privateAdd(this, _externalServices, null);
    __privateAdd(this, _pdfDocument, null);
    __privateAdd(this, _pdfViewer, null);
    __privateAdd(this, _ready, false);
    __privateAdd(this, _scripting, null);
    __privateAdd(this, _willPrintCapability, null);
    __privateSet(this, _eventBus, eventBus);
    __privateSet(this, _externalServices, externalServices);
    __privateSet(this, _docProperties, docProperties2);
  }
  setViewer(pdfViewer) {
    __privateSet(this, _pdfViewer, pdfViewer);
  }
  async setDocument(pdfDocument) {
    var _a;
    if (__privateGet(this, _pdfDocument)) {
      await __privateMethod(this, _PDFScriptingManager_instances, destroyScripting_fn).call(this);
    }
    __privateSet(this, _pdfDocument, pdfDocument);
    if (!pdfDocument) {
      return;
    }
    const [objects, calculationOrder, docActions] = await Promise.all([pdfDocument.getFieldObjects(), pdfDocument.getCalculationOrderIds(), pdfDocument.getJSActions()]);
    if (!objects && !docActions) {
      await __privateMethod(this, _PDFScriptingManager_instances, destroyScripting_fn).call(this);
      return;
    }
    if (pdfDocument !== __privateGet(this, _pdfDocument)) {
      return;
    }
    try {
      __privateSet(this, _scripting, __privateMethod(this, _PDFScriptingManager_instances, initScripting_fn).call(this));
    } catch (error) {
      console.error(`setDocument: "${error.message}".`);
      await __privateMethod(this, _PDFScriptingManager_instances, destroyScripting_fn).call(this);
      return;
    }
    const eventBus = __privateGet(this, _eventBus);
    __privateSet(this, _eventAbortController4, new AbortController());
    const {
      signal
    } = __privateGet(this, _eventAbortController4);
    eventBus._on("updatefromsandbox", (event) => {
      if ((event == null ? void 0 : event.source) === window) {
        __privateMethod(this, _PDFScriptingManager_instances, updateFromSandbox_fn).call(this, event.detail);
      }
    }, {
      signal
    });
    eventBus._on("dispatcheventinsandbox", (event) => {
      var _a2;
      (_a2 = __privateGet(this, _scripting)) == null ? void 0 : _a2.dispatchEventInSandbox(event.detail);
    }, {
      signal
    });
    eventBus._on("pagechanging", ({
      pageNumber,
      previous
    }) => {
      if (pageNumber === previous) {
        return;
      }
      __privateMethod(this, _PDFScriptingManager_instances, dispatchPageClose_fn).call(this, previous);
      __privateMethod(this, _PDFScriptingManager_instances, dispatchPageOpen_fn).call(this, pageNumber);
    }, {
      signal
    });
    eventBus._on("pagerendered", ({
      pageNumber
    }) => {
      if (!this._pageOpenPending.has(pageNumber)) {
        return;
      }
      if (pageNumber !== __privateGet(this, _pdfViewer).currentPageNumber) {
        return;
      }
      __privateMethod(this, _PDFScriptingManager_instances, dispatchPageOpen_fn).call(this, pageNumber);
    }, {
      signal
    });
    eventBus._on("pagesdestroy", async () => {
      var _a2, _b;
      await __privateMethod(this, _PDFScriptingManager_instances, dispatchPageClose_fn).call(this, __privateGet(this, _pdfViewer).currentPageNumber);
      await ((_a2 = __privateGet(this, _scripting)) == null ? void 0 : _a2.dispatchEventInSandbox({
        id: "doc",
        name: "WillClose"
      }));
      (_b = __privateGet(this, _closeCapability)) == null ? void 0 : _b.resolve();
    }, {
      signal
    });
    try {
      const docProperties2 = await __privateGet(this, _docProperties).call(this, pdfDocument);
      if (pdfDocument !== __privateGet(this, _pdfDocument)) {
        return;
      }
      await __privateGet(this, _scripting).createSandbox({
        objects,
        calculationOrder,
        appInfo: {
          platform: navigator.platform,
          language: navigator.language
        },
        docInfo: {
          ...docProperties2,
          actions: docActions
        }
      });
      eventBus.dispatch("sandboxcreated", {
        source: this
      });
    } catch (error) {
      console.error(`setDocument: "${error.message}".`);
      await __privateMethod(this, _PDFScriptingManager_instances, destroyScripting_fn).call(this);
      return;
    }
    await ((_a = __privateGet(this, _scripting)) == null ? void 0 : _a.dispatchEventInSandbox({
      id: "doc",
      name: "Open"
    }));
    await __privateMethod(this, _PDFScriptingManager_instances, dispatchPageOpen_fn).call(this, __privateGet(this, _pdfViewer).currentPageNumber, true);
    Promise.resolve().then(() => {
      if (pdfDocument === __privateGet(this, _pdfDocument)) {
        __privateSet(this, _ready, true);
      }
    });
  }
  async dispatchWillSave() {
    var _a;
    return (_a = __privateGet(this, _scripting)) == null ? void 0 : _a.dispatchEventInSandbox({
      id: "doc",
      name: "WillSave"
    });
  }
  async dispatchDidSave() {
    var _a;
    return (_a = __privateGet(this, _scripting)) == null ? void 0 : _a.dispatchEventInSandbox({
      id: "doc",
      name: "DidSave"
    });
  }
  async dispatchWillPrint() {
    var _a;
    if (!__privateGet(this, _scripting)) {
      return;
    }
    await ((_a = __privateGet(this, _willPrintCapability)) == null ? void 0 : _a.promise);
    __privateSet(this, _willPrintCapability, Promise.withResolvers());
    try {
      await __privateGet(this, _scripting).dispatchEventInSandbox({
        id: "doc",
        name: "WillPrint"
      });
    } catch (ex) {
      __privateGet(this, _willPrintCapability).resolve();
      __privateSet(this, _willPrintCapability, null);
      throw ex;
    }
    await __privateGet(this, _willPrintCapability).promise;
  }
  async dispatchDidPrint() {
    var _a;
    return (_a = __privateGet(this, _scripting)) == null ? void 0 : _a.dispatchEventInSandbox({
      id: "doc",
      name: "DidPrint"
    });
  }
  get destroyPromise() {
    var _a;
    return ((_a = __privateGet(this, _destroyCapability)) == null ? void 0 : _a.promise) || null;
  }
  get ready() {
    return __privateGet(this, _ready);
  }
  get _pageOpenPending() {
    return shadow(this, "_pageOpenPending", /* @__PURE__ */ new Set());
  }
  get _visitedPages() {
    return shadow(this, "_visitedPages", /* @__PURE__ */ new Map());
  }
}
_closeCapability = new WeakMap();
_destroyCapability = new WeakMap();
_docProperties = new WeakMap();
_eventAbortController4 = new WeakMap();
_eventBus = new WeakMap();
_externalServices = new WeakMap();
_pdfDocument = new WeakMap();
_pdfViewer = new WeakMap();
_ready = new WeakMap();
_scripting = new WeakMap();
_willPrintCapability = new WeakMap();
_PDFScriptingManager_instances = new WeakSet();
updateFromSandbox_fn = async function(detail) {
  var _a, _b;
  const pdfViewer = __privateGet(this, _pdfViewer);
  const isInPresentationMode = pdfViewer.isInPresentationMode || pdfViewer.isChangingPresentationMode;
  const {
    id,
    siblings,
    command,
    value
  } = detail;
  if (!id) {
    switch (command) {
      case "clear":
        console.clear();
        break;
      case "error":
        console.error(value);
        break;
      case "layout":
        if (!isInPresentationMode) {
          const modes = apiPageLayoutToViewerModes(value);
          pdfViewer.spreadMode = modes.spreadMode;
        }
        break;
      case "page-num":
        pdfViewer.currentPageNumber = value + 1;
        break;
      case "print":
        await pdfViewer.pagesPromise;
        __privateGet(this, _eventBus).dispatch("print", {
          source: this
        });
        break;
      case "println":
        console.log(value);
        break;
      case "zoom":
        if (!isInPresentationMode) {
          pdfViewer.currentScaleValue = value;
        }
        break;
      case "SaveAs":
        __privateGet(this, _eventBus).dispatch("download", {
          source: this
        });
        break;
      case "FirstPage":
        pdfViewer.currentPageNumber = 1;
        break;
      case "LastPage":
        pdfViewer.currentPageNumber = pdfViewer.pagesCount;
        break;
      case "NextPage":
        pdfViewer.nextPage();
        break;
      case "PrevPage":
        pdfViewer.previousPage();
        break;
      case "ZoomViewIn":
        if (!isInPresentationMode) {
          pdfViewer.increaseScale();
        }
        break;
      case "ZoomViewOut":
        if (!isInPresentationMode) {
          pdfViewer.decreaseScale();
        }
        break;
      case "WillPrintFinished":
        (_a = __privateGet(this, _willPrintCapability)) == null ? void 0 : _a.resolve();
        __privateSet(this, _willPrintCapability, null);
        break;
    }
    return;
  }
  if (isInPresentationMode && detail.focus) {
    return;
  }
  delete detail.id;
  delete detail.siblings;
  const ids = siblings ? [id, ...siblings] : [id];
  for (const elementId of ids) {
    const element = document.querySelector(`[data-element-id="${elementId}"]`);
    if (element) {
      element.dispatchEvent(new CustomEvent("updatefromsandbox", {
        detail
      }));
    } else {
      (_b = __privateGet(this, _pdfDocument)) == null ? void 0 : _b.annotationStorage.setValue(elementId, detail);
    }
  }
};
dispatchPageOpen_fn = async function(pageNumber, initialize = false) {
  const pdfDocument = __privateGet(this, _pdfDocument), visitedPages = this._visitedPages;
  if (initialize) {
    __privateSet(this, _closeCapability, Promise.withResolvers());
  }
  if (!__privateGet(this, _closeCapability)) {
    return;
  }
  const pageView = __privateGet(this, _pdfViewer).getPageView(pageNumber - 1);
  if ((pageView == null ? void 0 : pageView.renderingState) !== RenderingStates.FINISHED) {
    this._pageOpenPending.add(pageNumber);
    return;
  }
  this._pageOpenPending.delete(pageNumber);
  const actionsPromise = (async () => {
    var _a, _b;
    const actions = await (!visitedPages.has(pageNumber) ? (_a = pageView.pdfPage) == null ? void 0 : _a.getJSActions() : null);
    if (pdfDocument !== __privateGet(this, _pdfDocument)) {
      return;
    }
    await ((_b = __privateGet(this, _scripting)) == null ? void 0 : _b.dispatchEventInSandbox({
      id: "page",
      name: "PageOpen",
      pageNumber,
      actions
    }));
  })();
  visitedPages.set(pageNumber, actionsPromise);
};
dispatchPageClose_fn = async function(pageNumber) {
  var _a;
  const pdfDocument = __privateGet(this, _pdfDocument), visitedPages = this._visitedPages;
  if (!__privateGet(this, _closeCapability)) {
    return;
  }
  if (this._pageOpenPending.has(pageNumber)) {
    return;
  }
  const actionsPromise = visitedPages.get(pageNumber);
  if (!actionsPromise) {
    return;
  }
  visitedPages.set(pageNumber, null);
  await actionsPromise;
  if (pdfDocument !== __privateGet(this, _pdfDocument)) {
    return;
  }
  await ((_a = __privateGet(this, _scripting)) == null ? void 0 : _a.dispatchEventInSandbox({
    id: "page",
    name: "PageClose",
    pageNumber
  }));
};
initScripting_fn = function() {
  __privateSet(this, _destroyCapability, Promise.withResolvers());
  if (__privateGet(this, _scripting)) {
    throw new Error("#initScripting: Scripting already exists.");
  }
  return __privateGet(this, _externalServices).createScripting();
};
destroyScripting_fn = async function() {
  var _a, _b, _c, _d;
  if (!__privateGet(this, _scripting)) {
    __privateSet(this, _pdfDocument, null);
    (_a = __privateGet(this, _destroyCapability)) == null ? void 0 : _a.resolve();
    return;
  }
  if (__privateGet(this, _closeCapability)) {
    await Promise.race([__privateGet(this, _closeCapability).promise, new Promise((resolve) => {
      setTimeout(resolve, 1e3);
    })]).catch(() => {
    });
    __privateSet(this, _closeCapability, null);
  }
  __privateSet(this, _pdfDocument, null);
  try {
    await __privateGet(this, _scripting).destroySandbox();
  } catch {
  }
  (_b = __privateGet(this, _willPrintCapability)) == null ? void 0 : _b.reject(new Error("Scripting destroyed."));
  __privateSet(this, _willPrintCapability, null);
  (_c = __privateGet(this, _eventAbortController4)) == null ? void 0 : _c.abort();
  __privateSet(this, _eventAbortController4, null);
  this._pageOpenPending.clear();
  this._visitedPages.clear();
  __privateSet(this, _scripting, null);
  __privateSet(this, _ready, false);
  (_d = __privateGet(this, _destroyCapability)) == null ? void 0 : _d.resolve();
};
class PDFScriptingManagerComponents extends PDFScriptingManager {
  constructor(options) {
    if (!options.externalServices) {
      window.addEventListener("updatefromsandbox", (event) => {
        options.eventBus.dispatch("updatefromsandbox", {
          source: window,
          detail: event.detail
        });
      });
    }
    options.externalServices || (options.externalServices = {
      createScripting: () => new GenericScripting(options.sandboxBundleSrc)
    });
    options.docProperties || (options.docProperties = (pdfDocument) => docProperties(pdfDocument));
    super(options);
  }
}
const CLEANUP_TIMEOUT = 3e4;
class PDFRenderingQueue {
  constructor() {
    this.pdfViewer = null;
    this.pdfThumbnailViewer = null;
    this.onIdle = null;
    this.highestPriorityPage = null;
    this.idleTimeout = null;
    this.printing = false;
    this.isThumbnailViewEnabled = false;
    Object.defineProperty(this, "hasViewer", {
      value: () => !!this.pdfViewer
    });
  }
  setViewer(pdfViewer) {
    this.pdfViewer = pdfViewer;
  }
  setThumbnailViewer(pdfThumbnailViewer) {
    this.pdfThumbnailViewer = pdfThumbnailViewer;
  }
  isHighestPriority(view) {
    return this.highestPriorityPage === view.renderingId;
  }
  renderHighestPriority(currentlyVisiblePages) {
    var _a;
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
    if (this.pdfViewer.forceRendering(currentlyVisiblePages)) {
      return;
    }
    if (this.isThumbnailViewEnabled && ((_a = this.pdfThumbnailViewer) == null ? void 0 : _a.forceRendering())) {
      return;
    }
    if (this.printing) {
      return;
    }
    if (this.onIdle) {
      this.idleTimeout = setTimeout(this.onIdle.bind(this), CLEANUP_TIMEOUT);
    }
  }
  getHighestPriority(visible, views, scrolledDown, preRenderExtra = false) {
    const visibleViews = visible.views, numVisible = visibleViews.length;
    if (numVisible === 0) {
      return null;
    }
    for (let i = 0; i < numVisible; i++) {
      const view = visibleViews[i].view;
      if (!this.isViewFinished(view)) {
        return view;
      }
    }
    const firstId = visible.first.id, lastId = visible.last.id;
    if (lastId - firstId + 1 > numVisible) {
      const visibleIds = visible.ids;
      for (let i = 1, ii = lastId - firstId; i < ii; i++) {
        const holeId = scrolledDown ? firstId + i : lastId - i;
        if (visibleIds.has(holeId)) {
          continue;
        }
        const holeView = views[holeId - 1];
        if (!this.isViewFinished(holeView)) {
          return holeView;
        }
      }
    }
    let preRenderIndex = scrolledDown ? lastId : firstId - 2;
    let preRenderView = views[preRenderIndex];
    if (preRenderView && !this.isViewFinished(preRenderView)) {
      return preRenderView;
    }
    if (preRenderExtra) {
      preRenderIndex += scrolledDown ? 1 : -1;
      preRenderView = views[preRenderIndex];
      if (preRenderView && !this.isViewFinished(preRenderView)) {
        return preRenderView;
      }
    }
    return null;
  }
  isViewFinished(view) {
    return view.renderingState === RenderingStates.FINISHED;
  }
  renderView(view) {
    switch (view.renderingState) {
      case RenderingStates.FINISHED:
        return false;
      case RenderingStates.PAUSED:
        this.highestPriorityPage = view.renderingId;
        view.resume();
        break;
      case RenderingStates.RUNNING:
        this.highestPriorityPage = view.renderingId;
        break;
      case RenderingStates.INITIAL:
        this.highestPriorityPage = view.renderingId;
        view.draw().finally(() => {
          this.renderHighestPriority();
        }).catch((reason) => {
          if (reason instanceof RenderingCancelledException) {
            return;
          }
          console.error(`renderView: "${reason}"`);
        });
        break;
    }
    return true;
  }
}
const DEFAULT_CACHE_SIZE = 10;
const PagesCountLimit = {
  FORCE_SCROLL_MODE_PAGE: 1e4,
  FORCE_LAZY_PAGE_INIT: 5e3,
  PAUSE_EAGER_PAGE_INIT: 250
};
function isValidAnnotationEditorMode(mode) {
  return Object.values(AnnotationEditorType).includes(mode) && mode !== AnnotationEditorType.DISABLE;
}
class PDFPageViewBuffer {
  constructor(size) {
    __privateAdd(this, _PDFPageViewBuffer_instances);
    __privateAdd(this, _buf, /* @__PURE__ */ new Set());
    __privateAdd(this, _size, 0);
    __privateSet(this, _size, size);
  }
  push(view) {
    const buf = __privateGet(this, _buf);
    if (buf.has(view)) {
      buf.delete(view);
    }
    buf.add(view);
    if (buf.size > __privateGet(this, _size)) {
      __privateMethod(this, _PDFPageViewBuffer_instances, destroyFirstView_fn).call(this);
    }
  }
  resize(newSize, idsToKeep = null) {
    __privateSet(this, _size, newSize);
    const buf = __privateGet(this, _buf);
    if (idsToKeep) {
      const ii = buf.size;
      let i = 1;
      for (const view of buf) {
        if (idsToKeep.has(view.id)) {
          buf.delete(view);
          buf.add(view);
        }
        if (++i > ii) {
          break;
        }
      }
    }
    while (buf.size > __privateGet(this, _size)) {
      __privateMethod(this, _PDFPageViewBuffer_instances, destroyFirstView_fn).call(this);
    }
  }
  has(view) {
    return __privateGet(this, _buf).has(view);
  }
  [Symbol.iterator]() {
    return __privateGet(this, _buf).keys();
  }
}
_buf = new WeakMap();
_size = new WeakMap();
_PDFPageViewBuffer_instances = new WeakSet();
destroyFirstView_fn = function() {
  const firstView = __privateGet(this, _buf).keys().next().value;
  firstView == null ? void 0 : firstView.destroy();
  __privateGet(this, _buf).delete(firstView);
};
class PDFViewer {
  constructor(options) {
    __privateAdd(this, _PDFViewer_instances);
    __privateAdd(this, _buffer, null);
    __privateAdd(this, _altTextManager, null);
    __privateAdd(this, _annotationEditorHighlightColors, null);
    __privateAdd(this, _annotationEditorMode, AnnotationEditorType.NONE);
    __privateAdd(this, _annotationEditorUIManager, null);
    __privateAdd(this, _annotationMode2, AnnotationMode.ENABLE_FORMS);
    __privateAdd(this, _containerTopLeft, null);
    __privateAdd(this, _enableHWA2, false);
    __privateAdd(this, _enableHighlightFloatingButton, false);
    __privateAdd(this, _enablePermissions2, false);
    __privateAdd(this, _eventAbortController5, null);
    __privateAdd(this, _mlManager, null);
    __privateAdd(this, _getAllTextInProgress, false);
    __privateAdd(this, _hiddenCopyElement, null);
    __privateAdd(this, _interruptCopyCondition, false);
    __privateAdd(this, _previousContainerHeight, 0);
    __privateAdd(this, _resizeObserver, new ResizeObserver(__privateMethod(this, _PDFViewer_instances, resizeObserverCallback_fn).bind(this)));
    __privateAdd(this, _scrollModePageState, null);
    __privateAdd(this, _scaleTimeoutId, null);
    __privateAdd(this, _textLayerMode2, TextLayerMode.ENABLE);
    var _a, _b;
    const viewerVersion = "4.4.168";
    if (version !== viewerVersion) {
      throw new Error(`The API version "${version}" does not match the Viewer version "${viewerVersion}".`);
    }
    this.container = options.container;
    this.viewer = options.viewer || options.container.firstElementChild;
    if (((_a = this.container) == null ? void 0 : _a.tagName) !== "DIV" || ((_b = this.viewer) == null ? void 0 : _b.tagName) !== "DIV") {
      throw new Error("Invalid `container` and/or `viewer` option.");
    }
    if (this.container.offsetParent && getComputedStyle(this.container).position !== "absolute") {
      throw new Error("The `container` must be absolutely positioned.");
    }
    __privateGet(this, _resizeObserver).observe(this.container);
    this.eventBus = options.eventBus;
    this.linkService = options.linkService || new SimpleLinkService();
    this.downloadManager = options.downloadManager || null;
    this.findController = options.findController || null;
    __privateSet(this, _altTextManager, options.altTextManager || null);
    if (this.findController) {
      this.findController.onIsPageVisible = (pageNumber) => this._getVisiblePages().ids.has(pageNumber);
    }
    this._scriptingManager = options.scriptingManager || null;
    __privateSet(this, _textLayerMode2, options.textLayerMode ?? TextLayerMode.ENABLE);
    __privateSet(this, _annotationMode2, options.annotationMode ?? AnnotationMode.ENABLE_FORMS);
    __privateSet(this, _annotationEditorMode, options.annotationEditorMode ?? AnnotationEditorType.NONE);
    __privateSet(this, _annotationEditorHighlightColors, options.annotationEditorHighlightColors || null);
    __privateSet(this, _enableHighlightFloatingButton, options.enableHighlightFloatingButton === true);
    this.imageResourcesPath = options.imageResourcesPath || "";
    this.enablePrintAutoRotate = options.enablePrintAutoRotate || false;
    this.removePageBorders = options.removePageBorders || false;
    this.maxCanvasPixels = options.maxCanvasPixels;
    this.l10n = options.l10n;
    this.l10n || (this.l10n = new genericl10n_GenericL10n());
    __privateSet(this, _enablePermissions2, options.enablePermissions || false);
    this.pageColors = options.pageColors || null;
    __privateSet(this, _mlManager, options.mlManager || null);
    __privateSet(this, _enableHWA2, options.enableHWA || false);
    this.defaultRenderingQueue = !options.renderingQueue;
    if (this.defaultRenderingQueue) {
      this.renderingQueue = new PDFRenderingQueue();
      this.renderingQueue.setViewer(this);
    } else {
      this.renderingQueue = options.renderingQueue;
    }
    const {
      abortSignal
    } = options;
    abortSignal == null ? void 0 : abortSignal.addEventListener("abort", () => {
      __privateGet(this, _resizeObserver).disconnect();
      __privateSet(this, _resizeObserver, null);
    }, {
      once: true
    });
    this.scroll = watchScroll(this.container, this._scrollUpdate.bind(this), abortSignal);
    this.presentationModeState = PresentationModeState.UNKNOWN;
    this._resetView();
    if (this.removePageBorders) {
      this.viewer.classList.add("removePageBorders");
    }
    __privateMethod(this, _PDFViewer_instances, updateContainerHeightCss_fn).call(this);
    this.eventBus._on("thumbnailrendered", ({
      pageNumber,
      pdfPage
    }) => {
      const pageView = this._pages[pageNumber - 1];
      if (!__privateGet(this, _buffer).has(pageView)) {
        pdfPage == null ? void 0 : pdfPage.cleanup();
      }
    });
    if (!options.l10n) {
      this.l10n.translate(this.container);
    }
  }
  get pagesCount() {
    return this._pages.length;
  }
  getPageView(index) {
    return this._pages[index];
  }
  getCachedPageViews() {
    return new Set(__privateGet(this, _buffer));
  }
  get pageViewsReady() {
    return this._pages.every((pageView) => pageView == null ? void 0 : pageView.pdfPage);
  }
  get renderForms() {
    return __privateGet(this, _annotationMode2) === AnnotationMode.ENABLE_FORMS;
  }
  get enableScripting() {
    return !!this._scriptingManager;
  }
  get currentPageNumber() {
    return this._currentPageNumber;
  }
  set currentPageNumber(val) {
    if (!Number.isInteger(val)) {
      throw new Error("Invalid page number.");
    }
    if (!this.pdfDocument) {
      return;
    }
    if (!this._setCurrentPageNumber(val, true)) {
      console.error(`currentPageNumber: "${val}" is not a valid page.`);
    }
  }
  _setCurrentPageNumber(val, resetCurrentPageView = false) {
    var _a;
    if (this._currentPageNumber === val) {
      if (resetCurrentPageView) {
        __privateMethod(this, _PDFViewer_instances, resetCurrentPageView_fn).call(this);
      }
      return true;
    }
    if (!(0 < val && val <= this.pagesCount)) {
      return false;
    }
    const previous = this._currentPageNumber;
    this._currentPageNumber = val;
    this.eventBus.dispatch("pagechanging", {
      source: this,
      pageNumber: val,
      pageLabel: ((_a = this._pageLabels) == null ? void 0 : _a[val - 1]) ?? null,
      previous
    });
    if (resetCurrentPageView) {
      __privateMethod(this, _PDFViewer_instances, resetCurrentPageView_fn).call(this);
    }
    return true;
  }
  get currentPageLabel() {
    var _a;
    return ((_a = this._pageLabels) == null ? void 0 : _a[this._currentPageNumber - 1]) ?? null;
  }
  set currentPageLabel(val) {
    if (!this.pdfDocument) {
      return;
    }
    let page = val | 0;
    if (this._pageLabels) {
      const i = this._pageLabels.indexOf(val);
      if (i >= 0) {
        page = i + 1;
      }
    }
    if (!this._setCurrentPageNumber(page, true)) {
      console.error(`currentPageLabel: "${val}" is not a valid page.`);
    }
  }
  get currentScale() {
    return this._currentScale !== UNKNOWN_SCALE ? this._currentScale : DEFAULT_SCALE;
  }
  set currentScale(val) {
    if (isNaN(val)) {
      throw new Error("Invalid numeric scale.");
    }
    if (!this.pdfDocument) {
      return;
    }
    __privateMethod(this, _PDFViewer_instances, setScale_fn).call(this, val, {
      noScroll: false
    });
  }
  get currentScaleValue() {
    return this._currentScaleValue;
  }
  set currentScaleValue(val) {
    if (!this.pdfDocument) {
      return;
    }
    __privateMethod(this, _PDFViewer_instances, setScale_fn).call(this, val, {
      noScroll: false
    });
  }
  get pagesRotation() {
    return this._pagesRotation;
  }
  set pagesRotation(rotation) {
    if (!isValidRotation(rotation)) {
      throw new Error("Invalid pages rotation angle.");
    }
    if (!this.pdfDocument) {
      return;
    }
    rotation %= 360;
    if (rotation < 0) {
      rotation += 360;
    }
    if (this._pagesRotation === rotation) {
      return;
    }
    this._pagesRotation = rotation;
    const pageNumber = this._currentPageNumber;
    this.refresh(true, {
      rotation
    });
    if (this._currentScaleValue) {
      __privateMethod(this, _PDFViewer_instances, setScale_fn).call(this, this._currentScaleValue, {
        noScroll: true
      });
    }
    this.eventBus.dispatch("rotationchanging", {
      source: this,
      pagesRotation: rotation,
      pageNumber
    });
    if (this.defaultRenderingQueue) {
      this.update();
    }
  }
  get firstPagePromise() {
    return this.pdfDocument ? this._firstPageCapability.promise : null;
  }
  get onePageRendered() {
    return this.pdfDocument ? this._onePageRenderedCapability.promise : null;
  }
  get pagesPromise() {
    return this.pdfDocument ? this._pagesCapability.promise : null;
  }
  get _layerProperties() {
    const self = this;
    return shadow(this, "_layerProperties", {
      get annotationEditorUIManager() {
        return __privateGet(self, _annotationEditorUIManager);
      },
      get annotationStorage() {
        var _a;
        return (_a = self.pdfDocument) == null ? void 0 : _a.annotationStorage;
      },
      get downloadManager() {
        return self.downloadManager;
      },
      get enableScripting() {
        return !!self._scriptingManager;
      },
      get fieldObjectsPromise() {
        var _a;
        return (_a = self.pdfDocument) == null ? void 0 : _a.getFieldObjects();
      },
      get findController() {
        return self.findController;
      },
      get hasJSActionsPromise() {
        var _a;
        return (_a = self.pdfDocument) == null ? void 0 : _a.hasJSActions();
      },
      get linkService() {
        return self.linkService;
      }
    });
  }
  async getAllText() {
    const texts = [];
    const buffer = [];
    for (let pageNum = 1, pagesCount = this.pdfDocument.numPages; pageNum <= pagesCount; ++pageNum) {
      if (__privateGet(this, _interruptCopyCondition)) {
        return null;
      }
      buffer.length = 0;
      const page = await this.pdfDocument.getPage(pageNum);
      const {
        items
      } = await page.getTextContent();
      for (const item of items) {
        if (item.str) {
          buffer.push(item.str);
        }
        if (item.hasEOL) {
          buffer.push("\n");
        }
      }
      texts.push(removeNullCharacters(buffer.join("")));
    }
    return texts.join("\n");
  }
  setDocument(pdfDocument) {
    var _a, _b;
    if (this.pdfDocument) {
      this.eventBus.dispatch("pagesdestroy", {
        source: this
      });
      this._cancelRendering();
      this._resetView();
      (_a = this.findController) == null ? void 0 : _a.setDocument(null);
      (_b = this._scriptingManager) == null ? void 0 : _b.setDocument(null);
      if (__privateGet(this, _annotationEditorUIManager)) {
        __privateGet(this, _annotationEditorUIManager).destroy();
        __privateSet(this, _annotationEditorUIManager, null);
      }
    }
    this.pdfDocument = pdfDocument;
    if (!pdfDocument) {
      return;
    }
    const pagesCount = pdfDocument.numPages;
    const firstPagePromise = pdfDocument.getPage(1);
    const optionalContentConfigPromise = pdfDocument.getOptionalContentConfig({
      intent: "display"
    });
    const permissionsPromise = __privateGet(this, _enablePermissions2) ? pdfDocument.getPermissions() : Promise.resolve();
    const {
      eventBus,
      pageColors,
      viewer
    } = this;
    __privateSet(this, _eventAbortController5, new AbortController());
    const {
      signal
    } = __privateGet(this, _eventAbortController5);
    if (pagesCount > PagesCountLimit.FORCE_SCROLL_MODE_PAGE) {
      console.warn("Forcing PAGE-scrolling for performance reasons, given the length of the document.");
      const mode = this._scrollMode = ScrollMode.PAGE;
      eventBus.dispatch("scrollmodechanged", {
        source: this,
        mode
      });
    }
    this._pagesCapability.promise.then(() => {
      eventBus.dispatch("pagesloaded", {
        source: this,
        pagesCount
      });
    }, () => {
    });
    const onBeforeDraw = (evt) => {
      const pageView = this._pages[evt.pageNumber - 1];
      if (!pageView) {
        return;
      }
      __privateGet(this, _buffer).push(pageView);
    };
    eventBus._on("pagerender", onBeforeDraw, {
      signal
    });
    const onAfterDraw = (evt) => {
      if (evt.cssTransform) {
        return;
      }
      this._onePageRenderedCapability.resolve({
        timestamp: evt.timestamp
      });
      eventBus._off("pagerendered", onAfterDraw);
    };
    eventBus._on("pagerendered", onAfterDraw, {
      signal
    });
    Promise.all([firstPagePromise, permissionsPromise]).then(([firstPdfPage, permissions]) => {
      var _a2;
      if (pdfDocument !== this.pdfDocument) {
        return;
      }
      this._firstPageCapability.resolve(firstPdfPage);
      this._optionalContentConfigPromise = optionalContentConfigPromise;
      const {
        annotationEditorMode,
        annotationMode,
        textLayerMode
      } = __privateMethod(this, _PDFViewer_instances, initializePermissions_fn).call(this, permissions);
      if (textLayerMode !== TextLayerMode.DISABLE) {
        const element = __privateSet(this, _hiddenCopyElement, document.createElement("div"));
        element.id = "hiddenCopyElement";
        viewer.before(element);
      }
      if (annotationEditorMode !== AnnotationEditorType.DISABLE) {
        const mode = annotationEditorMode;
        if (pdfDocument.isPureXfa) {
          console.warn("Warning: XFA-editing is not implemented.");
        } else if (isValidAnnotationEditorMode(mode)) {
          __privateSet(this, _annotationEditorUIManager, new AnnotationEditorUIManager(this.container, viewer, __privateGet(this, _altTextManager), eventBus, pdfDocument, pageColors, __privateGet(this, _annotationEditorHighlightColors), __privateGet(this, _enableHighlightFloatingButton), __privateGet(this, _mlManager)));
          eventBus.dispatch("annotationeditoruimanager", {
            source: this,
            uiManager: __privateGet(this, _annotationEditorUIManager)
          });
          if (mode !== AnnotationEditorType.NONE) {
            __privateGet(this, _annotationEditorUIManager).updateMode(mode);
          }
        } else {
          console.error(`Invalid AnnotationEditor mode: ${mode}`);
        }
      }
      const viewerElement = this._scrollMode === ScrollMode.PAGE ? null : viewer;
      const scale = this.currentScale;
      const viewport = firstPdfPage.getViewport({
        scale: scale * PixelsPerInch.PDF_TO_CSS_UNITS
      });
      viewer.style.setProperty("--scale-factor", viewport.scale);
      if ((pageColors == null ? void 0 : pageColors.foreground) === "CanvasText" || (pageColors == null ? void 0 : pageColors.background) === "Canvas") {
        viewer.style.setProperty("--hcm-highlight-filter", pdfDocument.filterFactory.addHighlightHCMFilter("highlight", "CanvasText", "Canvas", "HighlightText", "Highlight"));
        viewer.style.setProperty("--hcm-highlight-selected-filter", pdfDocument.filterFactory.addHighlightHCMFilter("highlight_selected", "CanvasText", "Canvas", "HighlightText", "ButtonText"));
      }
      for (let pageNum = 1; pageNum <= pagesCount; ++pageNum) {
        const pageView = new PDFPageView({
          container: viewerElement,
          eventBus,
          id: pageNum,
          scale,
          defaultViewport: viewport.clone(),
          optionalContentConfigPromise,
          renderingQueue: this.renderingQueue,
          textLayerMode,
          annotationMode,
          imageResourcesPath: this.imageResourcesPath,
          maxCanvasPixels: this.maxCanvasPixels,
          pageColors,
          l10n: this.l10n,
          layerProperties: this._layerProperties,
          enableHWA: __privateGet(this, _enableHWA2)
        });
        this._pages.push(pageView);
      }
      (_a2 = this._pages[0]) == null ? void 0 : _a2.setPdfPage(firstPdfPage);
      if (this._scrollMode === ScrollMode.PAGE) {
        __privateMethod(this, _PDFViewer_instances, ensurePageViewVisible_fn).call(this);
      } else if (this._spreadMode !== SpreadMode.NONE) {
        this._updateSpreadMode();
      }
      __privateMethod(this, _PDFViewer_instances, onePageRenderedOrForceFetch_fn).call(this, signal).then(async () => {
        var _a3, _b2;
        if (pdfDocument !== this.pdfDocument) {
          return;
        }
        (_a3 = this.findController) == null ? void 0 : _a3.setDocument(pdfDocument);
        (_b2 = this._scriptingManager) == null ? void 0 : _b2.setDocument(pdfDocument);
        if (__privateGet(this, _hiddenCopyElement)) {
          document.addEventListener("copy", __privateMethod(this, _PDFViewer_instances, copyCallback_fn).bind(this, textLayerMode), {
            signal
          });
        }
        if (__privateGet(this, _annotationEditorUIManager)) {
          eventBus.dispatch("annotationeditormodechanged", {
            source: this,
            mode: __privateGet(this, _annotationEditorMode)
          });
        }
        if (pdfDocument.loadingParams.disableAutoFetch || pagesCount > PagesCountLimit.FORCE_LAZY_PAGE_INIT) {
          this._pagesCapability.resolve();
          return;
        }
        let getPagesLeft = pagesCount - 1;
        if (getPagesLeft <= 0) {
          this._pagesCapability.resolve();
          return;
        }
        for (let pageNum = 2; pageNum <= pagesCount; ++pageNum) {
          const promise = pdfDocument.getPage(pageNum).then((pdfPage) => {
            const pageView = this._pages[pageNum - 1];
            if (!pageView.pdfPage) {
              pageView.setPdfPage(pdfPage);
            }
            if (--getPagesLeft === 0) {
              this._pagesCapability.resolve();
            }
          }, (reason) => {
            console.error(`Unable to get page ${pageNum} to initialize viewer`, reason);
            if (--getPagesLeft === 0) {
              this._pagesCapability.resolve();
            }
          });
          if (pageNum % PagesCountLimit.PAUSE_EAGER_PAGE_INIT === 0) {
            await promise;
          }
        }
      });
      eventBus.dispatch("pagesinit", {
        source: this
      });
      pdfDocument.getMetadata().then(({
        info
      }) => {
        if (pdfDocument !== this.pdfDocument) {
          return;
        }
        if (info.Language) {
          viewer.lang = info.Language;
        }
      });
      if (this.defaultRenderingQueue) {
        this.update();
      }
    }).catch((reason) => {
      console.error("Unable to initialize viewer", reason);
      this._pagesCapability.reject(reason);
    });
  }
  setPageLabels(labels) {
    var _a;
    if (!this.pdfDocument) {
      return;
    }
    if (!labels) {
      this._pageLabels = null;
    } else if (!(Array.isArray(labels) && this.pdfDocument.numPages === labels.length)) {
      this._pageLabels = null;
      console.error(`setPageLabels: Invalid page labels.`);
    } else {
      this._pageLabels = labels;
    }
    for (let i = 0, ii = this._pages.length; i < ii; i++) {
      this._pages[i].setPageLabel(((_a = this._pageLabels) == null ? void 0 : _a[i]) ?? null);
    }
  }
  _resetView() {
    var _a, _b;
    this._pages = [];
    this._currentPageNumber = 1;
    this._currentScale = UNKNOWN_SCALE;
    this._currentScaleValue = null;
    this._pageLabels = null;
    __privateSet(this, _buffer, new PDFPageViewBuffer(DEFAULT_CACHE_SIZE));
    this._location = null;
    this._pagesRotation = 0;
    this._optionalContentConfigPromise = null;
    this._firstPageCapability = Promise.withResolvers();
    this._onePageRenderedCapability = Promise.withResolvers();
    this._pagesCapability = Promise.withResolvers();
    this._scrollMode = ScrollMode.VERTICAL;
    this._previousScrollMode = ScrollMode.UNKNOWN;
    this._spreadMode = SpreadMode.NONE;
    __privateSet(this, _scrollModePageState, {
      previousPageNumber: 1,
      scrollDown: true,
      pages: []
    });
    (_a = __privateGet(this, _eventAbortController5)) == null ? void 0 : _a.abort();
    __privateSet(this, _eventAbortController5, null);
    this.viewer.textContent = "";
    this._updateScrollMode();
    this.viewer.removeAttribute("lang");
    (_b = __privateGet(this, _hiddenCopyElement)) == null ? void 0 : _b.remove();
    __privateSet(this, _hiddenCopyElement, null);
  }
  _scrollUpdate() {
    if (this.pagesCount === 0) {
      return;
    }
    this.update();
  }
  pageLabelToPageNumber(label) {
    if (!this._pageLabels) {
      return null;
    }
    const i = this._pageLabels.indexOf(label);
    if (i < 0) {
      return null;
    }
    return i + 1;
  }
  scrollPageIntoView({
    pageNumber,
    destArray = null,
    allowNegativeOffset = false,
    ignoreDestinationZoom = false
  }) {
    if (!this.pdfDocument) {
      return;
    }
    const pageView = Number.isInteger(pageNumber) && this._pages[pageNumber - 1];
    if (!pageView) {
      console.error(`scrollPageIntoView: "${pageNumber}" is not a valid pageNumber parameter.`);
      return;
    }
    if (this.isInPresentationMode || !destArray) {
      this._setCurrentPageNumber(pageNumber, true);
      return;
    }
    let x = 0, y = 0;
    let width = 0, height = 0, widthScale, heightScale;
    const changeOrientation = pageView.rotation % 180 !== 0;
    const pageWidth = (changeOrientation ? pageView.height : pageView.width) / pageView.scale / PixelsPerInch.PDF_TO_CSS_UNITS;
    const pageHeight = (changeOrientation ? pageView.width : pageView.height) / pageView.scale / PixelsPerInch.PDF_TO_CSS_UNITS;
    let scale = 0;
    switch (destArray[1].name) {
      case "XYZ":
        x = destArray[2];
        y = destArray[3];
        scale = destArray[4];
        x = x !== null ? x : 0;
        y = y !== null ? y : pageHeight;
        break;
      case "Fit":
      case "FitB":
        scale = "page-fit";
        break;
      case "FitH":
      case "FitBH":
        y = destArray[2];
        scale = "page-width";
        if (y === null && this._location) {
          x = this._location.left;
          y = this._location.top;
        } else if (typeof y !== "number" || y < 0) {
          y = pageHeight;
        }
        break;
      case "FitV":
      case "FitBV":
        x = destArray[2];
        width = pageWidth;
        height = pageHeight;
        scale = "page-height";
        break;
      case "FitR":
        x = destArray[2];
        y = destArray[3];
        width = destArray[4] - x;
        height = destArray[5] - y;
        let hPadding = SCROLLBAR_PADDING, vPadding = VERTICAL_PADDING;
        if (this.removePageBorders) {
          hPadding = vPadding = 0;
        }
        widthScale = (this.container.clientWidth - hPadding) / width / PixelsPerInch.PDF_TO_CSS_UNITS;
        heightScale = (this.container.clientHeight - vPadding) / height / PixelsPerInch.PDF_TO_CSS_UNITS;
        scale = Math.min(Math.abs(widthScale), Math.abs(heightScale));
        break;
      default:
        console.error(`scrollPageIntoView: "${destArray[1].name}" is not a valid destination type.`);
        return;
    }
    if (!ignoreDestinationZoom) {
      if (scale && scale !== this._currentScale) {
        this.currentScaleValue = scale;
      } else if (this._currentScale === UNKNOWN_SCALE) {
        this.currentScaleValue = DEFAULT_SCALE_VALUE;
      }
    }
    if (scale === "page-fit" && !destArray[4]) {
      __privateMethod(this, _PDFViewer_instances, scrollIntoView_fn).call(this, pageView);
      return;
    }
    const boundingRect = [pageView.viewport.convertToViewportPoint(x, y), pageView.viewport.convertToViewportPoint(x + width, y + height)];
    let left = Math.min(boundingRect[0][0], boundingRect[1][0]);
    let top = Math.min(boundingRect[0][1], boundingRect[1][1]);
    if (!allowNegativeOffset) {
      left = Math.max(left, 0);
      top = Math.max(top, 0);
    }
    __privateMethod(this, _PDFViewer_instances, scrollIntoView_fn).call(this, pageView, {
      left,
      top
    });
  }
  _updateLocation(firstPage) {
    const currentScale = this._currentScale;
    const currentScaleValue = this._currentScaleValue;
    const normalizedScaleValue = parseFloat(currentScaleValue) === currentScale ? Math.round(currentScale * 1e4) / 100 : currentScaleValue;
    const pageNumber = firstPage.id;
    const currentPageView = this._pages[pageNumber - 1];
    const container = this.container;
    const topLeft = currentPageView.getPagePoint(container.scrollLeft - firstPage.x, container.scrollTop - firstPage.y);
    const intLeft = Math.round(topLeft[0]);
    const intTop = Math.round(topLeft[1]);
    let pdfOpenParams = `#page=${pageNumber}`;
    if (!this.isInPresentationMode) {
      pdfOpenParams += `&zoom=${normalizedScaleValue},${intLeft},${intTop}`;
    }
    this._location = {
      pageNumber,
      scale: normalizedScaleValue,
      top: intTop,
      left: intLeft,
      rotation: this._pagesRotation,
      pdfOpenParams
    };
  }
  update() {
    const visible = this._getVisiblePages();
    const visiblePages = visible.views, numVisiblePages = visiblePages.length;
    if (numVisiblePages === 0) {
      return;
    }
    const newCacheSize = Math.max(DEFAULT_CACHE_SIZE, 2 * numVisiblePages + 1);
    __privateGet(this, _buffer).resize(newCacheSize, visible.ids);
    this.renderingQueue.renderHighestPriority(visible);
    const isSimpleLayout = this._spreadMode === SpreadMode.NONE && (this._scrollMode === ScrollMode.PAGE || this._scrollMode === ScrollMode.VERTICAL);
    const currentId = this._currentPageNumber;
    let stillFullyVisible = false;
    for (const page of visiblePages) {
      if (page.percent < 100) {
        break;
      }
      if (page.id === currentId && isSimpleLayout) {
        stillFullyVisible = true;
        break;
      }
    }
    this._setCurrentPageNumber(stillFullyVisible ? currentId : visiblePages[0].id);
    this._updateLocation(visible.first);
    this.eventBus.dispatch("updateviewarea", {
      source: this,
      location: this._location
    });
  }
  containsElement(element) {
    return this.container.contains(element);
  }
  focus() {
    this.container.focus();
  }
  get _isContainerRtl() {
    return getComputedStyle(this.container).direction === "rtl";
  }
  get isInPresentationMode() {
    return this.presentationModeState === PresentationModeState.FULLSCREEN;
  }
  get isChangingPresentationMode() {
    return this.presentationModeState === PresentationModeState.CHANGING;
  }
  get isHorizontalScrollbarEnabled() {
    return this.isInPresentationMode ? false : this.container.scrollWidth > this.container.clientWidth;
  }
  get isVerticalScrollbarEnabled() {
    return this.isInPresentationMode ? false : this.container.scrollHeight > this.container.clientHeight;
  }
  _getVisiblePages() {
    const views = this._scrollMode === ScrollMode.PAGE ? __privateGet(this, _scrollModePageState).pages : this._pages, horizontal = this._scrollMode === ScrollMode.HORIZONTAL, rtl = horizontal && this._isContainerRtl;
    return getVisibleElements({
      scrollEl: this.container,
      views,
      sortByVisibility: true,
      horizontal,
      rtl
    });
  }
  cleanup() {
    for (const pageView of this._pages) {
      if (pageView.renderingState !== RenderingStates.FINISHED) {
        pageView.reset();
      }
    }
  }
  _cancelRendering() {
    for (const pageView of this._pages) {
      pageView.cancelRendering();
    }
  }
  forceRendering(currentlyVisiblePages) {
    const visiblePages = currentlyVisiblePages || this._getVisiblePages();
    const scrollAhead = __privateMethod(this, _PDFViewer_instances, getScrollAhead_fn).call(this, visiblePages);
    const preRenderExtra = this._spreadMode !== SpreadMode.NONE && this._scrollMode !== ScrollMode.HORIZONTAL;
    const pageView = this.renderingQueue.getHighestPriority(visiblePages, this._pages, scrollAhead, preRenderExtra);
    if (pageView) {
      __privateMethod(this, _PDFViewer_instances, ensurePdfPageLoaded_fn).call(this, pageView).then(() => {
        this.renderingQueue.renderView(pageView);
      });
      return true;
    }
    return false;
  }
  get hasEqualPageSizes() {
    const firstPageView = this._pages[0];
    for (let i = 1, ii = this._pages.length; i < ii; ++i) {
      const pageView = this._pages[i];
      if (pageView.width !== firstPageView.width || pageView.height !== firstPageView.height) {
        return false;
      }
    }
    return true;
  }
  getPagesOverview() {
    let initialOrientation;
    return this._pages.map((pageView) => {
      const viewport = pageView.pdfPage.getViewport({
        scale: 1
      });
      const orientation = isPortraitOrientation(viewport);
      if (initialOrientation === void 0) {
        initialOrientation = orientation;
      } else if (this.enablePrintAutoRotate && orientation !== initialOrientation) {
        return {
          width: viewport.height,
          height: viewport.width,
          rotation: (viewport.rotation - 90) % 360
        };
      }
      return {
        width: viewport.width,
        height: viewport.height,
        rotation: viewport.rotation
      };
    });
  }
  get optionalContentConfigPromise() {
    if (!this.pdfDocument) {
      return Promise.resolve(null);
    }
    if (!this._optionalContentConfigPromise) {
      console.error("optionalContentConfigPromise: Not initialized yet.");
      return this.pdfDocument.getOptionalContentConfig({
        intent: "display"
      });
    }
    return this._optionalContentConfigPromise;
  }
  set optionalContentConfigPromise(promise) {
    if (!(promise instanceof Promise)) {
      throw new Error(`Invalid optionalContentConfigPromise: ${promise}`);
    }
    if (!this.pdfDocument) {
      return;
    }
    if (!this._optionalContentConfigPromise) {
      return;
    }
    this._optionalContentConfigPromise = promise;
    this.refresh(false, {
      optionalContentConfigPromise: promise
    });
    this.eventBus.dispatch("optionalcontentconfigchanged", {
      source: this,
      promise
    });
  }
  get scrollMode() {
    return this._scrollMode;
  }
  set scrollMode(mode) {
    if (this._scrollMode === mode) {
      return;
    }
    if (!isValidScrollMode(mode)) {
      throw new Error(`Invalid scroll mode: ${mode}`);
    }
    if (this.pagesCount > PagesCountLimit.FORCE_SCROLL_MODE_PAGE) {
      return;
    }
    this._previousScrollMode = this._scrollMode;
    this._scrollMode = mode;
    this.eventBus.dispatch("scrollmodechanged", {
      source: this,
      mode
    });
    this._updateScrollMode(this._currentPageNumber);
  }
  _updateScrollMode(pageNumber = null) {
    const scrollMode = this._scrollMode, viewer = this.viewer;
    viewer.classList.toggle("scrollHorizontal", scrollMode === ScrollMode.HORIZONTAL);
    viewer.classList.toggle("scrollWrapped", scrollMode === ScrollMode.WRAPPED);
    if (!this.pdfDocument || !pageNumber) {
      return;
    }
    if (scrollMode === ScrollMode.PAGE) {
      __privateMethod(this, _PDFViewer_instances, ensurePageViewVisible_fn).call(this);
    } else if (this._previousScrollMode === ScrollMode.PAGE) {
      this._updateSpreadMode();
    }
    if (this._currentScaleValue && isNaN(this._currentScaleValue)) {
      __privateMethod(this, _PDFViewer_instances, setScale_fn).call(this, this._currentScaleValue, {
        noScroll: true
      });
    }
    this._setCurrentPageNumber(pageNumber, true);
    this.update();
  }
  get spreadMode() {
    return this._spreadMode;
  }
  set spreadMode(mode) {
    if (this._spreadMode === mode) {
      return;
    }
    if (!isValidSpreadMode(mode)) {
      throw new Error(`Invalid spread mode: ${mode}`);
    }
    this._spreadMode = mode;
    this.eventBus.dispatch("spreadmodechanged", {
      source: this,
      mode
    });
    this._updateSpreadMode(this._currentPageNumber);
  }
  _updateSpreadMode(pageNumber = null) {
    if (!this.pdfDocument) {
      return;
    }
    const viewer = this.viewer, pages = this._pages;
    if (this._scrollMode === ScrollMode.PAGE) {
      __privateMethod(this, _PDFViewer_instances, ensurePageViewVisible_fn).call(this);
    } else {
      viewer.textContent = "";
      if (this._spreadMode === SpreadMode.NONE) {
        for (const pageView of this._pages) {
          viewer.append(pageView.div);
        }
      } else {
        const parity = this._spreadMode - 1;
        let spread = null;
        for (let i = 0, ii = pages.length; i < ii; ++i) {
          if (spread === null) {
            spread = document.createElement("div");
            spread.className = "spread";
            viewer.append(spread);
          } else if (i % 2 === parity) {
            spread = spread.cloneNode(false);
            viewer.append(spread);
          }
          spread.append(pages[i].div);
        }
      }
    }
    if (!pageNumber) {
      return;
    }
    if (this._currentScaleValue && isNaN(this._currentScaleValue)) {
      __privateMethod(this, _PDFViewer_instances, setScale_fn).call(this, this._currentScaleValue, {
        noScroll: true
      });
    }
    this._setCurrentPageNumber(pageNumber, true);
    this.update();
  }
  _getPageAdvance(currentPageNumber, previous = false) {
    switch (this._scrollMode) {
      case ScrollMode.WRAPPED: {
        const {
          views
        } = this._getVisiblePages(), pageLayout = /* @__PURE__ */ new Map();
        for (const {
          id,
          y,
          percent,
          widthPercent
        } of views) {
          if (percent === 0 || widthPercent < 100) {
            continue;
          }
          let yArray = pageLayout.get(y);
          if (!yArray) {
            pageLayout.set(y, yArray || (yArray = []));
          }
          yArray.push(id);
        }
        for (const yArray of pageLayout.values()) {
          const currentIndex = yArray.indexOf(currentPageNumber);
          if (currentIndex === -1) {
            continue;
          }
          const numPages = yArray.length;
          if (numPages === 1) {
            break;
          }
          if (previous) {
            for (let i = currentIndex - 1, ii = 0; i >= ii; i--) {
              const currentId = yArray[i], expectedId = yArray[i + 1] - 1;
              if (currentId < expectedId) {
                return currentPageNumber - expectedId;
              }
            }
          } else {
            for (let i = currentIndex + 1, ii = numPages; i < ii; i++) {
              const currentId = yArray[i], expectedId = yArray[i - 1] + 1;
              if (currentId > expectedId) {
                return expectedId - currentPageNumber;
              }
            }
          }
          if (previous) {
            const firstId = yArray[0];
            if (firstId < currentPageNumber) {
              return currentPageNumber - firstId + 1;
            }
          } else {
            const lastId = yArray[numPages - 1];
            if (lastId > currentPageNumber) {
              return lastId - currentPageNumber + 1;
            }
          }
          break;
        }
        break;
      }
      case ScrollMode.HORIZONTAL: {
        break;
      }
      case ScrollMode.PAGE:
      case ScrollMode.VERTICAL: {
        if (this._spreadMode === SpreadMode.NONE) {
          break;
        }
        const parity = this._spreadMode - 1;
        if (previous && currentPageNumber % 2 !== parity) {
          break;
        } else if (!previous && currentPageNumber % 2 === parity) {
          break;
        }
        const {
          views
        } = this._getVisiblePages(), expectedId = previous ? currentPageNumber - 1 : currentPageNumber + 1;
        for (const {
          id,
          percent,
          widthPercent
        } of views) {
          if (id !== expectedId) {
            continue;
          }
          if (percent > 0 && widthPercent === 100) {
            return 2;
          }
          break;
        }
        break;
      }
    }
    return 1;
  }
  nextPage() {
    const currentPageNumber = this._currentPageNumber, pagesCount = this.pagesCount;
    if (currentPageNumber >= pagesCount) {
      return false;
    }
    const advance = this._getPageAdvance(currentPageNumber, false) || 1;
    this.currentPageNumber = Math.min(currentPageNumber + advance, pagesCount);
    return true;
  }
  previousPage() {
    const currentPageNumber = this._currentPageNumber;
    if (currentPageNumber <= 1) {
      return false;
    }
    const advance = this._getPageAdvance(currentPageNumber, true) || 1;
    this.currentPageNumber = Math.max(currentPageNumber - advance, 1);
    return true;
  }
  updateScale({
    drawingDelay,
    scaleFactor = null,
    steps = null,
    origin
  }) {
    if (steps === null && scaleFactor === null) {
      throw new Error("Invalid updateScale options: either `steps` or `scaleFactor` must be provided.");
    }
    if (!this.pdfDocument) {
      return;
    }
    let newScale = this._currentScale;
    if (scaleFactor > 0 && scaleFactor !== 1) {
      newScale = Math.round(newScale * scaleFactor * 100) / 100;
    } else if (steps) {
      const delta = steps > 0 ? DEFAULT_SCALE_DELTA : 1 / DEFAULT_SCALE_DELTA;
      const round = steps > 0 ? Math.ceil : Math.floor;
      steps = Math.abs(steps);
      do {
        newScale = round((newScale * delta).toFixed(2) * 10) / 10;
      } while (--steps > 0);
    }
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    __privateMethod(this, _PDFViewer_instances, setScale_fn).call(this, newScale, {
      noScroll: false,
      drawingDelay,
      origin
    });
  }
  increaseScale(options = {}) {
    this.updateScale({
      ...options,
      steps: options.steps ?? 1
    });
  }
  decreaseScale(options = {}) {
    this.updateScale({
      ...options,
      steps: -(options.steps ?? 1)
    });
  }
  get containerTopLeft() {
    return __privateGet(this, _containerTopLeft) || __privateSet(this, _containerTopLeft, [this.container.offsetTop, this.container.offsetLeft]);
  }
  get annotationEditorMode() {
    return __privateGet(this, _annotationEditorUIManager) ? __privateGet(this, _annotationEditorMode) : AnnotationEditorType.DISABLE;
  }
  set annotationEditorMode({
    mode,
    editId = null,
    isFromKeyboard = false
  }) {
    if (!__privateGet(this, _annotationEditorUIManager)) {
      throw new Error(`The AnnotationEditor is not enabled.`);
    }
    if (__privateGet(this, _annotationEditorMode) === mode) {
      return;
    }
    if (!isValidAnnotationEditorMode(mode)) {
      throw new Error(`Invalid AnnotationEditor mode: ${mode}`);
    }
    if (!this.pdfDocument) {
      return;
    }
    __privateSet(this, _annotationEditorMode, mode);
    this.eventBus.dispatch("annotationeditormodechanged", {
      source: this,
      mode
    });
    __privateGet(this, _annotationEditorUIManager).updateMode(mode, editId, isFromKeyboard);
  }
  set annotationEditorParams({
    type,
    value
  }) {
    if (!__privateGet(this, _annotationEditorUIManager)) {
      throw new Error(`The AnnotationEditor is not enabled.`);
    }
    __privateGet(this, _annotationEditorUIManager).updateParams(type, value);
  }
  refresh(noUpdate = false, updateArgs = /* @__PURE__ */ Object.create(null)) {
    if (!this.pdfDocument) {
      return;
    }
    for (const pageView of this._pages) {
      pageView.update(updateArgs);
    }
    if (__privateGet(this, _scaleTimeoutId) !== null) {
      clearTimeout(__privateGet(this, _scaleTimeoutId));
      __privateSet(this, _scaleTimeoutId, null);
    }
    if (!noUpdate) {
      this.update();
    }
  }
}
_buffer = new WeakMap();
_altTextManager = new WeakMap();
_annotationEditorHighlightColors = new WeakMap();
_annotationEditorMode = new WeakMap();
_annotationEditorUIManager = new WeakMap();
_annotationMode2 = new WeakMap();
_containerTopLeft = new WeakMap();
_enableHWA2 = new WeakMap();
_enableHighlightFloatingButton = new WeakMap();
_enablePermissions2 = new WeakMap();
_eventAbortController5 = new WeakMap();
_mlManager = new WeakMap();
_getAllTextInProgress = new WeakMap();
_hiddenCopyElement = new WeakMap();
_interruptCopyCondition = new WeakMap();
_previousContainerHeight = new WeakMap();
_resizeObserver = new WeakMap();
_scrollModePageState = new WeakMap();
_scaleTimeoutId = new WeakMap();
_textLayerMode2 = new WeakMap();
_PDFViewer_instances = new WeakSet();
initializePermissions_fn = function(permissions) {
  const params = {
    annotationEditorMode: __privateGet(this, _annotationEditorMode),
    annotationMode: __privateGet(this, _annotationMode2),
    textLayerMode: __privateGet(this, _textLayerMode2)
  };
  if (!permissions) {
    return params;
  }
  if (!permissions.includes(PermissionFlag.COPY) && __privateGet(this, _textLayerMode2) === TextLayerMode.ENABLE) {
    params.textLayerMode = TextLayerMode.ENABLE_PERMISSIONS;
  }
  if (!permissions.includes(PermissionFlag.MODIFY_CONTENTS)) {
    params.annotationEditorMode = AnnotationEditorType.DISABLE;
  }
  if (!permissions.includes(PermissionFlag.MODIFY_ANNOTATIONS) && !permissions.includes(PermissionFlag.FILL_INTERACTIVE_FORMS) && __privateGet(this, _annotationMode2) === AnnotationMode.ENABLE_FORMS) {
    params.annotationMode = AnnotationMode.ENABLE;
  }
  return params;
};
onePageRenderedOrForceFetch_fn = async function(signal) {
  if (document.visibilityState === "hidden" || !this.container.offsetParent || this._getVisiblePages().views.length === 0) {
    return;
  }
  const hiddenCapability = Promise.withResolvers();
  function onVisibilityChange() {
    if (document.visibilityState === "hidden") {
      hiddenCapability.resolve();
    }
  }
  document.addEventListener("visibilitychange", onVisibilityChange, {
    signal
  });
  await Promise.race([this._onePageRenderedCapability.promise, hiddenCapability.promise]);
  document.removeEventListener("visibilitychange", onVisibilityChange);
};
copyCallback_fn = function(textLayerMode, event) {
  const selection = document.getSelection();
  const {
    focusNode,
    anchorNode
  } = selection;
  if (anchorNode && focusNode && selection.containsNode(__privateGet(this, _hiddenCopyElement))) {
    if (__privateGet(this, _getAllTextInProgress) || textLayerMode === TextLayerMode.ENABLE_PERMISSIONS) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    __privateSet(this, _getAllTextInProgress, true);
    const {
      classList
    } = this.viewer;
    classList.add("copyAll");
    const ac = new AbortController();
    window.addEventListener("keydown", (ev) => __privateSet(this, _interruptCopyCondition, ev.key === "Escape"), {
      signal: ac.signal
    });
    this.getAllText().then(async (text) => {
      if (text !== null) {
        await navigator.clipboard.writeText(text);
      }
    }).catch((reason) => {
      console.warn(`Something goes wrong when extracting the text: ${reason.message}`);
    }).finally(() => {
      __privateSet(this, _getAllTextInProgress, false);
      __privateSet(this, _interruptCopyCondition, false);
      ac.abort();
      classList.remove("copyAll");
    });
    event.preventDefault();
    event.stopPropagation();
  }
};
ensurePageViewVisible_fn = function() {
  if (this._scrollMode !== ScrollMode.PAGE) {
    throw new Error("#ensurePageViewVisible: Invalid scrollMode value.");
  }
  const pageNumber = this._currentPageNumber, state = __privateGet(this, _scrollModePageState), viewer = this.viewer;
  viewer.textContent = "";
  state.pages.length = 0;
  if (this._spreadMode === SpreadMode.NONE && !this.isInPresentationMode) {
    const pageView = this._pages[pageNumber - 1];
    viewer.append(pageView.div);
    state.pages.push(pageView);
  } else {
    const pageIndexSet = /* @__PURE__ */ new Set(), parity = this._spreadMode - 1;
    if (parity === -1) {
      pageIndexSet.add(pageNumber - 1);
    } else if (pageNumber % 2 !== parity) {
      pageIndexSet.add(pageNumber - 1);
      pageIndexSet.add(pageNumber);
    } else {
      pageIndexSet.add(pageNumber - 2);
      pageIndexSet.add(pageNumber - 1);
    }
    const spread = document.createElement("div");
    spread.className = "spread";
    if (this.isInPresentationMode) {
      const dummyPage = document.createElement("div");
      dummyPage.className = "dummyPage";
      spread.append(dummyPage);
    }
    for (const i of pageIndexSet) {
      const pageView = this._pages[i];
      if (!pageView) {
        continue;
      }
      spread.append(pageView.div);
      state.pages.push(pageView);
    }
    viewer.append(spread);
  }
  state.scrollDown = pageNumber >= state.previousPageNumber;
  state.previousPageNumber = pageNumber;
};
scrollIntoView_fn = function(pageView, pageSpot = null) {
  const {
    div,
    id
  } = pageView;
  if (this._currentPageNumber !== id) {
    this._setCurrentPageNumber(id);
  }
  if (this._scrollMode === ScrollMode.PAGE) {
    __privateMethod(this, _PDFViewer_instances, ensurePageViewVisible_fn).call(this);
    this.update();
  }
  if (!pageSpot && !this.isInPresentationMode) {
    const left = div.offsetLeft + div.clientLeft, right = left + div.clientWidth;
    const {
      scrollLeft,
      clientWidth
    } = this.container;
    if (this._scrollMode === ScrollMode.HORIZONTAL || left < scrollLeft || right > scrollLeft + clientWidth) {
      pageSpot = {
        left: 0,
        top: 0
      };
    }
  }
  scrollIntoView(div, pageSpot);
  if (!this._currentScaleValue && this._location) {
    this._location = null;
  }
};
isSameScale_fn = function(newScale) {
  return newScale === this._currentScale || Math.abs(newScale - this._currentScale) < 1e-15;
};
setScaleUpdatePages_fn = function(newScale, newValue, {
  noScroll = false,
  preset = false,
  drawingDelay = -1,
  origin = null
}) {
  this._currentScaleValue = newValue.toString();
  if (__privateMethod(this, _PDFViewer_instances, isSameScale_fn).call(this, newScale)) {
    if (preset) {
      this.eventBus.dispatch("scalechanging", {
        source: this,
        scale: newScale,
        presetValue: newValue
      });
    }
    return;
  }
  this.viewer.style.setProperty("--scale-factor", newScale * PixelsPerInch.PDF_TO_CSS_UNITS);
  const postponeDrawing = drawingDelay >= 0 && drawingDelay < 1e3;
  this.refresh(true, {
    scale: newScale,
    drawingDelay: postponeDrawing ? drawingDelay : -1
  });
  if (postponeDrawing) {
    __privateSet(this, _scaleTimeoutId, setTimeout(() => {
      __privateSet(this, _scaleTimeoutId, null);
      this.refresh();
    }, drawingDelay));
  }
  const previousScale = this._currentScale;
  this._currentScale = newScale;
  if (!noScroll) {
    let page = this._currentPageNumber, dest;
    if (this._location && !(this.isInPresentationMode || this.isChangingPresentationMode)) {
      page = this._location.pageNumber;
      dest = [null, {
        name: "XYZ"
      }, this._location.left, this._location.top, null];
    }
    this.scrollPageIntoView({
      pageNumber: page,
      destArray: dest,
      allowNegativeOffset: true
    });
    if (Array.isArray(origin)) {
      const scaleDiff = newScale / previousScale - 1;
      const [top, left] = this.containerTopLeft;
      this.container.scrollLeft += (origin[0] - left) * scaleDiff;
      this.container.scrollTop += (origin[1] - top) * scaleDiff;
    }
  }
  this.eventBus.dispatch("scalechanging", {
    source: this,
    scale: newScale,
    presetValue: preset ? newValue : void 0
  });
  if (this.defaultRenderingQueue) {
    this.update();
  }
};
pageWidthScaleFactor_get = function() {
  if (this._spreadMode !== SpreadMode.NONE && this._scrollMode !== ScrollMode.HORIZONTAL) {
    return 2;
  }
  return 1;
};
setScale_fn = function(value, options) {
  let scale = parseFloat(value);
  if (scale > 0) {
    options.preset = false;
    __privateMethod(this, _PDFViewer_instances, setScaleUpdatePages_fn).call(this, scale, value, options);
  } else {
    const currentPage = this._pages[this._currentPageNumber - 1];
    if (!currentPage) {
      return;
    }
    let hPadding = SCROLLBAR_PADDING, vPadding = VERTICAL_PADDING;
    if (this.isInPresentationMode) {
      hPadding = vPadding = 4;
      if (this._spreadMode !== SpreadMode.NONE) {
        hPadding *= 2;
      }
    } else if (this.removePageBorders) {
      hPadding = vPadding = 0;
    } else if (this._scrollMode === ScrollMode.HORIZONTAL) {
      [hPadding, vPadding] = [vPadding, hPadding];
    }
    const pageWidthScale = (this.container.clientWidth - hPadding) / currentPage.width * currentPage.scale / __privateGet(this, _PDFViewer_instances, pageWidthScaleFactor_get);
    const pageHeightScale = (this.container.clientHeight - vPadding) / currentPage.height * currentPage.scale;
    switch (value) {
      case "page-actual":
        scale = 1;
        break;
      case "page-width":
        scale = pageWidthScale;
        break;
      case "page-height":
        scale = pageHeightScale;
        break;
      case "page-fit":
        scale = Math.min(pageWidthScale, pageHeightScale);
        break;
      case "auto":
        const horizontalScale = isPortraitOrientation(currentPage) ? pageWidthScale : Math.min(pageHeightScale, pageWidthScale);
        scale = Math.min(MAX_AUTO_SCALE, horizontalScale);
        break;
      default:
        console.error(`#setScale: "${value}" is an unknown zoom value.`);
        return;
    }
    options.preset = true;
    __privateMethod(this, _PDFViewer_instances, setScaleUpdatePages_fn).call(this, scale, value, options);
  }
};
resetCurrentPageView_fn = function() {
  const pageView = this._pages[this._currentPageNumber - 1];
  if (this.isInPresentationMode) {
    __privateMethod(this, _PDFViewer_instances, setScale_fn).call(this, this._currentScaleValue, {
      noScroll: true
    });
  }
  __privateMethod(this, _PDFViewer_instances, scrollIntoView_fn).call(this, pageView);
};
ensurePdfPageLoaded_fn = async function(pageView) {
  if (pageView.pdfPage) {
    return pageView.pdfPage;
  }
  try {
    const pdfPage = await this.pdfDocument.getPage(pageView.id);
    if (!pageView.pdfPage) {
      pageView.setPdfPage(pdfPage);
    }
    return pdfPage;
  } catch (reason) {
    console.error("Unable to get page for page view", reason);
    return null;
  }
};
getScrollAhead_fn = function(visible) {
  var _a, _b;
  if (((_a = visible.first) == null ? void 0 : _a.id) === 1) {
    return true;
  } else if (((_b = visible.last) == null ? void 0 : _b.id) === this.pagesCount) {
    return false;
  }
  switch (this._scrollMode) {
    case ScrollMode.PAGE:
      return __privateGet(this, _scrollModePageState).scrollDown;
    case ScrollMode.HORIZONTAL:
      return this.scroll.right;
  }
  return this.scroll.down;
};
updateContainerHeightCss_fn = function(height = this.container.clientHeight) {
  if (height !== __privateGet(this, _previousContainerHeight)) {
    __privateSet(this, _previousContainerHeight, height);
    docStyle.setProperty("--viewer-container-height", `${height}px`);
  }
};
resizeObserverCallback_fn = function(entries) {
  for (const entry of entries) {
    if (entry.target === this.container) {
      __privateMethod(this, _PDFViewer_instances, updateContainerHeightCss_fn).call(this, Math.floor(entry.borderBoxSize[0].blockSize));
      __privateSet(this, _containerTopLeft, null);
      break;
    }
  }
};
class PDFSinglePageViewer extends PDFViewer {
  _resetView() {
    super._resetView();
    this._scrollMode = ScrollMode.PAGE;
    this._spreadMode = SpreadMode.NONE;
  }
  set scrollMode(mode) {
  }
  _updateScrollMode() {
  }
  set spreadMode(mode) {
  }
  _updateSpreadMode() {
  }
}
var __webpack_exports__AnnotationLayerBuilder = __webpack_exports__.AnnotationLayerBuilder;
var __webpack_exports__DownloadManager = __webpack_exports__.DownloadManager;
var __webpack_exports__EventBus = __webpack_exports__.EventBus;
var __webpack_exports__FindState = __webpack_exports__.FindState;
var __webpack_exports__GenericL10n = __webpack_exports__.GenericL10n;
var __webpack_exports__LinkTarget = __webpack_exports__.LinkTarget;
var __webpack_exports__PDFFindController = __webpack_exports__.PDFFindController;
var __webpack_exports__PDFHistory = __webpack_exports__.PDFHistory;
var __webpack_exports__PDFLinkService = __webpack_exports__.PDFLinkService;
var __webpack_exports__PDFPageView = __webpack_exports__.PDFPageView;
var __webpack_exports__PDFScriptingManager = __webpack_exports__.PDFScriptingManager;
var __webpack_exports__PDFSinglePageViewer = __webpack_exports__.PDFSinglePageViewer;
var __webpack_exports__PDFViewer = __webpack_exports__.PDFViewer;
var __webpack_exports__ProgressBar = __webpack_exports__.ProgressBar;
var __webpack_exports__RenderingStates = __webpack_exports__.RenderingStates;
var __webpack_exports__ScrollMode = __webpack_exports__.ScrollMode;
var __webpack_exports__SimpleLinkService = __webpack_exports__.SimpleLinkService;
var __webpack_exports__SpreadMode = __webpack_exports__.SpreadMode;
var __webpack_exports__StructTreeLayerBuilder = __webpack_exports__.StructTreeLayerBuilder;
var __webpack_exports__TextLayerBuilder = __webpack_exports__.TextLayerBuilder;
var __webpack_exports__XfaLayerBuilder = __webpack_exports__.XfaLayerBuilder;
var __webpack_exports__parseQueryString = __webpack_exports__.parseQueryString;
export {
  __webpack_exports__AnnotationLayerBuilder as AnnotationLayerBuilder,
  __webpack_exports__DownloadManager as DownloadManager,
  __webpack_exports__EventBus as EventBus,
  __webpack_exports__FindState as FindState,
  __webpack_exports__GenericL10n as GenericL10n,
  __webpack_exports__LinkTarget as LinkTarget,
  __webpack_exports__PDFFindController as PDFFindController,
  __webpack_exports__PDFHistory as PDFHistory,
  __webpack_exports__PDFLinkService as PDFLinkService,
  __webpack_exports__PDFPageView as PDFPageView,
  __webpack_exports__PDFScriptingManager as PDFScriptingManager,
  __webpack_exports__PDFSinglePageViewer as PDFSinglePageViewer,
  __webpack_exports__PDFViewer as PDFViewer,
  __webpack_exports__ProgressBar as ProgressBar,
  __webpack_exports__RenderingStates as RenderingStates,
  __webpack_exports__ScrollMode as ScrollMode,
  __webpack_exports__SimpleLinkService as SimpleLinkService,
  __webpack_exports__SpreadMode as SpreadMode,
  __webpack_exports__StructTreeLayerBuilder as StructTreeLayerBuilder,
  __webpack_exports__TextLayerBuilder as TextLayerBuilder,
  __webpack_exports__XfaLayerBuilder as XfaLayerBuilder,
  __webpack_exports__parseQueryString as parseQueryString
};

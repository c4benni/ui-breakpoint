"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.mediaListener = exports.default = void 0;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

const mediaListener = ({ media, callback }) => {
  try {
    media.addEventListener("change", callback);
  } catch (e) {
    // older browser. Hey safari iphone 8!
    if (/undefined is not a function/i.test(e.message)) {
      var _media$addListener;

      media === null || media === void 0
        ? void 0
        : (_media$addListener = media.addListener) === null ||
          _media$addListener === void 0
        ? void 0
        : _media$addListener.call(media, callback);
    }
  }
};

exports.mediaListener = mediaListener;

const nextTick = async () => await Promise.resolve();

const setParseBreakpoints = (config, orientation) => {
  // get entries and sort the values from low to high;
  const sortedEntries = Object.entries(config).sort((entry1, entry2) => {
    const a = parseInt(entry1[1]);
    const b = parseInt(entry2[1]);
    return a > b ? 1 : -1;
  });
  const output = [];

  if (orientation) {
    output.push("<orientation>(orientation: landscape)");
  }

  sortedEntries.forEach((entry, index) => {
    const br = entry[0];
    const minWidth = parseInt(entry[1]);
    const maxWidth = parseInt((sortedEntries[index + 1] || [])[1] || "");
    output.push(
      `<${br}>(min-width:${minWidth}px)${
        maxWidth ? ` and (max-width:${maxWidth - 1}px)` : ""
      }`
    );
  });
  return output;
};

let installed = false;
let parsedBreakpoints;

function getBreakpointMediaName(val) {
  var _val$match, _val$match$call, _val$match$call$, _val$match$call$$repl;

  const regExp = /^<.+>/g;
  return (
    ((_val$match = val.match) === null || _val$match === void 0
      ? void 0
      : (_val$match$call = _val$match.call(val, regExp)) === null ||
        _val$match$call === void 0
      ? void 0
      : (_val$match$call$ = _val$match$call[0]) === null ||
        _val$match$call$ === void 0
      ? void 0
      : (_val$match$call$$repl = _val$match$call$.replace) === null ||
        _val$match$call$$repl === void 0
      ? void 0
      : _val$match$call$$repl.call(_val$match$call$, /<|>/g, "")) || ""
  );
}

function updateBreakpointMediaListener(e) {
  const name = e.name;
  const isOrientation = /orientation/.test(name);
  const matches = e.matches;
  const data = isOrientation ? (matches ? "landscape" : "portrait") : name;

  const update = () => {
    var _e$onChange;

    if (isOrientation) {
      this.output.orientation = data;
    } else {
      this.output.is = data;
    }

    (_e$onChange = e.onChange) === null || _e$onChange === void 0
      ? void 0
      : _e$onChange.call(e, this.output);
  };

  if (isOrientation) {
    update();
  } else if (e.matches) {
    update();
  }
}

function mounted(onChange) {
  if (!installed) {
    parsedBreakpoints.forEach((br, index) => {
      const brNameWrap = /^<.+>/g;
      const mediaQuery = window.matchMedia(br.replace(brNameWrap, ""));
      const matches = mediaQuery.matches;
      const name = getBreakpointMediaName(br);
      updateBreakpointMediaListener.call(this, {
        matches,
        name,
        index,
        onChange,
      });
      mediaListener({
        media: mediaQuery,
        callback: async (e) => {
          await nextTick();
          updateBreakpointMediaListener.call(this, {
            matches: e.matches,
            index,
            name,
            onChange,
          });
        },
      });
    });
  }
}

class BreakpointWrapper {
  constructor(arg) {
    _defineProperty(this, "output", {
      is: "",
      orientation: "",
    });

    const { config, useOrientation, onChange } = arg;

    if (!config) {
      throw new Error(
        "A config object of breakpoints must be defined. Eg {sm: 0, md: 960}"
      );
    } else if (Object.keys(config).length < 2) {
      throw new SyntaxError("Config object must have at least 2 breakpoints");
    } else if (!installed) {
      parsedBreakpoints = setParseBreakpoints(config, useOrientation || false);
      mounted.call(this, onChange);
      Object.freeze(this);
      installed = true;
    }
  }

  get is() {
    return this.output.is;
  }

  get orientation() {
    return this.output.orientation;
  }
}

class Breakpoint {
  // mimic a proxy to avoid reassigning
  constructor(arg) {
    const breakpointWrapper = new BreakpointWrapper(arg);
    Object.defineProperty(this, "is", {
      get() {
        return breakpointWrapper.is;
      },
    });

    if (breakpointWrapper.orientation) {
      Object.defineProperty(this, "orientation", {
        get() {
          return breakpointWrapper.orientation;
        },
      });
    }
  }
}

exports.default = Breakpoint;

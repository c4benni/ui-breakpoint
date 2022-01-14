const mediaListener = ({ media, callback, event = "change", }) => {
    var _a;
    try {
        media.addEventListener(event, callback);
    }
    catch (e) {
        if (/undefined is not a function/i.test(e.message)) {
            (_a = media === null || media === void 0 ? void 0 : media.addListener) === null || _a === void 0 ? void 0 : _a.call(media, callback);
        }
    }
};
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
        output.push(`<${br}>(min-width:${minWidth}px)${maxWidth ? ` and (max-width:${maxWidth - 1}px)` : ""}`);
    });
    return output;
};
let installed = false;
let parsedBreakpoints;
function getBreakpointMediaName(val) {
    var _a, _b, _c, _d;
    const regExp = /^<.+>/g;
    return ((_d = (_c = (_b = (_a = val.match) === null || _a === void 0 ? void 0 : _a.call(val, regExp)) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.replace) === null || _d === void 0 ? void 0 : _d.call(_c, /<|>/g, "")) || "";
}
function updateBreakpointMediaListener(e) {
    const name = e.name;
    const isOrientation = /orientation/.test(name);
    const matches = e.matches;
    const data = isOrientation ? (matches ? "landscape" : "portrait") : name;
    const update = () => {
        var _a;
        if (isOrientation) {
            this.output.orientation = data;
        }
        else {
            this.output.is = data;
        }
        (_a = e.onChange) === null || _a === void 0 ? void 0 : _a.call(e, this.output);
    };
    if (isOrientation) {
        update();
    }
    else if (e.matches) {
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
                event: "change",
                callback: (e) => {
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
        this.output = {
            is: "",
            orientation: "",
        };
        const { config, useOrientation, onChange } = arg;
        if (!config) {
            throw new Error("A config object of breakpoints must be defined. Eg {sm: 0, md: 960}");
        }
        else if (Object.keys(config).length < 2) {
            throw new SyntaxError("Config object must have at least 2 breakpoints");
        }
        else if (!installed) {
            parsedBreakpoints = setParseBreakpoints(config, useOrientation);
            mounted.call(this, onChange);
            Object.freeze(this);
        }
    }
    get is() {
        return this.output.is;
    }
    get orientation() {
        return this.output.orientation;
    }
}
export default class Breakpoint {
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

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.mediaListener = void 0;
var mediaListener = function (_a) {
    var _b;
    var media = _a.media, callback = _a.callback;
    try {
        media.addEventListener("change", callback);
    }
    catch (e) {
        // older browser. Hey safari iphone 8!
        if (/undefined is not a function/i.test(e.message)) {
            (_b = media === null || media === void 0 ? void 0 : media.addListener) === null || _b === void 0 ? void 0 : _b.call(media, callback);
        }
    }
};
exports.mediaListener = mediaListener;
var nextTick = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, Promise.resolve()];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var setParseBreakpoints = function (config, orientation) {
    // get entries and sort the values from low to high;
    var sortedEntries = Object.entries(config).sort(function (entry1, entry2) {
        var a = parseInt(entry1[1]);
        var b = parseInt(entry2[1]);
        return a > b ? 1 : -1;
    });
    var output = [];
    if (orientation) {
        output.push("<orientation>(orientation: landscape)");
    }
    sortedEntries.forEach(function (entry, index) {
        var br = entry[0];
        var minWidth = parseInt(entry[1]);
        var maxWidth = parseInt((sortedEntries[index + 1] || [])[1] || "");
        output.push("<".concat(br, ">(min-width:").concat(minWidth, "px)").concat(maxWidth ? " and (max-width:".concat(maxWidth - 1, "px)") : ""));
    });
    return output;
};
var installed = false;
var parsedBreakpoints;
function getBreakpointMediaName(val) {
    var _a, _b, _c, _d;
    var regExp = /^<.+>/g;
    return ((_d = (_c = (_b = (_a = val.match) === null || _a === void 0 ? void 0 : _a.call(val, regExp)) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.replace) === null || _d === void 0 ? void 0 : _d.call(_c, /<|>/g, "")) || "";
}
function updateBreakpointMediaListener(e) {
    var _this = this;
    var name = e.name;
    var isOrientation = /orientation/.test(name);
    var matches = e.matches;
    var data = isOrientation ? (matches ? "landscape" : "portrait") : name;
    var update = function () {
        var _a;
        if (isOrientation) {
            _this.output.orientation = data;
        }
        else {
            _this.output.is = data;
        }
        (_a = e.onChange) === null || _a === void 0 ? void 0 : _a.call(e, _this.output);
    };
    if (isOrientation) {
        update();
    }
    else if (e.matches) {
        update();
    }
}
function mounted(onChange) {
    var _this = this;
    if (!installed) {
        parsedBreakpoints.forEach(function (br, index) {
            var brNameWrap = /^<.+>/g;
            var mediaQuery = window.matchMedia(br.replace(brNameWrap, ""));
            var matches = mediaQuery.matches;
            var name = getBreakpointMediaName(br);
            updateBreakpointMediaListener.call(_this, {
                matches: matches,
                name: name,
                index: index,
                onChange: onChange
            });
            (0, exports.mediaListener)({
                media: mediaQuery,
                callback: function (e) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, nextTick()];
                            case 1:
                                _a.sent();
                                updateBreakpointMediaListener.call(this, {
                                    matches: e.matches,
                                    index: index,
                                    name: name,
                                    onChange: onChange
                                });
                                return [2 /*return*/];
                        }
                    });
                }); }
            });
        });
    }
}
var BreakpointWrapper = /** @class */ (function () {
    function BreakpointWrapper(arg) {
        this.output = {
            is: "",
            orientation: ""
        };
        var config = arg.config, useOrientation = arg.useOrientation, onChange = arg.onChange;
        if (!config) {
            throw new Error("A config object of breakpoints must be defined. Eg {sm: 0, md: 960}");
        }
        else if (Object.keys(config).length < 2) {
            throw new SyntaxError("Config object must have at least 2 breakpoints");
        }
        else if (!installed) {
            parsedBreakpoints = setParseBreakpoints(config, useOrientation || false);
            mounted.call(this, onChange);
            Object.freeze(this);
            installed = true;
        }
    }
    Object.defineProperty(BreakpointWrapper.prototype, "is", {
        get: function () {
            return this.output.is;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BreakpointWrapper.prototype, "orientation", {
        get: function () {
            return this.output.orientation;
        },
        enumerable: false,
        configurable: true
    });
    return BreakpointWrapper;
}());
var Breakpoint = /** @class */ (function () {
    // mimic a proxy to avoid reassigning
    function Breakpoint(arg) {
        var breakpointWrapper = new BreakpointWrapper(arg);
        Object.defineProperty(this, "is", {
            get: function () {
                return breakpointWrapper.is;
            }
        });
        if (breakpointWrapper.orientation) {
            Object.defineProperty(this, "orientation", {
                get: function () {
                    return breakpointWrapper.orientation;
                }
            });
        }
    }
    return Breakpoint;
}());
exports["default"] = Breakpoint;

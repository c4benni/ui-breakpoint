import { BreakpointArg, BreakpointOutput } from "./@types";
declare type MediaListener = (arg: {
    media: MediaQueryList;
    callback: (e: MediaQueryListEvent) => void;
}) => void;
export declare const mediaListener: MediaListener;
export default class Breakpoint implements BreakpointOutput {
    constructor(arg: BreakpointArg);
}
export {};

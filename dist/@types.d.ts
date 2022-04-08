export declare type BreakpointConfig = {
    [key: string]: string;
};
export declare type BreakpointArg = {
    config: BreakpointConfig;
    useOrientation?: boolean;
    onChange?: Function;
};
export declare type BreakpointOutput = {
    is?: string;
    orientation?: "portrait" | "landscape" | "";
};

export type BreakpointConfig = {
  [key: string]: string;
};

export type BreakpointArg = {
  config: BreakpointConfig;
  useOrientation?: boolean;
  onChange?: Function;
};

export type BreakpointOutput = {
  is?: string;
  orientation?: "portrait" | "landscape" | "";
};

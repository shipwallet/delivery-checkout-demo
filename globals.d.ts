declare interface Window {
  _sw?: (fn: (api: import("./src/types").PublicAPI) => void) => void;
}

declare interface Window {
  _sw?: (fn: (api: typeof SiwApi) => void) => void;
}

declare namespace SiwApi {
  function suspend(): void;
  function resume(): void;

  function on(
    what: "shipping_option_changed",
    cb: (changedOption: { price: number; currency: string }) => void
  ): void;
  function on(
    what: "address_changed",
    cb: (changedAddress: { country: string; postal_code: string }) => void
  ): void;
  function on(what: "loaded", cb: () => void): void;
  function on(
    what: "door_code_changed",
    cb: (changedDoorCode: string) => void
  ): void;
  function on(
    what: "courier_instructions_changed",
    cb: (changedCourierInstructions: string) => void
  ): void;
  function on(what: "no_shipping_options", cb: () => void);
}

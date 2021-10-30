/**
 * Exports a boolean value reporting whether the given API is supported or not
 */
const isBrowserApiSupported = (api: string) =>
  typeof window !== "undefined" && api in window;

export default isBrowserApiSupported;

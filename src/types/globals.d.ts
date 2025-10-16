/**
 * Global type augmentations for edge-safe runtime
 */

declare global {
  /**
   * Injected at runtime for edge-safe SendGrid auth.
   * Undefined in local/test unless explicitly set via initSendgrid().
   */
  // eslint-disable-next-line no-var
  var __SG_API_KEY__: string | undefined;

  /**
   * Extend globalThis to include our custom properties
   */
  interface GlobalThis {
    __SG_API_KEY__?: string;
  }
}

// Make this a module to allow declare global
export {};

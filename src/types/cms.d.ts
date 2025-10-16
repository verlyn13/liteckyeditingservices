// Minimal Decap CMS and global window typings used in the app

declare global {
  interface DecapStoreLike {
    dispatch?: (action: unknown) => unknown;
  }

  interface DecapCMS {
    init?: (opts?: { config?: unknown }) => void;
    getToken?: () => Promise<string | null> | string | null;
    reduxStore?: DecapStoreLike;
    store?: DecapStoreLike;
    registerPreviewTemplate?: (name: string, comp: unknown) => void;
    registerWidget?: (name: string, control: unknown, preview?: unknown) => void;
  }

  interface Window {
    CMS?: DecapCMS;
    __cmsApp?: unknown;
    __sentry?: unknown;
  }
}

export {};

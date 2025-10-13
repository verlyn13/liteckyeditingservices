// Browser-compatible process shim for node:process
export const env = { NODE_ENV: 'production' };
export const version = 'v24.0.0';
export const versions = {};
export const platform = 'browser';
export const argv = [];
export const cwd = () => '/';
export const nextTick = (fn, ...args) => Promise.resolve().then(() => fn(...args));
export const browser = true;

export default {
  env,
  version,
  versions,
  platform,
  argv,
  cwd,
  nextTick,
  browser,
};

// Also set global process if not exists
if (typeof globalThis !== 'undefined' && !globalThis.process) {
  globalThis.process = {
    env,
    version,
    versions,
    platform,
    argv,
    cwd,
    nextTick,
    browser,
  };
}

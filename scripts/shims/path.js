// Browser-compatible path shim for node:path
export const join = (...parts) => parts.filter(Boolean).join('/').replace(/\/+/g, '/');
export const dirname = (p) => p.split('/').slice(0, -1).join('/') || '/';
export const basename = (p) => p.split('/').pop() || '';
export const extname = (p) => {
  const name = p.split('/').pop() || '';
  const idx = name.lastIndexOf('.');
  return idx > 0 ? name.slice(idx) : '';
};
export const resolve = (...parts) => '/' + parts.filter(Boolean).join('/').replace(/\/+/g, '/');
export const sep = '/';
export const delimiter = ':';
export default { join, dirname, basename, extname, resolve, sep, delimiter };

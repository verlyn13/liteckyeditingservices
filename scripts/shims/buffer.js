// Browser-compatible Buffer shim for node:buffer
// Minimal implementation for Decap CMS
export class Buffer {
  constructor(data, encoding) {
    this.data = data;
    this.encoding = encoding;
  }

  static from(data, encoding = 'utf8') {
    return new Buffer(data, encoding);
  }

  static isBuffer(obj) {
    return obj instanceof Buffer;
  }

  toString(encoding = 'utf8') {
    if (this.encoding === 'base64' && encoding === 'utf8') {
      return atob(this.data);
    }
    return this.data.toString();
  }
}

export default { Buffer };

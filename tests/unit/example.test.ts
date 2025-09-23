import { describe, it, expect } from 'vitest';

describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle string concatenation', () => {
    const result = 'Litecky' + ' ' + 'Editing';
    expect(result).toBe('Litecky Editing');
  });
});
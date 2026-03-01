export function hashToUnit(value: string): number {
  let h = 2166136261 >>> 0; 
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h >>> 0) / 0xffffffff;
}
export function bigintValuesProof(): boolean {
  const seed = 1234567890123456789012345678901234567890n;
  let value = seed;
  const before = value++;
  const after = ++value;
  let scalar = 4;
  const scalarBefore = scalar++;
  const scalarAfter = ++scalar;
  return before === seed && after - seed === 2n && value - seed === 2n &&
    scalarBefore === 4 && scalarAfter === 6 && scalar === 6 &&
    seed * 3n / 3n === seed && -7n % 3n === -1n &&
    (2n ** 256n) >> 256n === 1n && (8n << -2n) === 2n &&
    (~0n & 123n) === 123n && `${seed}` === "1234567890123456789012345678901234567890";
}

export function bigintErrorProof(): boolean {
  let caught = 0;
  try { const zero = 0n; const result = 1n / zero; return false; }
  catch { caught++; }
  try { const zero = 0n; const result = 1n % zero; return false; }
  catch { caught++; }
  try { const exponent = -1n; const result = 2n ** exponent; return false; }
  catch { caught++; }
  return caught === 3;
}

import type { int32 } from "@tsonic/core/types.js";

class NumericCell {
  stored: number = 7;
  trace: number = 0;

  get value(): number {
    this.trace = this.trace * 10 + 1;
    return this.stored;
  }

  set value(value: number) {
    this.trace = this.trace * 10 + 3;
    this.stored = value;
  }
}

export function numericMutationProof(): boolean {
  const cell = new NumericCell();
  const next = (): number => {
    cell.trace = cell.trace * 10 + 2;
    cell.stored = 99;
    return 2;
  };
  const assigned = cell.value <<= next();
  if (assigned !== 28 || cell.stored !== 28 || cell.trace !== 123) return false;
  let value = 7;
  const change = (): number => { value = 99; return 2; };
  const stored = value <<= change();
  if (stored !== 28 || value !== 28) return false;
  const values: number[] = [7];
  let calls = 0;
  const index = (): number => { calls += 1; return 0; };
  const amount = (): number => { values[0] = 99; return 2; };
  const indexed = values[index()] <<= amount();
  return indexed === 28 && values[0] === 28 && calls === 1;
}

class IntegerCell {
  stored: int32 = 7;
  get value(): int32 { return this.stored; }
  set value(value: int32) { this.stored = value; }
}

export function numericRegionProof(): boolean {
  let calls = 0;
  const amount = (): number => { calls += 1; return 1.9; };
  const count = (): number => calls;
  let value = 7;
  const enabled = false;
  const skipped = enabled && (value <<= amount()) > 0;
  if (skipped || value !== 7 || count() !== 0) return false;
  const cell = new IntegerCell();
  const assigned = cell.value <<= amount();
  return assigned === 14 && cell.value === 14 && count() === 1;
}

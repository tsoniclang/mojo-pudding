export function numericOperatorsProof(left: number, right: number): number[] {
  return [~left, left & right, left | right, left ^ right, left << right, left >> right, left >>> right];
}

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
  function next(): number {
    cell.trace = cell.trace * 10 + 2;
    cell.stored = 99;
    return 2;
  }
  const assigned = cell.value <<= next();
  if (assigned !== 28 || cell.stored !== 28 || cell.trace !== 123) return false;
  let value = 7;
  function change(): number { value = 99; return 2; }
  const stored = value <<= change();
  if (stored !== 28 || value !== 28) return false;
  const values: number[] = [7];
  let calls = 0;
  function index(): number { calls += 1; return 0; }
  function amount(): number { values[0] = 99; return 2; }
  const indexed = values[index()] <<= amount();
  return indexed === 28 && values[0] === 28 && calls === 1;
}

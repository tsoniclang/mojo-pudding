interface OptionalLeaf {
  value: number;
}

interface OptionalBox {
  leaf?: OptionalLeaf;
}

class OptionalCounter {
  value: number = 9;
  add(amount: number): number { return this.value + amount; }
}

function optionalValue(box: OptionalBox | undefined): number {
  return box?.leaf?.value ?? -1;
}

function guardedValue(box: OptionalLeaf | undefined): number {
  if (box === undefined) return -1;
  return box.value;
}

function optionalMethod(box: OptionalCounter | undefined, next: () => number): number {
  return box?.add(next()) ?? -1;
}

function optionalElement(values: number[] | undefined, index: () => number): number {
  return values?.[index()] ?? -1;
}

export function optionalRegionProof(): boolean {
  const empty: OptionalBox = {};
  const present: OptionalBox = { leaf: { value: 7 } };
  if (optionalValue(undefined) !== -1 || optionalValue(empty) !== -1 || optionalValue(present) !== 7) {
    return false;
  }
  const read = (box: OptionalBox | undefined): number => box?.leaf?.value ?? -1;
  if (read(undefined) !== -1 || read(present) !== 7) return false;
  if (guardedValue(undefined) !== -1 || guardedValue({ value: 5 }) !== 5) return false;
  let calls = 0;
  const count = (): number => calls;
  const next = (): number => { calls += 1; return 2; };
  if (optionalMethod(undefined, next) !== -1 || count() !== 0) return false;
  if (optionalMethod(new OptionalCounter(), next) !== 11 || count() !== 1) return false;
  const index = (): number => { calls += 1; return 0; };
  if (optionalElement(undefined, index) !== -1 || count() !== 1) return false;
  if (optionalElement([13], index) !== 13 || count() !== 2) return false;
  return true;
}

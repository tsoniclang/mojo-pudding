function optionalElement(values: number[] | undefined, index: () => number): number {
  return values?.[index()] ?? -1;
}

export function optionalArrayProof(): boolean {
  let calls = 0;
  const count = (): number => calls;
  const index = (): number => { calls += 1; return 0; };
  if (optionalElement(undefined, index) !== -1 || count() !== 0) return false;
  if (optionalElement([13], index) !== 13 || count() !== 1) return false;
  return true;
}

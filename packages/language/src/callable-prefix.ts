function invoke(callback: (value: number, label: string) => number): number {
  return callback(7, "ignored");
}

export function callablePrefixProof(): number {
  let calls = 0;
  const first = (): number => { calls += 1; return 3; };
  const second = (value: number): number => { calls += 1; return value + 2; };
  const selected: (value: number, label: string) => number = second;
  return invoke(first) + invoke(selected) + calls * 100;
}

export function contextualPrefixProof(): number {
  const selected: (value: number, label: string) => number = (value): number => value + 1;
  return selected(8, "ignored");
}

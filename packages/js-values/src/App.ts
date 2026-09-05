class JsonBox {
  value: string;

  constructor(value: string) {
    this.value = value;
  }

  toJSON(key: string): string {
    return `${key}:${this.value}`;
  }
}

export function jsonProjectionProof(): string {
  const serialized = JSON.stringify(
    { nested: new JsonBox("value"), drop: 2 },
    (key, value) => key === "drop" ? undefined : value,
  );
  return serialized ?? "";
}

export function structuralValueProof(): string {
  const target = { count: 1, label: "before" };
  const assigned = Object.assign(target, { count: 2, label: "after" });
  return assigned.label;
}

export function immediateCallbackProof(): number {
  const selected = [1, 2, 3]
    .map((value, index) => value + index)
    .filter(value => value);
  let visited = 0;
  selected.forEach(value => {
    visited += value;
  });
  return visited + selected.reduce((sum, value) => sum + value, 0);
}

export function erasedCallbackBridgeProof(): number {
  const increment = (value: number): number => value + 1;
  const alias = increment;
  const same = alias === increment;
  const mapped = [1].map(alias);
  return same ? mapped[0] : -1;
}

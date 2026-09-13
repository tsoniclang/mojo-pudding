class First {
  static apply(value: number): number { return value + 1; }
  static "read-value"(value: number): number { return value + 3; }
}

class Second {
  static apply(value: number): number { return value + 2; }
}

function execute(callback: (value: number) => number): number {
  return callback(7);
}

export function staticMethodValuesProof(): boolean {
  const first = First.apply;
  const same = First.apply;
  const second = Second.apply;
  const quoted = First["read-value"];
  return first === same && first !== second && execute(first) === 8 &&
    execute(second) === 9 && execute(quoted) === 10;
}

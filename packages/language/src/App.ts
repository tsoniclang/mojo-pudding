import type { i32 } from "@tsonic/mojo/types.js";

interface Pair {
  left: i32;
  right: i32;
}

enum Mode {
  Off,
  On = 4,
}

class Counter {
  value: i32 = 0;

  increment(): i32 {
    this.value += 1;
    return this.value;
  }
}

function identity<T>(value: T): T {
  return value;
}

function selectedMode(): Mode {
  return Mode.On;
}

export function languageProof(): i32 {
  const pair: Pair = { left: 3, right: 4 };
  const { left, right } = pair;
  const values: i32[] = [left, right, 5];
  const [head, ...tail] = values;
  let total: i32 = head;
  for (const value of tail) {
    total += value;
  }
  const counter = new Counter();
  counter.value = total;
  if (selectedMode() === Mode.Off) {
    return 0;
  }
  return identity<i32>(counter.increment()) + 4;
}

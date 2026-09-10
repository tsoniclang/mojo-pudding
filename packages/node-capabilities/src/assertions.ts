import { deepStrictEqual, strictEqual, notStrictEqual } from "node:assert";
import { Buffer } from "node:buffer";

class Counter {
  count = 1;
  toJSON(): number { return 99; }
}

class OtherCounter {
  count = 1;
}

class GenericCounter<T> {
  count = 1;
}

class Link {
  count = 1;
  next: Link | undefined = undefined;
}

export function assertionProof(): boolean {
  strictEqual(NaN, NaN);
  notStrictEqual(-0, 0);
  const first = new Counter();
  const other = new Counter();
  const retained: unknown = first;
  first.count = 2;
  other.count = 2;
  deepStrictEqual(retained, other);
  notStrictEqual(first, other);
  deepStrictEqual(new GenericCounter<number>(), new GenericCounter<string>());
  deepStrictEqual({ name: "proof", values: [1, 2] }, { values: [1, 2], name: "proof" });
  deepStrictEqual(Buffer.from("bytes"), Buffer.from("bytes"));
  const left = new Link(); left.next = left;
  const right = new Link(); right.next = right;
  deepStrictEqual(left, right);
  let prototypeRejected = false;
  try { deepStrictEqual(new Counter(), new OtherCounter()); } catch { prototypeRejected = true; }
  strictEqual(prototypeRejected, true);
  let valuesRejected = false;
  try { deepStrictEqual({ value: 1 }, { value: 2 }, "different fields"); } catch { valuesRejected = true; }
  strictEqual(valuesRejected, true);
  return prototypeRejected && valuesRejected;
}

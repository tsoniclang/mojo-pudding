import { addressOf, allocatePointer, bindPointer, equalPointer, hashPointer, loadPointer, projectPointer, storePointer } from "@tsonic/core/lang.js";
import type { int32, Pointer } from "@tsonic/core/types.js";

class Counter {
  value: int32 = 3;
}

function escapedElement(): Pointer<int32> {
  let values: int32[] = [3, 4];
  const alias = values;
  const pointer = addressOf(alias[1]);
  storePointer(pointer, 8);
  if (values[1] !== 8 || !equalPointer(pointer, addressOf(values[1]))) throw new Error("array alias");
  values = [10, 11];
  if (loadPointer(pointer) !== 8 || values[1] !== 11) throw new Error("array replacement");
  return pointer;
}

function escapedField(): Pointer<int32> {
  let owner = new Counter();
  const pointer = addressOf(owner.value);
  if (!equalPointer(pointer, addressOf(owner.value))) throw new Error("field identity");
  storePointer(pointer, 7);
  if (owner.value !== 7) throw new Error("field alias");
  owner = new Counter();
  if (owner.value !== 3 || loadPointer(pointer) !== 7) throw new Error("field replacement");
  return pointer;
}

export function typedLocationProof(): boolean {
  const cell = allocatePointer<int32>(4);
  const projected = projectPointer(cell, (value: int32): int32 => value + 1, (value: int32): int32 => value - 1);
  storePointer(projected, 10);
  if (loadPointer(cell) !== 9 || loadPointer(projected) !== 10 || hashPointer(cell) !== hashPointer(projected)) return false;
  const counter = new Counter();
  const bound = bindPointer<int32>(counter, () => counter.value, (value: int32) => { counter.value = value; });
  storePointer(bound, 12);
  if (counter.value !== 12 || loadPointer(bound) !== 12) return false;
  const field = escapedField();
  const element = escapedElement();
  storePointer(field, 14);
  storePointer(element, 15);
  return loadPointer(field) === 14 && loadPointer(element) === 15;
}

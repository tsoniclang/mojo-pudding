function append<T>(values: T[], value: T): number {
  return values.push(value);
}

function appendEmpty<T>(values: T[]): number {
  return values.push();
}

function appendMany<T>(values: T[], input: T[]): number {
  return values.push(...input);
}

function addLater(source: string[]): string {
  source.push("late");
  return "tail";
}

function fail(): string {
  throw new Error("argument failed");
}

function optional(values: string[] | undefined, effects: string[]): number | undefined {
  return values?.push(addLater(effects));
}

export function restCollectionProof(): boolean {
  const values: string[] = [];
  const same = values;
  if (append(values, "header.html") !== 1 || same[0] !== "header.html") return false;
  if (appendEmpty(values) !== 1 || values.push("b", "c") !== 3) return false;
  appendMany(values, values);
  if (values.length !== 6 || values[3] !== "header.html" || values[5] !== "c") return false;
  const source = ["before"];
  const destination: string[] = [];
  destination.push(...source, addLater(source));
  if (destination.join("|") !== "before|tail" || source.length !== 2) return false;
  const numbers = [0];
  numbers.push(numbers.length, numbers.length);
  if (numbers.length !== 3 || numbers[0] !== 0 || numbers[1] !== 1 || numbers[2] !== 1) return false;
  const unchanged: string[] = [];
  let caught = false;
  try { unchanged.push("must-not-append", fail()); } catch (error) {
    caught = true;
  }
  if (!caught || unchanged.length !== 0) return false;
  const effects: string[] = [];
  optional(undefined, effects);
  if (effects.length !== 0) return false;
  optional([], effects);
  if (effects.join("|") !== "late") return false;
  const spliced = ["a", "b", "c"];
  const removed = spliced.splice(1);
  return removed.join("|") === "b|c" && spliced.join("|") === "a" &&
    "a".concat("b", "c") === "abc" && String.fromCharCode(65, 66) === "AB" &&
    Math.min(3, 1, 2) === 1 && Math.hypot(3, 4) === 5;
}

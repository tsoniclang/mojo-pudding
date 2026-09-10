function optionalElement(values: number[] | undefined, index: () => number): number {
  return values?.[index()] ?? -1;
}

function optionalBooleanResult(value: boolean | undefined): string {
  let calls = 0;
  const next = (): boolean | undefined => { calls += 1; return value; };
  const count = (): number => calls;
  const negated = !next();
  const selected = next() ? "yes" : "no";
  if (count() !== 2) return "repeated";
  return (negated ? "not" : "yes") + "|" + selected;
}

function unionBooleanResult(value: boolean | string): boolean {
  return !value;
}

export function optionalBooleanProof(): boolean {
  if (optionalBooleanResult(undefined) !== "not|no") return false;
  if (optionalBooleanResult(false) !== "not|no") return false;
  if (optionalBooleanResult(true) !== "yes|yes") return false;
  return unionBooleanResult(false) && !unionBooleanResult(true) &&
    unionBooleanResult("") && !unionBooleanResult("text");
}

export function optionalArrayProof(): boolean {
  let calls = 0;
  const count = (): number => calls;
  const index = (): number => { calls += 1; return 0; };
  if (optionalElement(undefined, index) !== -1 || count() !== 0) return false;
  if (optionalElement([13], index) !== 13 || count() !== 1) return false;
  return true;
}

class FirstValue { first = "first"; }
class SecondValue { second = "second"; }

export function optionalUnionMapProof(): boolean {
  const values = new Map<string, FirstValue | SecondValue>();
  const first = new FirstValue();
  const second = new SecondValue();
  values.set("first", first);
  values.set("second", second);
  let calls = 0;
  const count = (): number => calls;
  const key = (value: string): string => { calls += 1; return value; };
  const absent = values.get(key("missing"));
  if (absent !== undefined || count() !== 1) return false;
  const selectedFirst = values.get(key("first"));
  if (!(selectedFirst instanceof FirstValue) || selectedFirst !== first || count() !== 2) return false;
  const selectedSecond = values.get(key("second"));
  if (!(selectedSecond instanceof SecondValue) || selectedSecond !== second || count() !== 3) return false;
  const primitives = new Map<string, string | number>();
  primitives.set("text", "value");
  primitives.set("number", 7);
  if (primitives.get("missing") !== undefined) return false;
  if (primitives.get("text") !== "value" || primitives.get("number") !== 7) return false;
  return true;
}

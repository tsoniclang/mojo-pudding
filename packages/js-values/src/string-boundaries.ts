import type { int32 } from "@tsonic/core/types.js";

class ConvertedValues {
  values: int32[];

  constructor() {
    this.values = [0];
  }
}

export function conversionEffectsProof(): boolean {
  const state = new ConvertedValues();
  const returned = (): int32[] => [1];
  const local: int32[] = [2];
  return state.values[0] === 0 && returned()[0] === 1 && local[0] === 2;
}

export function stringBoundaryProof(): boolean {
  let rejected = 0;
  try { "😀".charAt(0); } catch { rejected++; }
  try { "😀".slice(0, 1); } catch { rejected++; }
  try { String.fromCharCode(0xD800); } catch { rejected++; }
  return rejected === 3 && "😀".slice(0, 2) === "😀" &&
    "abc".charAt(Infinity) === "" && "abc".at(-Infinity) === undefined &&
    "abc".charAt(NaN) === "a" && "ababa".lastIndexOf("a", NaN) === 4 &&
    "a,b,c".split(",", -1).length === 3 &&
    "a,b,c".split(",", Infinity).length === 0;
}

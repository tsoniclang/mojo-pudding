import type { int32 } from "@tsonic/core/types.js";

class ConvertedValues {
  values: int32[];

  constructor() {
    this.values = [0];
  }
}

export function conversionEffectsProof(): boolean {
  const state = new ConvertedValues();
  const source: number[] = [1, 2];
  const returned = (): int32[] => source;
  const local: int32[] = source;
  return state.values[0] === 0 && returned()[0] === 1 && local[1] === 2;
}

export function stringBoundaryProof(): boolean {
  const infinity = Number.POSITIVE_INFINITY;
  const nan = Number.NaN;
  let rejected = 0;
  try { "😀".charAt(0); } catch { rejected++; }
  try { "😀".slice(0, 1); } catch { rejected++; }
  try { String.fromCharCode(0xD800); } catch { rejected++; }
  return rejected === 3 && "😀".slice(0, 2) === "😀" &&
    "abc".charAt(infinity) === "" && "abc".at(-infinity) === undefined &&
    "abc".charAt(nan) === "a" && "ababa".lastIndexOf("a", nan) === 4 &&
    "a,b,c".split(",", -1).length === 3 &&
    "a,b,c".split(",", infinity).length === 0;
}

import { comptime, comptimeIf, unroll } from "@tsonic/core/lang.js";
import { copy, materialize } from "@tsonic/mojo/lang.js";

export function compileTimeProof(): number {
  const enabled = comptime(true);
  const seed = comptime(0);
  let total = materialize(seed);
  if (comptimeIf(enabled)) {
    for (const value of unroll([1, 2, 3])) {
      total += value;
    }
  }
  return total;
}

export function explicitCopyProof(value: string): string {
  return copy(value);
}

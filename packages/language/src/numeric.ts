import type { float16, float32 } from "@tsonic/core/types.js";

export function floatingBitwiseProof(value: float16, count: float32): number {
  return value >>> count;
}

export function numericOperatorsProof(left: number, right: number): number[] {
  return [~left, left & right, left | right, left ^ right, left << right, left >> right, left >>> right];
}

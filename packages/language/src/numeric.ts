export function numericOperatorsProof(left: number, right: number): number[] {
  return [~left, left & right, left | right, left ^ right, left << right, left >> right, left >>> right];
}

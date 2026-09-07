import type { float16, float32, int32 } from "@tsonic/core/types.js";

function showNumber(value: number): string { return `${value}`; }
function showBoolean(value: boolean): string { return `${value}`; }
function wrapped(value: number | undefined): string { return `${value}`; }
function mixed(value: number | boolean): string { return `${value}`; }
function widths(half: float16, single: float32, integer: int32): string {
  return `${half}|${single}|${integer}`;
}

export function templatePrimitiveProof(): boolean {
  if (showNumber(1704067200000) !== "1704067200000") return false;
  if (showNumber(-0) !== "0" || showNumber(0.5) !== "0.5") return false;
  if (showNumber(1e20) !== "100000000000000000000" || showNumber(1e21) !== "1e+21") return false;
  if (showNumber(1e-6) !== "0.000001" || showNumber(1e-7) !== "1e-7") return false;
  if (showNumber(Number.NaN) !== "NaN" || showNumber(Number.POSITIVE_INFINITY) !== "Infinity") return false;
  if (showBoolean(true) !== "true" || showBoolean(false) !== "false") return false;
  if (wrapped(undefined) !== "undefined" || wrapped(7) !== "7") return false;
  if (mixed(true) !== "true" || mixed(3) !== "3") return false;
  if (widths(0.5, 1.5, 7) !== "0.5|1.5|7") return false;
  let counter = 0;
  const next = (): number => { counter += 1; return counter; };
  return `${next()}|${next()}` === "1|2";
}

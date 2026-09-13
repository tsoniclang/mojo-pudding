import buffers, { Buffer, isBuffer as selectedPredicate } from "node:buffer";

function generic<Value>(value: Value): boolean {
  return selectedPredicate(value);
}

function forwarded<Value>(value: Value): boolean {
  return generic(value);
}

function compound(value: Buffer | string | undefined): boolean {
  return Buffer.isBuffer(value);
}

export function bufferPredicateProof(): number {
  const buffer = Buffer.from("bytes");
  if (!Buffer.isBuffer(buffer) || !Buffer.isBuffer(buffer.subarray(1))) throw new Error("native Buffer brand lost");
  if (!generic(buffer) || !forwarded(buffer)) throw new Error("generic Buffer brand lost");
  if (generic("bytes") || forwarded("bytes")) throw new Error("generic string acquired Buffer brand");
  if (Buffer.isBuffer("bytes") || Buffer.isBuffer(0) || Buffer.isBuffer(false)) throw new Error("scalar acquired Buffer brand");
  if (Buffer.isBuffer(null) || Buffer.isBuffer(undefined)) throw new Error("nullish acquired Buffer brand");
  if (Buffer.isBuffer([1, 2]) || Buffer.isBuffer({ length: 5 })) throw new Error("lookalike acquired Buffer brand");
  if (buffers.isBuffer("bytes")) throw new Error("default import changed predicate");
  if (!compound(buffer) || compound("bytes") || compound(undefined)) throw new Error("compound brand changed");
  let evaluations = 0;
  const next = (): Buffer | string => { evaluations += 1; return evaluations === 1 ? buffer : "bytes"; };
  if (!Buffer.isBuffer(next()) || Buffer.isBuffer(next()) || evaluations !== 2) throw new Error("predicate repeated argument evaluation");
  if (false && Buffer.isBuffer(next())) throw new Error("unreachable predicate");
  if (evaluations !== 2 || buffer.toString() !== "bytes") throw new Error("predicate changed source state");
  return evaluations;
}

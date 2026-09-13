import { Buffer } from "node:buffer";

function generic<Value>(value: Value): boolean {
  return Buffer.isBuffer(value);
}

export function bufferValueProof(): string {
  const buffer = Buffer.from([1, 2, 3]);
  const saved: unknown = buffer;
  const alias: unknown = buffer;
  if (!generic(saved) || generic<unknown>(1)) throw new Error("Boxed generic brand changed");
  buffer[1] = 9;
  if (!Buffer.isBuffer(saved) || !Object.is(saved, alias)) throw new Error("Lost Buffer identity");
  const copy = structuredClone(saved);
  if (Buffer.isBuffer(copy) || Object.is(saved, copy)) throw new Error("Incorrect cloned Buffer brand");
  const recovered = saved as Buffer;
  if (!Object.is(buffer, recovered)) throw new Error("Buffer extraction changed identity");
  recovered[0] = 7;
  if (buffer[0] !== 7) throw new Error("Buffer extraction copied the storage");
  recovered[0] = 1;
  let rejected = false;
  try { (copy as Buffer).toString(); } catch { rejected = true; }
  if (!rejected) throw new Error("Unbranded byte view became a Buffer");
  const originalText = JSON.stringify(saved);
  const copyText = JSON.stringify(copy);
  if (originalText === undefined || copyText === undefined) throw new Error("Missing retained byte data");
  return originalText + "|" + copyText;
}

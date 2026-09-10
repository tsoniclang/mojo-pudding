import { Buffer } from "node:buffer";

export function bufferValueProof(): string {
  const buffer = Buffer.from([1, 2, 3]);
  const saved: unknown = buffer;
  const alias: unknown = buffer;
  buffer[1] = 9;
  if (!Buffer.isBuffer(saved) || !Object.is(saved, alias)) throw new Error("Lost Buffer identity");
  const copy = structuredClone(saved);
  if (Buffer.isBuffer(copy) || Object.is(saved, copy)) throw new Error("Incorrect cloned Buffer brand");
  const originalText = JSON.stringify(saved);
  const copyText = JSON.stringify(copy);
  if (originalText === undefined || copyText === undefined) throw new Error("Missing retained byte data");
  return originalText + "|" + copyText;
}

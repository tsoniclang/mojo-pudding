import { createReadStream, writeFileSync } from "node:fs";

export function streamReadSizesProof(root: string): string {
  const path = root + "/sized";
  writeFileSync(path, "abcdefgh");
  const source = createReadStream(path, { highWaterMark: 2 });
  const first = source.read(3);
  const second = source.read(3);
  const tail = source.read(3);
  const end = source.read(3);
  if (first === null || second === null || tail === null || end !== null) {
    throw new Error("Sized stream lost its exact byte boundaries");
  }
  if (typeof first === "string" || typeof second === "string" || typeof tail === "string") {
    throw new Error("Binary stream unexpectedly returned decoded text");
  }
  if (!source.readableEnded || source.bytesRead !== 8) {
    throw new Error("Sized stream lost its EOF or physical byte count");
  }
  return first.toString() + "|" + second.toString() + "|" + tail.toString();
}

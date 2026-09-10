import { createReadStream, writeFileSync } from "node:fs";

export function streamDecodingProof(root: string): string {
  const path = root + "/decoded";
  writeFileSync(path, "😀éZ");
  const input = createReadStream(path, { highWaterMark: 1, encoding: "utf8" });
  const alias = input;
  const first = input.read(2);
  const second = alias.read(1);
  const tail = input.read(1);
  if (typeof first !== "string" || typeof second !== "string" || typeof tail !== "string") {
    throw new Error("Selected decoder did not return native text");
  }
  if (alias.read() !== null || !input.readableEnded || input.bytesRead !== 7) {
    throw new Error("Decoded stream changed physical EOF or byte accounting");
  }
  return first + "|" + second + "|" + tail;
}

import { Buffer } from "node:buffer";

export function bufferAllocationProof(): string {
  const original = Buffer.poolSize;
  try {
    Buffer.poolSize = 64;
    const selectedSize = Buffer.poolSize;
    if (selectedSize !== 64) throw new Error("pool size write was lost");
    const first = Buffer.allocUnsafe(3);
    first.fill("a");
    const second = Buffer.allocUnsafe(3);
    second.fill("b");
    const alias = first;
    const view = first.subarray();
    const copy = Buffer.from(first);
    view.write("c");
    if (first !== alias || first === view || first === second || first === copy) {
      throw new Error("Buffer identity was confused with backing storage");
    }
    if (alias.toString() !== "caa" || copy.toString() !== "aaa") {
      throw new Error("Buffer view or copying contract was lost");
    }
    Buffer.poolSize = 0;
    const slow = Buffer.allocUnsafeSlow(2);
    slow.fill("d");
    const zeroed = Buffer.alloc(2);
    return Buffer.concat([first, second, slow]).toString() + "|" + zeroed.toString("hex");
  } finally {
    Buffer.poolSize = original;
  }
}

import { Buffer } from "node:buffer";
import { createHash, createHmac, randomBytes, randomUUID } from "node:crypto";
import process, { stdin, version } from "node:process";

export function cryptoProviderProof(): boolean {
  const key = Buffer.from("Jefe");
  const hash = createHash("sha256").update("abc").digest().toString("hex");
  const mac = createHmac("sha256", key).update("what do ya want for nothing?").digest("hex");
  return hash === "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" &&
    mac === "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843" &&
    randomBytes(32).length === 32 && randomUUID().length === 36 &&
    !stdin.isPaused() && !process.stdin.isPaused() &&
    version === "tsonic-mojo" && process.version === version;
}

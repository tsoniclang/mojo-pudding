import { Buffer } from "node:buffer";
import { EventEmitter, listenerCount } from "node:events";
import { TextDecoder } from "node:util";
import { gunzipSync, gzipSync } from "node:zlib";
export { streamProof, modernUrlProof } from "./filesystem-url.js";
export { fileContentsProof } from "./file-contents.js";
export { bufferAllocationProof } from "./buffer-allocation.js";
export { streamStateProof } from "./stream-state.js";
export { beginStreamCompletion } from "./stream-completion.js";
export { streamReadSizesProof } from "./stream-read-sizes.js";
export { pathGlobProof } from "./path-glob.js";
export { bufferValueProof } from "./buffer-values.js";
export { streamDecodingProof } from "./stream-decoding.js";
export { beginReadline } from "./readline.js";

export function compressionProof(): string {
  const compressed = gzipSync(Buffer.from("payload"), {
    level: 1,
    maxOutputLength: 4096,
  });
  return new TextDecoder("utf-8").decode(gunzipSync(compressed));
}

export function eventProof(): number {
  let calls = 0;
  const emitter = new EventEmitter();
  emitter.once("ready", () => {
    calls += 1;
  });
  const before = listenerCount(emitter, "ready");
  emitter.emit("ready");
  emitter.emit("ready");
  return before * 10 + calls;
}

export function eventOrderingProof(): number {
  let order = 0;
  const emitter = new EventEmitter();
  const repeated = (): void => { order = order * 10 + 1; };
  emitter.on("ready", repeated);
  emitter.prependOnceListener("ready", (_value: unknown): void => { order = order * 10 + 2; });
  emitter.on("ready", repeated);
  emitter.off("ready", repeated);
  emitter.emit("ready", 42);
  emitter.emit("ready", 43);
  return order;
}

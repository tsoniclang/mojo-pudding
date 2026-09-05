import { Buffer } from "node:buffer";
import { EventEmitter, listenerCount } from "node:events";
import { TextDecoder } from "node:util";
import { gunzipSync, gzipSync } from "node:zlib";

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

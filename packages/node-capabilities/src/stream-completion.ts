import { Buffer } from "node:buffer";
import { createWriteStream, writeFileSync } from "node:fs";

export function beginStreamCompletion(root: string): () => string {
  let trace = "";
  const output = createWriteStream(root + "/completion");
  output.cork();
  output.write("c3a9", "hex", (error): void => { trace += error === undefined ? "a" : error.message; });
  output.write(Buffer.from("A"), "ignored", (): void => { trace += "b"; });
  output.end("Qg==", "base64", (): void => { trace += "z"; });
  return (): string => trace;
}

export function beginStreamFailure(root: string): () => string {
  const path = root + "/failed-completion";
  writeFileSync(path, "unchanged");
  let trace = "";
  const output = createWriteStream(path, { flags: "r" });
  output.on("error", (error): void => { trace += error.message.length > 0 ? "e" : "missing-error"; });
  output.once("close", (): void => { trace += "c"; });
  output.on("finish", (): void => { trace += "unexpected-finish"; });
  output.cork();
  output.write("a", (error): void => { trace += error === undefined ? "unexpected-write" : "a"; });
  output.write("b", (error): void => { trace += error === undefined ? "unexpected-write" : "b"; });
  output.end((error): void => { trace += error === undefined ? "unexpected-end" : "z"; });
  return (): string => trace;
}

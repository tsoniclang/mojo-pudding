import { Buffer } from "node:buffer";
import { createWriteStream } from "node:fs";

export function beginStreamCompletion(root: string): () => string {
  let trace = "";
  const output = createWriteStream(root + "/completion");
  output.cork();
  output.write("c3a9", "hex", (): void => { trace += "a"; });
  output.write(Buffer.from("A"), "ignored", (): void => { trace += "b"; });
  output.end("Qg==", "base64", (): void => { trace += "z"; });
  return (): string => trace;
}

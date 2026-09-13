import { createReadStream, createWriteStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";

export function beginReadableEvents(root: string): () => string {
  const path = root + "/shared-input";
  writeFileSync(path, "shared\n");
  const input = createReadStream(path, { encoding: "utf8" });
  let trace = "";
  input.on("data", chunk => {
    if (typeof chunk !== "string") throw new Error("Decoded input lost its selected carrier");
    trace += "data:" + chunk;
  });
  input.pipe(createWriteStream(root + "/shared-output"));
  const lines = createInterface({ input });
  lines.question("", answer => { trace += "answer:" + answer; });
  input.once("end", () => { trace += ":end"; });
  input.once("close", () => { trace += ":close"; });
  return (): string => trace;
}

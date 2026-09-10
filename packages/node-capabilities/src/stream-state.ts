import { createReadStream, createWriteStream, readFileSync } from "node:fs";

export function streamStateProof(root: string): string {
  const path = root + "/state";
  const output = createWriteStream(path, { highWaterMark: 3 });
  const alias = output;
  output.cork();
  alias.cork();
  const first = output.write("é");
  const second = alias.write("a");
  output.uncork();
  const nested = output.writableCorked;
  alias.close();
  if (!first || second || nested !== 1 || !output.writableEnded || output.writable) {
    throw new Error("Writable state or pressure contract was lost");
  }
  const input = createReadStream(path);
  input.close();
  if (input.readable || input.readableEnded) {
    throw new Error("Closing before EOF was treated as reading to EOF");
  }
  return readFileSync(path, "utf8");
}

import { createReadStream, createWriteStream, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";

export function beginReadline(root: string): () => string {
  const path = root + "/answers";
  writeFileSync(path, "😀\r\n\nlast\n");
  const input = createReadStream(path, { highWaterMark: 1 });
  const output = createWriteStream(root + "/questions");
  const lines = createInterface({ input, output, terminal: false });
  let trace = "";
  lines.question("first? ", first => {
    trace += "[" + first + "]";
    lines.question("second? ", second => {
      trace += "[" + second + "]";
      lines.question("third? ", third => {
        trace += "[" + third + "]";
        lines.close();
        input.close();
        output.end();
      });
    });
  });
  return (): string => trace;
}

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

export function beginLineEvents(root: string): () => string {
  const path = root + "/line-events";
  writeFileSync(path, "answer\n\n😀\ntail");
  const input = createReadStream(path, { highWaterMark: 1 });
  const lines = createInterface({ input });
  let trace = "";
  const listener = (line: string): void => { trace += "L[" + line + "]"; };
  const alias = lines.on("line", listener);
  alias.on("line", listener);
  lines.off("line", listener);
  lines.once("line", line => { trace += "O[" + line + "]"; });
  lines.on("pause", () => { trace += "P"; });
  lines.on("resume", () => { trace += "R"; });
  lines.once("close", () => { trace += "C"; });
  lines.pause();
  lines.pause();
  lines.resume();
  lines.resume();
  lines.question("", answer => { trace += "A[" + answer + "]"; });
  return (): string => trace;
}

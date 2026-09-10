import { Buffer } from "node:buffer";
import { createReadStream, createWriteStream, existsSync, mkdirSync, rmdirSync, watch, writeFileSync } from "node:fs";
import { format, URL, type UrlObject } from "node:url";

export function streamProof(root: string): () => number {
  const empty = root + "/empty";
  mkdirSync(empty);
  rmdirSync(empty);
  if (existsSync(empty)) throw new Error("Empty directory was not removed");
  const path = root + "/input";
  writeFileSync(path, Buffer.from("bytes"));
  const source = createReadStream(path, { highWaterMark: 2, start: 1, end: 3 });
  const output = createWriteStream(root + "/output");
  source.pipe(output);
  const watcher = watch(path);
  watcher.unref();
  watcher.close();
  return (): number => source.bytesRead * 10 + output.bytesWritten;
}

export function modernUrlProof(): string {
  const address = new URL("/hello?key=first", "https://example.org");
  const parameters = address.searchParams;
  parameters.append("key", "second");
  address.search = "?other=hello+world";
  const message = parameters.get("other");
  if (message === null) throw new Error("Missing linked query value");
  const value: UrlObject = { protocol: "https", hostname: "example.org", pathname: "result" };
  return message + "|" + format(value);
}

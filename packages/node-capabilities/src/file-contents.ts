import { appendFileSync, readFileSync, writeFileSync } from "node:fs";

export function fileContentsProof(root: string): string {
  const path = root + "/encoded";
  const encoding: string = "hex";
  writeFileSync(path, "4100ff", encoding);
  appendFileSync(path, "Qg==", "base64");
  const bytes = readFileSync(path);
  if (bytes.length !== 4) throw new Error("Binary file length changed");
  const encoded = readFileSync(path, encoding);
  writeFileSync(path, "é", "latin1");
  appendFileSync(path, "é", "utf16le");
  return encoded + "|" + readFileSync(path, "hex");
}

import { existsSync, readFileSync } from "node:fs";
import { normalize } from "node:path";

function loadText(path: string): string {
  return readFileSync(path, "utf8");
}

export function readFixture(path: string): string {
  const normalized = normalize(path);
  if (existsSync(normalized)) {
    return loadText(normalized);
  }
  return "missing";
}

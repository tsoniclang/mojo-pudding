import { existsSync, readFileSync } from "node:fs";
import { join, normalize, resolve } from "node:path";

export { cryptoProviderProof } from "./crypto.js";

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

export function pathCollectionProof(): boolean {
  const parts = ["alpha", "beta"];
  return join() === "." && join("alpha", "beta") === "alpha/beta" &&
    join(...parts, "..", "gamma") === "alpha/gamma" &&
    resolve("/alpha", "beta") === "/alpha/beta";
}

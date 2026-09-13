import assert from "node:assert/strict";
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const scratch = join(root, ".temp", "generation-guard-tests");
mkdirSync(scratch, { recursive: true });

test("generation certification stops on either failed build, failed inventory, or changed output", () => {
  for (const [mode, calls] of [["first", 1], ["second", 2], ["inventory", 1], ["changed", 2], ["valid", 2]]) {
    const directory = mkdtempSync(join(scratch, `${mode}-`));
    const bin = join(directory, "bin");
    mkdirSync(bin);
    mkdirSync(join(directory, "out", "mojo"), { recursive: true });
    writeFileSync(join(directory, "out", "mojo", "previous.mojo"), "def previous(): pass\n");
    const executable = join(bin, "npm");
    writeFileSync(executable, `#!${process.execPath}
import { readFileSync, writeFileSync, existsSync } from "node:fs";
const count = existsSync("calls") ? Number(readFileSync("calls", "utf8")) + 1 : 1;
writeFileSync("calls", String(count));
if (process.env.PROOF_MODE === "first" || process.env.PROOF_MODE === "second" && count === 2) process.exit(23);
writeFileSync("out/mojo/active.mojo", process.env.PROOF_MODE === "changed" ? String(count) : "def main(): pass\\n");
`);
    chmodSync(executable, 0o755);
    if (mode === "inventory") {
      writeFileSync(join(bin, "find"), "#!/bin/sh\nexit 24\n");
      chmodSync(join(bin, "find"), 0o755);
    }
    const result = spawnSync("bash", [resolve(root, "scripts/verify-generation.sh"), directory], {
      env: { ...process.env, PROOF_MODE: mode, PATH: `${bin}:${process.env.PATH}` },
      encoding: "utf8", timeout: 10000,
    });
    assert.equal(result.error, undefined);
    assert.equal(Number(readFileSync(join(directory, "calls"), "utf8")), calls, mode);
    assert.equal(result.status === 0, mode === "valid", `${mode}: ${result.stderr}`);
  }
});

test("worker proof declares both independently executed source roots", () => {
  const project = JSON.parse(readFileSync(resolve(root, "packages/node-worker/tsonic.json"), "utf8"));
  assert.deepEqual(project.rootFiles, ["App.ts", "child.ts"]);
  assert.ok(project.rootFiles.includes(project.entryPoint));
  for (const source of project.rootFiles) {
    assert.ok(readFileSync(resolve(root, "packages/node-worker", project.rootDir, source), "utf8").length > 0);
  }
  assert.doesNotMatch(readFileSync(resolve(root, "packages/node-worker/src/App.ts"), "utf8"), /import\s+["']\.\/child/u);
});

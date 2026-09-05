import { readFileSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";

const [manifestPath, outputRoot, condaPrefix] = process.argv.slice(2);
if (manifestPath === undefined || outputRoot === undefined || condaPrefix === undefined) {
  throw new Error("Usage: native-link-arguments.mjs <manifest> <output-root> <conda-prefix>");
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
requireRecord(manifest, "native build manifest");
if (manifest.schemaVersion !== 2) {
  throw new Error(`Unsupported Mojo native build schema '${String(manifest.schemaVersion)}'.`);
}
const arguments_ = [];
for (const package_ of requireArray(manifest.packages, "packages")) {
  requireRecord(package_, "native package");
  for (const unit of requireArray(package_.translationUnits, "translationUnits")) {
    requireRecord(unit, "native translation unit");
    arguments_.push("-Xlinker", resolveWithin(outputRoot, unit.objectPath, "objectPath"));
  }
}
for (const directory of requireArray(manifest.libraryDirectories, "libraryDirectories")) {
  arguments_.push("-Xlinker", `-L${resolveEnvironmentPath(directory, condaPrefix)}`);
}
for (const library of requireArray(manifest.staticLibraries, "staticLibraries")) {
  arguments_.push("-Xlinker", resolveEnvironmentPath(library, condaPrefix));
}
for (const library of requireArray(manifest.dynamicLibraries, "dynamicLibraries")) {
  if (typeof library !== "string" || !/^[A-Za-z0-9_+.-]+$/u.test(library)) {
    throw new Error("Mojo native dynamic library names must be non-empty linker identifiers.");
  }
  arguments_.push("-Xlinker", `-l${library}`);
}
process.stdout.write(arguments_.map((argument) => `${argument}\0`).join(""));

function resolveEnvironmentPath(value, root) {
  requireRecord(value, "environment path");
  if (value.environmentVariable !== "CONDA_PREFIX") {
    throw new Error(`Unsupported Mojo native environment '${String(value.environmentVariable)}'.`);
  }
  return resolveWithin(root, value.path, "environment path");
}

function resolveWithin(root, path, name) {
  if (typeof path !== "string" || path.length === 0 || isAbsolute(path)) {
    throw new Error(`Mojo native ${name} must be a non-empty relative path.`);
  }
  const resolvedRoot = resolve(root);
  const resolvedPath = resolve(resolvedRoot, path);
  const relation = relative(resolvedRoot, resolvedPath);
  if (relation === ".." || relation.startsWith(`..${sep}`) || isAbsolute(relation)) {
    throw new Error(`Mojo native ${name} escapes its declared root.`);
  }
  return resolvedPath;
}

function requireArray(value, name) {
  if (!Array.isArray(value)) throw new Error(`Mojo native '${name}' must be an array.`);
  return value;
}

function requireRecord(value, name) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Mojo ${name} must be an object.`);
  }
}

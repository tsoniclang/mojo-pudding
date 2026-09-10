import path, { matchesGlob, posix, win32 } from "node:path";

export function pathGlobProof(): boolean {
  return matchesGlob("posts/2026/entry.md", "posts/**/*.{md,html}")
    && path.matchesGlob("asset.svg", "!(*.png|*.jpg)")
    && posix.matchesGlob("part-03", "part-{01..05..2}")
    && win32.matchesGlob("C:\\posts\\entry.md", "c:/posts/*.md")
    && !path.matchesGlob("posts/.private/entry.md", "posts/**/*.md");
}

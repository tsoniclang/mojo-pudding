#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"
mkdir -p .temp/verification

generated_digest() {
  find "$REPO_ROOT/packages/$1/out/mojo" \( -name '*.mojo' -o -name 'pixi.toml' \) \
    -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1
}

verify_generation() (
  set -e
  project="$1"
  timeout "${MOJO_SOURCE_TIMEOUT:-3m}" npm --prefix "$REPO_ROOT" --workspace "packages/$project" run build
  first_generation="$(generated_digest "$project")"
  timeout "${MOJO_SOURCE_TIMEOUT:-3m}" npm --prefix "$REPO_ROOT" --workspace "packages/$project" run build
  second_generation="$(generated_digest "$project")"
  if [[ "$first_generation" != "$second_generation" ]]; then
    printf 'Mojo target generation is not byte-deterministic: %s\n' "$project" >&2
    exit 1
  fi
)

failed=0
for project in \
  native \
  language \
  project-dispatch \
  resources \
  comptime-ownership \
  workspace-app \
  js \
  js-values \
  regexp-unicode \
  node \
  node-capabilities \
  node-worker; do
  log="$REPO_ROOT/.temp/verification/$project.log"
  if ! verify_generation "$project" >"$REPO_ROOT/.temp/verification/$project-source.log" 2>&1; then
    echo "FAIL: $project source generation ($REPO_ROOT/.temp/verification/$project-source.log)"
    failed=$((failed + 1))
    continue
  fi
  if timeout "${MOJO_PROOF_TIMEOUT:-10m}" prlimit --as="${MOJO_PROOF_MEMORY:-12884901888}" -- \
    bash "$REPO_ROOT/scripts/verify-project.sh" "$project" >"$log" 2>&1; then
    echo "PASS: $project"
  else
    echo "FAIL: $project ($log)"
    failed=$((failed + 1))
  fi
done
echo "Mojo Pudding: $((12 - failed))/12 projects passed; $failed failed."
test "$failed" -eq 0

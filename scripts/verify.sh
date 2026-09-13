#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"
mkdir -p .temp/verification
node --test scripts/test/verify-generation.test.mjs

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
  if ! bash "$REPO_ROOT/scripts/verify-generation.sh" "$REPO_ROOT/packages/$project" >"$REPO_ROOT/.temp/verification/$project-source.log" 2>&1; then
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

#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PIXI_BIN="${PIXI_BIN:-/home/jeswin/.pixi/bin/pixi}"
project="${1:?Expected one proof project}"
case "$project" in
  native|language|project-dispatch|resources|comptime-ownership|workspace-app|js|js-values|regexp-unicode|node|node-capabilities|node-worker) ;;
  *) echo "Unknown proof project: $project" >&2; exit 1 ;;
esac
output="$REPO_ROOT/packages/$project/out/mojo"
mkdir -p "$REPO_ROOT/.temp/verification"
format_root="$(mktemp -d "$REPO_ROOT/.temp/verification/format-$project-XXXXXXXX")"
cp -a "$output/src" "$format_root/src"
if [[ -d "$output/components" ]]; then
  cp -a "$output/components" "$format_root/components"
fi
mapfile -d '' format_sources < <(find "$format_root" -type f -name '*.mojo' -print0 | sort -z)
test "${#format_sources[@]}" -gt 0
"$PIXI_BIN" run --manifest-path "$output/pixi.toml" mojo format --quiet "${format_sources[@]}"
if ! diff -qr "$output/src" "$format_root/src"; then
  printf 'Generated Mojo source is not formatter-stable: %s\n' "$project" >&2
  exit 1
fi
if [[ -d "$output/components" ]] && ! diff -qr "$output/components" "$format_root/components"; then
  printf 'Generated Mojo components are not formatter-stable: %s\n' "$project" >&2
  exit 1
fi
printf 'Formatter checked %s generated modules: %s\n' "${#format_sources[@]}" "$project"
"$PIXI_BIN" run --manifest-path "$output/pixi.toml" build
if [[ "$project" == "node-worker" ]]; then
  actual="$("$output/build/mojo_proof_node_worker")"
  if [[ "$actual" != "worker-ok" ]]; then
    printf 'Worker proof returned an unexpected result: %s\n' "$actual" >&2
    exit 1
  fi
  exit 0
fi
includes=(-I "$output/src" -I "$REPO_ROOT/../mojo-runtime/mojo")
if [[ -d "$output/build/components" ]]; then
  while IFS= read -r -d '' component; do
    includes+=(-I "$component")
  done < <(find "$output/build/components" -mindepth 1 -maxdepth 1 -type d -print0 | sort -z)
fi
case "$project" in
  js|js-values|regexp-unicode) includes+=(-I "$REPO_ROOT/../mojo-js/mojo") ;;
  node|node-capabilities)
    includes+=(-I "$REPO_ROOT/../mojo-js/mojo" -I "$REPO_ROOT/../mojo-nodejs/mojo") ;;
esac
conda_prefix="$($PIXI_BIN run --manifest-path "$output/pixi.toml" printenv CONDA_PREFIX)"
link_file="$output/build/native-link-arguments.bin"
node "$REPO_ROOT/scripts/native-link-arguments.mjs" \
  "$output/mojo-native-build.json" "$output" "$conda_prefix" > "$link_file"
link_arguments=()
while IFS= read -r -d '' argument; do
  link_arguments+=("$argument")
done < "$link_file"
if [[ ${#link_arguments[@]} -eq 0 ]]; then
  "$PIXI_BIN" run --manifest-path "$output/pixi.toml" \
    mojo run "${includes[@]}" "$REPO_ROOT/packages/$project/runner.mojo"
else
  runner="$output/build/${project}-proof"
  "$PIXI_BIN" run --manifest-path "$output/pixi.toml" \
    mojo build -j 1 "${includes[@]}" "${link_arguments[@]}" \
    "$REPO_ROOT/packages/$project/runner.mojo" -o "$runner"
  "$runner"
fi

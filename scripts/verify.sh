#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PIXI_BIN="${PIXI_BIN:-/home/jeswin/.pixi/bin/pixi}"
cd "$REPO_ROOT"

generated_digest() {
  find "$REPO_ROOT/packages" \( -path '*/out/mojo/src/*.mojo' -o -path '*/out/mojo/pixi.toml' \) \
    -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1
}

npm --prefix "$REPO_ROOT" run build
first_generation="$(generated_digest)"
npm --prefix "$REPO_ROOT" run build
second_generation="$(generated_digest)"
if [[ "$first_generation" != "$second_generation" ]]; then
  printf 'Mojo target generation is not byte-deterministic.\n' >&2
  exit 1
fi

for project in native language resources workspace-app js node; do
  output="$REPO_ROOT/packages/$project/out/mojo"
  before_format="$(find "$output/src" -type f -name '*.mojo' -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1)"
  "$PIXI_BIN" run --manifest-path "$output/pixi.toml" \
    mojo format --quiet "$output/src"
  after_format="$(find "$output/src" -type f -name '*.mojo' -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1)"
  if [[ "$before_format" != "$after_format" ]]; then
    printf 'Generated Mojo source is not formatter-stable: %s\n' "$project" >&2
    exit 1
  fi
  "$PIXI_BIN" run --manifest-path "$output/pixi.toml" build
  includes=(-I "$output/src" -I "$REPO_ROOT/../mojo-runtime/mojo")
  case "$project" in
    js)
      includes+=(-I "$REPO_ROOT/../mojo-js/mojo")
      ;;
    node)
      includes+=(-I "$REPO_ROOT/../mojo-nodejs/mojo")
      ;;
  esac
  "$PIXI_BIN" run --manifest-path "$output/pixi.toml" \
    mojo run "${includes[@]}" "$REPO_ROOT/packages/$project/runner.mojo"
done

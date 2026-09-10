#!/usr/bin/env bash
set -euo pipefail

project_root="${1:?Expected the proof project directory}"
cd "$project_root"

generated_digest() {
  find out/mojo \( -name '*.mojo' -o -name 'pixi.toml' \) \
    -type f -print0 | sort -z | xargs -0 sha256sum | sha256sum | cut -d' ' -f1
}

timeout "${MOJO_SOURCE_TIMEOUT:-3m}" npm run build
first_generation="$(generated_digest)"
timeout "${MOJO_SOURCE_TIMEOUT:-3m}" npm run build
second_generation="$(generated_digest)"
if [[ "$first_generation" != "$second_generation" ]]; then
  printf 'Mojo target generation is not byte-deterministic: %s\n' "$project_root" >&2
  exit 1
fi

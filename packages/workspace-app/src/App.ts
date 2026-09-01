import type { i32 } from "@tsonic/mojo/types.js";
import { multiply } from "@mojo-proof/workspace-library/math.js";

export function workspaceProof(): i32 {
  return multiply(6, 7);
}

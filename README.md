# Mojo Proof Pudding

Executable integration proofs for the Tsonic Mojo target. Each project uses
the ordinary Tsonic host and separately installed target/capability packages.
After generation, a handwritten Mojo runner imports the emitted library and
asserts its native behavior; the proofs do not import backend internals.

- `packages/native`: exact `i32` lowering and a native call into emitted code.
- `packages/language`: project records, classes, enums, generics,
  destructuring, arrays, and iteration in one native behavioral proof.
- `packages/project-dispatch`: inheritance, interfaces, overloads, mutable
  fields, and bound methods through exact project dispatch.
- `packages/resources`: synchronous and asynchronous explicit resource
  management with reverse-order cleanup.
- `packages/comptime-ownership`: compile-time values, conditions, unrolled
  iteration, materialization, and explicit copy intent.
- `packages/workspace-app`: an ordinary ESM source-package dependency compiled
  into one Mojo package without a target-owned import shortcut.
- `packages/js`: explicit UTF-16 JavaScript string carrier and strict native
  conversion.
- `packages/js-values`: structural values, JSON projection, immediate
  callbacks, and identity-bearing erased callback bridges.
- `packages/regexp-unicode`: literal and dynamic ECMAScript regular
  expressions plus Unicode normalization.
- `packages/node`: exact Node overload selection, transitive `raises`
  propagation, runtime package composition, and real filesystem behavior.
- `packages/node-capabilities`: compression, binary values, text decoding,
  and event callbacks through the complete Node native-link contract.

Run `npm test` after installing the local workspace dependencies.

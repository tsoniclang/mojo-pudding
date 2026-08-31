# Mojo Proof Pudding

Executable integration proofs for the Tsonic Mojo target. Each project uses
the ordinary Tsonic host and separately installed target/capability packages.
After generation, a handwritten Mojo runner imports the emitted library and
asserts its native behavior; the proofs do not import backend internals.

- `packages/native`: exact `i32` lowering and a native call into emitted code.
- `packages/js`: explicit UTF-16 JavaScript string carrier and strict native
  conversion.
- `packages/node`: exact Node overload selection, transitive `raises`
  propagation, runtime package composition, and real filesystem behavior.

Run `npm test` after installing the local workspace dependencies.

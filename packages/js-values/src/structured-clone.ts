class Data {
  value = 4;
  toJSON(): string { throw new Error("structuredClone must not call toJSON"); }
}

export function structuredCloneProof(): boolean {
  const copy = structuredClone<unknown>(new Data());
  return JSON.stringify(copy) === '{"value":4}' &&
    structuredClone(1.25) === 1.25 &&
    structuredClone("text") === "text" &&
    structuredClone(true) &&
    Object.is(structuredClone(null), null) &&
    Object.is(structuredClone(undefined), undefined);
}

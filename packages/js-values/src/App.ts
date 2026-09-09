export { numericMutationProof, numericRegionProof } from "./numeric.js";
export { optionalArrayProof, optionalUnionMapProof } from "./optional-regions.js";
export { templatePrimitiveProof } from "./template-primitives.js";
export { restCollectionProof } from "./rest-collections.js";
export { liveSourceValueProof } from "./live-source-values.js";
export { intlCollatorProof, intlDateTimeProof } from "./intl.js";
export {
  arrayStringificationProof, arrayOrderingProof, arrayCopyProof, arrayIndexProof,
  arrayMutationProof,
} from "./array-semantics.js";

class JsonBox {
  value: string;

  constructor(value: string) {
    this.value = value;
  }

  toJSON(key: string): string {
    return `${key}:${this.value}`;
  }
}

export function jsonProjectionProof(): string {
  const serialized = JSON.stringify(
    { nested: new JsonBox("value"), drop: 2 },
    (key, value) => key === "drop" ? undefined : value,
  );
  return serialized ?? "";
}

export function structuralValueProof(): string {
  const target = { count: 1, label: "before" };
  const assigned = Object.assign(target, { count: 2, label: "after" });
  return assigned.label;
}

export function immediateCallbackProof(): number {
  const selected = [1, 2, 3]
    .map((value, index) => value + index)
    .filter(value => value);
  let visited = 0;
  selected.forEach(value => {
    visited += value;
  });
  return visited + selected.reduce((sum, value) => sum + value, 0);
}

export function erasedCallbackBridgeProof(): number {
  const increment = (value: number): number => value + 1;
  const alias = increment;
  const same = alias === increment;
  const mapped = [1].map(alias);
  return same ? mapped[0] : -1;
}

class MutableText {
  value: string = "before";
  count: number = 0;
}

function mutateText(value: MutableText): string {
  value.value = "after";
  value.count += 1;
  return "tail";
}

function joinText(first: string, second: string): string {
  return first + "|" + second;
}

export function argumentValueProof(): string {
  const value = new MutableText();
  return joinText(value.value, mutateText(value));
}

export function argumentAssignmentProof(): string {
  let value = "before";
  return joinText(value, value = "after");
}

function preserveText(value: string): string {
  return value;
}

export function nativeCallablePreludeProof(fail: boolean): string {
  if (fail) throw new Error("intentional");
  const selected = preserveText;
  return selected(decodeURIComponent("%41"));
}

export function templateValueProof(): string {
  const value = new MutableText();
  return `${value.value}|${mutateText(value)}`;
}

export function templateBoundaryOrderProof(): number {
  const value = new MutableText();
  const invalid: unknown = JSON.parse('"\\ud800"');
  try {
    `${invalid}${mutateText(value)}`;
  } catch {
    return value.count;
  }
  return -1;
}
export { conversionEffectsProof, stringBoundaryProof } from "./string-boundaries.js";
export { liveIteratorProof, iteratorMutationProof } from "./collection-iteration.js";

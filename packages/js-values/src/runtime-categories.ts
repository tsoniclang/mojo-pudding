let visits = 0;

function nextCategoryValue(): string | number {
  visits++;
  return visits === 1 ? "first" : visits;
}

function category(value: string | number | null | undefined): string {
  return typeof value;
}

function erased(value: unknown): string {
  return typeof value;
}

export function runtimeCategoryProof(): boolean {
  visits = 0;
  const first = typeof nextCategoryValue();
  const second = typeof nextCategoryValue();
  return first === "string" && second === "number" && visits === 2 &&
    category("text") === "string" && category(2) === "number" &&
    category(null) === "object" && category(undefined) === "undefined" &&
    erased("text") === "string" && erased(2) === "number" &&
    erased(null) === "object" && erased(undefined) === "undefined";
}

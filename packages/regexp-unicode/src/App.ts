export function dynamicRegExpProof(): string {
  const expression = new RegExp("(a+)", "g");
  return "baacaa".replace(expression, "<$1>");
}

export function literalRegExpProof(): boolean {
  return /^a+$/u.test("aaa");
}

export function unicodeNormalizationProof(): number {
  return "é".normalize("NFD").length;
}

export function intlCollatorProof(): boolean {
  const options = { numeric: true, sensitivity: "base" as const };
  const german = new Intl.Collator("de", options);
  const saved = german;
  options.numeric = false;
  if (saved.compare("file2", "file10") >= 0 || german.compare("ä", "a") !== 0) return false;
  const swedish = new Intl.Collator("sv", { sensitivity: "base" });
  if (swedish.compare("ä", "a") <= 0) return false;
  const resolved = german.resolvedOptions();
  const initiallyNumeric = resolved.numeric;
  if (resolved.locale !== "de" || initiallyNumeric !== true || resolved.sensitivity !== "base") return false;
  const alias = resolved;
  alias.numeric = false;
  if (resolved.numeric !== false || german.resolvedOptions().numeric !== true) return false;
  return true;
}

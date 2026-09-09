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

export function intlDateTimeProof(): boolean {
  const options = { timeZone: "UTC" };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  options.timeZone = "-01:00";
  const alias = formatter;
  if (alias.format(new Date(0)) !== "1/1/1970") return false;
  let joined = "";
  const parts = formatter.formatToParts(0);
  for (const part of parts) joined += part.value;
  if (joined !== formatter.format(0)) return false;
  const first = parts[0];
  first.value = "changed";
  if (parts[0].value !== "changed") return false;
  const resolved = formatter.resolvedOptions();
  const originalZone = resolved.timeZone;
  if (resolved.locale !== "en-US" || resolved.calendar !== "gregory" || originalZone !== "UTC") return false;
  const saved = resolved;
  saved.timeZone = "changed";
  if (resolved.timeZone !== "changed" || formatter.resolvedOptions().timeZone !== "UTC") return false;
  return true;
}

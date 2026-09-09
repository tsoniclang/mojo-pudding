export function liveIteratorProof(): string {
  const values = new Map<number, string>();
  values.set(1, "one");
  values.set(2, "two");
  const iterator = values.values();
  const first = iterator.next();
  let result = "";
  if (!first.done) result += first.value;
  values.set(2, "updated");
  values.delete(1);
  values.set(1, "again");
  for (const value of iterator) result += "|" + value;
  values.set(3, "not-visited");
  return iterator.next().done ? result : "iterator-reopened";
}

export function iteratorMutationProof(): string {
  const values = new Set<number>();
  values.add(0);
  values.add(1);
  values.add(2);
  let result = "";
  values.forEach(value => {
    result += value.toString();
    if (value === 0) {
      values.delete(1);
      values.add(3);
    }
  });
  return result;
}

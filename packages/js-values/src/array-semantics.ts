export function arrayStringificationProof(): boolean {
  return [0, 1].join("|") === "0|1" &&
    [true, false].join("|") === "true|false" &&
    [-0, 1.5, 1e21, 1e-7].join("|") === "0|1.5|1e+21|1e-7";
}

export function arrayOrderingProof(): boolean {
  const numbers = [10, 1, 2, -1, 1.1];
  const alias = numbers.sort();
  const text = ["\uE000", "😀", "a"];
  text.sort();
  return alias === numbers && numbers.join("|") === "-1|1|1.1|10|2" &&
    text.join("|") === "a|😀|\uE000";
}

export function arrayCopyProof(): boolean {
  const original = [1, 2];
  const copied = Array.from(original);
  copied[0] = 9;
  original.push(3);
  return original !== copied && original[0] === 1 && copied[0] === 9 &&
    original.length === 3 && copied.length === 2 &&
    new Array<number>(3).join("|") === "||" &&
    new Array<string>("3").join("|") === "3" &&
    new Array<number>(3, 4).join("|") === "3|4";
}

export function arrayIndexProof(): boolean {
  const values = [10, 20, 10];
  return values.lastIndexOf(10, -1) === 2 &&
    values.lastIndexOf(10, -2) === 0 &&
    values.lastIndexOf(10, -3.9) === 0 &&
    values.lastIndexOf(10, -4) === -1 &&
    values.at(-3.9) === 10 && values.slice(-1000).length === 3 &&
    values.slice(1000).length === 0;
}

export function arrayMutationProof(): boolean {
  const growing = [1, 2];
  let visited = "";
  for (const value of growing) {
    if (value === 1) {
      growing.push(3);
      continue;
    }
    visited += `${value}`;
  }
  const shrinking = [1, 2, 3];
  const mapped = shrinking.map((value, index) => {
    if (index === 0) {
      shrinking.pop();
      shrinking.pop();
    }
    return value;
  });
  const changed = [1, 2];
  const found = changed.find((value, index) => {
    changed[index] = 99;
    return value === 1;
  });
  const input = [1, 2];
  const copied = Array.from(input, (value, index) => {
    if (index === 0) input.push(3);
    return value;
  });
  return visited === "23" && mapped.length === 3 && mapped.join("|") === "1||" &&
    found === 1 && changed[0] === 99 && copied.join("|") === "1|2|3";
}

class Counter {
  stored: number = 1;
  trace: string = "";

  get value(): number {
    this.trace += "g";
    return this.stored;
  }

  set value(next: number | string) {
    this.trace += "s";
    if (typeof next === "number") this.stored = next;
  }
}

function select(counter: Counter): Counter {
  counter.trace += "r";
  return counter;
}

function operand(counter: Counter): number {
  counter.trace += "v";
  return 2;
}

function stored(counter: Counter): number {
  return counter.stored;
}

export function mutationResultProof(): boolean {
  const counter = new Counter();
  const compound = select(counter).value += operand(counter);
  if (compound !== 3 || stored(counter) !== 3 || counter.trace !== "rgvs") return false;
  counter.trace = "";
  const previous = select(counter).value++;
  if (previous !== 3 || stored(counter) !== 4 || counter.trace !== "rgs") return false;
  counter.trace = "";
  const next = ++select(counter).value;
  if (next !== 5 || stored(counter) !== 5 || counter.trace !== "rgs") return false;
  const shifted = counter.value <<= 1;
  if (shifted !== 10 || stored(counter) !== 10) return false;
  const text = counter.value = "not stored";
  if (text !== "not stored" || stored(counter) !== 10) return false;
  const assigned = counter.value = 7;
  if (assigned !== 7 || stored(counter) !== 7) return false;
  counter.trace = "";
  const remainder = select(counter).value %= operand(counter);
  if (remainder !== 1 || stored(counter) !== 1 || counter.trace !== "rgvs") return false;
  counter.stored = 3;
  counter.trace = "";
  const powered = select(counter).value **= operand(counter);
  if (powered !== 9 || stored(counter) !== 9 || counter.trace !== "rgvs") return false;
  let local = -5;
  const localRemainder = local %= 2;
  const values = [3];
  const elementPower = values[0] **= 2;
  return localRemainder === -1 && local === -1 && elementPower === 9 && values[0] === 9;
}

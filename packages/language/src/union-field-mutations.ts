class First { value: number = 1; first: boolean = true; }
class Second { value: number = 2; second: string = "second"; }
class Third { third: boolean = true; }
let events: string = "";

function receiver(value: First | Second): First | Second { events += "r"; return value; }
function next(): number { events += "v"; return 3; }

function change(value: First | Second): boolean {
  events = "";
  const previous = value.value;
  const assigned = (receiver(value).value) += next();
  if (events !== "rv" || assigned !== previous + 3 || value.value !== assigned) return false;
  const before = (value.value)++;
  const after = ++value.value;
  return before === assigned && after === assigned + 2 && value.value === after;
}

export function unionFieldMutationsProof(): boolean {
  const first = new First();
  const second = new Second();
  return change(first) && change(second) && first.value === 6 && second.value === 7 &&
    receiverRebinding(first, second) && narrowedMutation(new First()) &&
    narrowedMutation(new Second()) && narrowedMutation(new Third()) &&
    computedReceiver(new First(), new Second());
}

function receiverRebinding(first: First, second: Second): boolean {
  let current = receiver(first);
  const assigned = current.value += (current = second, 5);
  return assigned === 11 && first.value === 11 && second.value === 7 && current === second;
}

function narrowedMutation(value: First | Second | Third): boolean {
  if (value instanceof Third) return true;
  const initial = value.value;
  const assigned = value.value += 2;
  const previous = value.value++;
  const next = ++value.value;
  const replaced = value.value = 9;
  return assigned === initial + 2 && previous === assigned && next === initial + 4 &&
    replaced === 9 && value.value === 9;
}

function computedReceiver(first: First, second: Second): boolean {
  let current = receiver(first);
  const read = current[(current = second, "value")];
  if (read !== 1 || current !== second) return false;
  current = receiver(first);
  const assigned = current[(current = second, "value")] += (current = first, 5);
  return assigned === 6 && first.value === 6 && second.value === 2 && current === first;
}

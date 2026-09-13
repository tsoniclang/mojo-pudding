class First { value: number = 1; first: boolean = true; }
class Second { value: number = 2; second: string = "second"; }
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
    receiverRebinding(first, second);
}

function receiverRebinding(first: First, second: Second): boolean {
  let current = receiver(first);
  const assigned = current.value += (current = second, 5);
  return assigned === 11 && first.value === 11 && second.value === 7 && current === second;
}

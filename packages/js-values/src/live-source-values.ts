class Counter {
  count = 1;
  toJSON(): number { return this.count; }
}

class Link {
  value = 1;
  next: Link | undefined = undefined;
}

class Token<T> { count = 1; }

class PrivateState {
  #secret = 1;
  visible: number | undefined = undefined;
  read(): number { return this.#secret; }
}

function boxToken<T>(token: Token<T>): unknown { return token; }

class Base { first = 1; }
class Middle extends Base { middle = 2; }
class Leaf extends Middle { last = 3; }
function retainBase(value: Base): unknown { return value; }

function preserve(value: unknown): unknown { return value; }

export function liveSourceValueProof(): boolean {
  const record = { count: 1 };
  const saved: unknown = record;
  const same = preserve(record);
  record.count = 2;
  if (JSON.stringify(saved) !== '{"count":2}' || !Object.is(saved, same)) return false;
  if (!record.hasOwnProperty("count")) return false;
  const counter = new Counter();
  const boxed: unknown = counter;
  counter.count = 7;
  if (JSON.stringify(boxed) !== "7" || Object.keys(counter).join("|") !== "count") return false;
  const array = [counter];
  const savedArray: unknown = array;
  counter.count = 8;
  array.push(new Counter());
  if (JSON.stringify(savedArray) !== "[8,1]") return false;
  const token = new Token<number>();
  const savedToken = boxToken(token);
  token.count = 4;
  if (JSON.stringify(savedToken) !== '{"count":4}') return false;
  const privateState = new PrivateState();
  if (privateState.read() !== 1 || Object.keys(privateState).join("|") !== "visible") return false;
  const leaf = new Leaf();
  const savedBase = retainBase(leaf);
  leaf.last = 4;
  if (JSON.stringify(savedBase) !== '{"first":1,"middle":2,"last":4}' || !Object.is(savedBase, retainBase(leaf))) return false;
  const head = new Link();
  head.next = head;
  const recursive: unknown = head;
  try { JSON.stringify(recursive); return false; } catch {}
  head.next = undefined;
  return JSON.stringify(recursive) === '{"value":1}';
}

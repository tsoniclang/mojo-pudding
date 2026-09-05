import type { i32 } from "@tsonic/mojo/types.js";

class BaseScore {
  score(): i32 {
    return 1;
  }
}

class DerivedScore extends BaseScore {
  score(): i32 {
    return 2;
  }
}

interface CounterView {
  value: i32;
  next(): i32;
}

class Counter implements CounterView {
  value: i32 = 1;

  next(): i32 {
    this.value += 1;
    return this.value;
  }
}

interface Parser {
  parse(value: string): string;
  parse(value: string, suffix: string): string;
}

const parser: Parser = {
  parse(value: string, suffix?: string): string {
    return suffix === undefined ? value : value + suffix;
  },
};

export function inheritanceAndInterfaceProof(): i32 {
  const score: BaseScore = new DerivedScore();
  const counter: CounterView = new Counter();
  counter.value = counter.next();
  return score.score() * 10 + counter.value;
}

export function overloadProof(): string {
  return parser.parse("a") + parser.parse("b", "c");
}

export function boundMethodProof(): i32 {
  const counter = new Counter();
  const next = counter.next;
  return next();
}

function applyValue(value: i32, transform: (value: i32) => i32): i32 {
  return transform(value);
}

export function retainedCallableProof(): i32 {
  const double = (value: i32): i32 => value + value;
  return applyValue(4, double);
}

class Link {
  value: i32;
  next: Link | undefined;

  constructor(value: i32, next?: Link) {
    this.value = value;
    this.next = next;
  }
}

export function recursiveConstructionProof(): i32 {
  const tail = new Link(7);
  const head = new Link(2, tail);
  const next = head.next;
  return next === undefined ? 0 : head.value + next.value;
}

class Failure {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

class OtherFailure {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

function captureFailure(operation: () => void): string {
  try {
    operation();
  } catch (error) {
    if (error instanceof Failure) return error.message;
    if (error instanceof OtherFailure) return error.message;
    return `${error}`;
  }
  return "";
}

function failCombined(source: boolean): void {
  if (source) throw new Error("source");
  throw new Failure("first");
}

export function errorUnionProof(): string {
  const first = captureFailure(() => failCombined(true));
  const second = captureFailure(() => {
    throw new OtherFailure("other");
  });
  return first + "|" + second;
}

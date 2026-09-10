export function capturedResult(value: number): () => number {
  return () => value + 1;
}

export function nestedResult(value: number): () => () => number {
  return () => () => value + 2;
}

export function returnedCallableProof(): number {
  const first = capturedResult(40);
  const factory = nestedResult(39);
  const second = factory();
  return first() + second();
}

function countingFactory(seed: number): () => () => number {
  let count = seed;
  return () => () => { count += 1; return count; };
}

function immediateFactory(value: number): () => number {
  return () => {
    const read = () => value + 1;
    return read();
  };
}

function shadowFactory(value: number): () => (value: number) => number {
  return () => (value: number) => value + 1;
}

export function nestedCaptureProof(): number {
  const factory = countingFactory(10);
  const first = factory();
  const second = factory();
  const direct = immediateFactory(30);
  const shadow = shadowFactory(100)();
  return first() + second() + first() + direct() + direct() + shadow(2);
}

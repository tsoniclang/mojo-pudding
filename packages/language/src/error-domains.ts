class FirstFailure { value: number = 1; }
class SecondFailure { value: number = 2; }
class ArgumentFailure { value: number = 3; }
class Trace { value: number = 0; }

function selected(value: number, trace: Trace): number {
  trace.value = trace.value * 10 + 2;
  if (value === 1) throw new FirstFailure();
  if (value === 2) throw new SecondFailure();
  return value;
}

function argument(value: number, trace: Trace): number {
  trace.value = trace.value * 10 + 1;
  if (value === 3) throw new ArgumentFailure();
  if (value < 0) return selected(-value, trace);
  return value;
}

class Selected {
  value: number;
  constructor(value: number, trace: Trace) { this.value = selected(value, trace); }
  run(value: number, trace: Trace): number { return selected(value, trace); }
  static run(value: number, trace: Trace): number { return selected(value, trace); }
}

export function nestedInvocationErrorProof(value: number, shape: number): number {
  const trace = new Trace();
  try {
    let result = 0;
    if (shape === 0) result = selected(argument(value, trace), trace);
    if (shape === 1) result = Selected.run(argument(value, trace), trace);
    if (shape === 2) {
      const receiver = new Selected(0, new Trace());
      result = receiver.run(argument(value, trace), trace);
    }
    if (shape === 3) result = new Selected(argument(value, trace), trace).value;
    if (shape === 4) {
      const operation = selected;
      result = operation(argument(value, trace), trace);
    }
    return trace.value * 100 + result;
  } catch (error) {
    if (error instanceof FirstFailure) return trace.value * 100 + error.value;
    if (error instanceof SecondFailure) return trace.value * 100 + error.value;
    if (error instanceof ArgumentFailure) return trace.value * 100 + error.value;
    throw error;
  }
}

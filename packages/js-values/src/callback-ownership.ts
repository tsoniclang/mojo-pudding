function invoke(callback: (value: Error | undefined) => string, value: Error | undefined): string {
  return callback(value);
}

function retain(value: Error): () => string {
  return () => value.message;
}

function factory(fail: boolean): () => string {
  return () => {
    if (fail) throw new Error("authored");
    return "ok";
  };
}

class Receiver {
  label: string = "receiver";

  reader(): () => () => string {
    return () => () => this.label;
  }
}

export function callbackOwnershipProof(): boolean {
  const original = new Error("original");
  const callback = (value: Error | undefined): string => value === undefined ? "none" : value.message;
  const alias = callback;
  if (invoke(alias, original) !== "original" || invoke(alias, undefined) !== "none") {
    throw new Error("optional error payload changed");
  }
  const captured = retain(original);
  if (captured() !== "original" || captured() !== "original") throw new Error("error capture was consumed");
  if (factory(false)() !== "ok") throw new Error("returned callback changed");
  let caught = "";
  try { factory(true)(); }
  catch (error) { caught = (error as Error).message; }
  if (caught !== "authored") throw new Error("returned callback error domain changed");
  const receiver = new Receiver();
  const read = receiver.reader()();
  receiver.label = "updated";
  if (read() !== "updated" || read() !== "updated") throw new Error("lexical receiver identity changed");
  return true;
}

interface Headers {
  "content-type": string;
  0: number;
}

class Header {
  "x-value": number = 3;
  x_value: number = 5;
  trace: string = "";
  static "header-count": number = 2;

  get "read-value"(): number { this.trace += "g"; return this["x-value"]; }
  set "read-value"(value: number) { this.trace += "s"; this["x-value"] = value; }
}

function select(header: Header): Header { header.trace += "r"; return header; }
function key(header: Header): "read-value" { header.trace += "k"; return "read-value"; }

export function memberNamesProof(): boolean {
  const headers: Headers = { "content-type": "text/plain", 0: 7 };
  if (headers["content-type"] !== "text/plain" || headers[0] !== 7) return false;
  const header = new Header();
  const previous = select(header)[key(header)]++;
  return previous === 3 && header["x-value"] === 4 && header.x_value === 5 &&
    header.trace === "rkgs" && Header["header-count"] === 2;
}

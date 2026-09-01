import type { i32 } from "@tsonic/mojo/types.js";

let disposalOrder: i32 = 0;

class Resource {
  rank: i32 = 0;

  constructor(rank: i32) {
    this.rank = rank;
  }

  [Symbol.dispose](): void {
    disposalOrder = disposalOrder * 10 + this.rank;
  }
}

class AsyncResource {
  rank: i32 = 0;

  constructor(rank: i32) {
    this.rank = rank;
  }

  async [Symbol.asyncDispose](): Promise<void> {
    disposalOrder = disposalOrder * 10 + this.rank;
  }
}

export function synchronousResourceProof(): i32 {
  disposalOrder = 0;
  {
    using first = new Resource(1);
    using second = new Resource(2);
  }
  return disposalOrder;
}

export async function asynchronousResourceProof(): Promise<i32> {
  disposalOrder = 0;
  {
    await using first = new AsyncResource(3);
    await using second = new AsyncResource(4);
  }
  return disposalOrder;
}

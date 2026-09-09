import { Worker, setEnvironmentData } from "node:worker_threads";

export function main(): void {
  setEnvironmentData("mode", "proof");
  const worker = new Worker("./child.js", { workerData: 42, name: "mojo-proof" });
  let replies = 0;
  worker.on("online", () => worker.postMessage(1));
  worker.on("message", (value) => {
    if (value !== 43) throw new Error("Worker returned the wrong value");
    replies += 1;
  });
  worker.on("error", () => { throw new Error("Worker raised an unexpected error"); });
  worker.on("exit", (code) => {
    if (code !== 0 || replies !== 1) throw new Error("Worker completion was incomplete");
    console.log("worker-ok");
  });
}

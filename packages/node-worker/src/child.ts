import { getEnvironmentData, isMainThread, parentPort, workerData } from "node:worker_threads";

if (isMainThread) throw new Error("Worker source ran in the main realm");
if (getEnvironmentData("mode") !== "proof") throw new Error("Worker environment was not cloned");
if (parentPort === undefined) throw new Error("Worker has no parent channel");
if (typeof workerData !== "number") throw new Error("Worker data is not numeric");
const port = parentPort;
const offset = workerData;
port.on("message", (value) => {
  if (typeof value !== "number") throw new Error("Worker input is not numeric");
  port.postMessage(value + offset);
  port.close();
});

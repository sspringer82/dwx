import { parentPort, workerData } from "node:worker_threads";
import { webcrypto } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";

const PROGRESS_IDX = 0;
const CURRENT_STEP_IDX = 1;
const PARTIAL_SUM_IDX = 2;
const STATUS_IDX = 3;
const RANDOM_IDX = 4;

const STATUS_RUNNING = 0;
const STATUS_DONE = 1;
const STATUS_FAILED = -1;

async function runSlowCalculation() {
  const { steps, sharedBuffer } = workerData;
  const sharedState = new Int32Array(sharedBuffer);
  const randomSource = new Uint32Array(1);

  let partial = 0;

  for (let step = 1; step <= steps; step += 1) {
    // Simulate expensive async work between steps.
    await delay(450);

    webcrypto.getRandomValues(randomSource);
    const random = randomSource[0] % 1000;

    partial += step * step + random;
    const progress = Math.floor((step / steps) * 100);

    Atomics.store(sharedState, CURRENT_STEP_IDX, step);
    Atomics.store(sharedState, PARTIAL_SUM_IDX, partial);
    Atomics.store(sharedState, PROGRESS_IDX, progress);
    Atomics.store(sharedState, RANDOM_IDX, random);
    Atomics.notify(sharedState, PROGRESS_IDX);

    parentPort.postMessage({
      type: "intermediate",
      step,
      random,
      partial,
      progress
    });
  }

  Atomics.store(sharedState, STATUS_IDX, STATUS_DONE);
  Atomics.notify(sharedState, STATUS_IDX);

  parentPort.postMessage({
    type: "done",
    result: partial,
    random: Atomics.load(sharedState, RANDOM_IDX)
  });
}

runSlowCalculation().catch((error) => {
  const { sharedBuffer } = workerData;
  const sharedState = new Int32Array(sharedBuffer);

  Atomics.store(sharedState, STATUS_IDX, STATUS_FAILED);
  Atomics.notify(sharedState, STATUS_IDX);

  parentPort.postMessage({
    type: "error",
    error: error?.message ?? String(error)
  });
});

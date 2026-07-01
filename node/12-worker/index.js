import { Worker } from "node:worker_threads";

const STEPS = 10;
const PROGRESS_IDX = 0;
const CURRENT_STEP_IDX = 1;
const PARTIAL_SUM_IDX = 2;
const STATUS_IDX = 3;
const RANDOM_IDX = 4;

const STATUS_RUNNING = 0;
const STATUS_DONE = 1;
const STATUS_FAILED = -1;

const sharedBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * 5);
const sharedState = new Int32Array(sharedBuffer);

sharedState[PROGRESS_IDX] = 0;
sharedState[CURRENT_STEP_IDX] = 0;
sharedState[PARTIAL_SUM_IDX] = 0;
sharedState[STATUS_IDX] = STATUS_RUNNING;
sharedState[RANDOM_IDX] = 0;

const worker = new Worker(new URL("./worker.js", import.meta.url), {
  workerData: {
    steps: STEPS,
    sharedBuffer
  }
});

worker.on("message", (message) => {
  if (message.type === "intermediate") {
    console.log(
      `[message] step=${message.step}/${STEPS}, random=${message.random}, partial=${message.partial}`
    );
  }

  if (message.type === "done") {
    console.log(`[message] final result=${message.result}, lastRandom=${message.random}`);
  }

  if (message.type === "error") {
    console.error(`[message] worker error: ${message.error}`);
  }
});

worker.on("error", (error) => {
  console.error("Worker crashed:", error);
  process.exitCode = 1;
});

let lastSharedSnapshot = "";

const pollTimer = setInterval(() => {
  const progress = Atomics.load(sharedState, PROGRESS_IDX);
  const currentStep = Atomics.load(sharedState, CURRENT_STEP_IDX);
  const partial = Atomics.load(sharedState, PARTIAL_SUM_IDX);
  const status = Atomics.load(sharedState, STATUS_IDX);
  const random = Atomics.load(sharedState, RANDOM_IDX);
  const sharedSnapshot = `${progress}|${currentStep}|${random}|${partial}|${status}`;

  if (sharedSnapshot !== lastSharedSnapshot) {
    lastSharedSnapshot = sharedSnapshot;
    console.log(
      `[shared] progress=${progress}% step=${currentStep}/${STEPS} random=${random} partial=${partial}`
    );
  }

  if (status === STATUS_DONE) {
    clearInterval(pollTimer);
    console.log("[shared] worker finished");
    worker.terminate().catch(() => { });
  }

  if (status === STATUS_FAILED) {
    clearInterval(pollTimer);
    console.error("[shared] worker failed");
    worker.terminate().catch(() => { });
    process.exitCode = 1;
  }
}, 300);

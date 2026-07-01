import { readFile, writeFile, unlink } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Worker } from "node:worker_threads";

const execFileAsync = promisify(execFile);

function printResult(label, ok, detail) {
  const state = ok ? "OK" : "DENIED";
  console.log(`[${state}] ${label}`);
  if (detail) {
    console.log(`       ${detail}`);
  }
}

function formatError(error) {
  if (!error || typeof error !== "object") {
    return String(error);
  }

  const code = "code" in error ? error.code : "UNKNOWN";
  const message = "message" in error ? error.message : "Unknown error";
  return `${code}: ${message}`;
}

async function fsUseCases() {
  const target = new URL("./sample.txt", import.meta.url);
  const output = new URL("./tmp-output.txt", import.meta.url);

  try {
    const content = await readFile(target, "utf8");
    printResult("fs read", true, `sample.txt has ${content.trim().length} chars`);
  } catch (error) {
    printResult("fs read", false, formatError(error));
  }

  try {
    await writeFile(output, `written at ${new Date().toISOString()}\n`, "utf8");
    printResult("fs write", true, "tmp-output.txt created");
    await unlink(output).catch(() => { });
  } catch (error) {
    printResult("fs write", false, formatError(error));
  }
}

async function netUseCase() {
  try {
    const response = await fetch("https://example.com", {
      signal: AbortSignal.timeout(3000)
    });
    printResult("net", true, `GET https://example.com -> ${response.status}`);
  } catch (error) {
    printResult("net", false, formatError(error));
  }
}

async function childProcessUseCase() {
  try {
    const { stdout } = await execFileAsync(process.execPath, ["-v"]);
    printResult("child_process", true, stdout.trim());
  } catch (error) {
    printResult("child_process", false, formatError(error));
  }
}

async function workerUseCase() {
  try {
    const worker = new Worker(new URL("./worker.js", import.meta.url));
    const result = await new Promise((resolve, reject) => {
      worker.once("message", resolve);
      worker.once("error", reject);
    });
    printResult("worker", true, `worker replied: ${result}`);
    await worker.terminate();
  } catch (error) {
    printResult("worker", false, formatError(error));
  }
}

console.log("Node permissions model demo");
console.log(`Node version: ${process.version}`);
console.log("Run with: npm run start:unprivileged | npm run start:privileged\n");

await fsUseCases();
await netUseCase();
await childProcessUseCase();
await workerUseCase();

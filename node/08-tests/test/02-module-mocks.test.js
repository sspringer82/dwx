import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

describe("02 module mocks", () => {
  let activeMocks;

  beforeEach(() => {
    activeMocks = [];
  });

  afterEach(() => {
    for (const mock of activeMocks) {
      mock.restore();
    }
  });

  it("module mock: own module", async (t) => {
    const ownModuleMock = t.mock.module("../src/time-provider.js", {
      namedExports: {
        nowIso: () => "2026-06-30T08:00:00.000Z",
      },
    });
    activeMocks.push(ownModuleMock);

    const { buildReportLabel } = await import(`../src/report.js?own=${Math.random()}`);

    assert.equal(buildReportLabel(), "generated at 2026-06-30T08:00:00.000Z");
  });

  it("module mock: node core module", async (t) => {
    const coreModuleMock = t.mock.module("node:fs/promises", {
      namedExports: {
        readFile: async () => JSON.stringify({ env: "test", port: 3000 }),
      },
    });
    activeMocks.push(coreModuleMock);

    const { loadConfig } = await import(`../src/read-config.js?core=${Math.random()}`);

    const config = await loadConfig("/does/not/matter.json");

    assert.deepEqual(config, { env: "test", port: 3000 });
  });

  it("module mock: npm module", async (t) => {
    const npmModuleMock = t.mock.module("axios", {
      defaultExport: {
        get: async () => ({ data: { name: "Grace Hopper" } }),
      },
    });
    activeMocks.push(npmModuleMock);

    const { fetchUserName } = await import(`../src/fetch-user.js?npm=${Math.random()}`);

    const name = await fetchUserName(1);

    assert.equal(name, "Grace Hopper");
  });
});

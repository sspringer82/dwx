import assert from "node:assert/strict";
import { after, afterEach, before, beforeEach, describe, it } from "node:test";

import { sum } from "../src/math.js";

describe("01 basics", () => {
  let basket;

  before(() => {
    basket = [];
  });

  after(() => {
    basket = [];
  });

  beforeEach(() => {
    basket.length = 0;
  });

  afterEach(() => {
    basket.length = 0;
  });

  it("simple function test: sum adds two numbers", () => {
    assert.equal(sum(2, 3), 5);
  });

  it("setup/teardown hooks keep state isolated", () => {
    basket.push("apple");
    assert.equal(basket.length, 1);
  });

  it("state is clean for every test", () => {
    assert.equal(basket.length, 0);
  });

  it("spy: tracks calls and arguments", (t) => {
    const personService = {
      fullName(first, last) {
        return `${first} ${last}`;
      },
    };

    const spy = t.mock.method(personService, "fullName");

    const result = personService.fullName("Ada", "Lovelace");

    assert.equal(result, "Ada Lovelace");
    assert.equal(spy.mock.calls.length, 1);
    assert.deepEqual(spy.mock.calls[0].arguments, ["Ada", "Lovelace"]);
  });
});

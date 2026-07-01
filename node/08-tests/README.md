# 07-tests

Small Node.js test runner example using the built-in `node:test` runner with `assert`.

## What this demonstrates

- Simple function test.
- Setup and teardown hooks.
- Spy with `t.mock.method(...)`.
- Module mocking with `t.mock.module(...)` for:
  - own module
  - Node core module
  - npm module

## Run

```bash
npm install
npm test
```

Watch mode:

```bash
npm run test:watch
```

## Files

- `test/01-basics.test.js`: simple test, setup, teardown, spy.
- `test/02-module-mocks.test.js`: module mocks (own/core/npm).

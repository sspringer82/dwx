# 09-ts-strip

Small Node.js example for native TypeScript type stripping.

## What this demonstrates

- Running a `.ts` file directly in Node.
- Type annotations are stripped at runtime.
- Runtime JavaScript remains plain and simple.

## Run

```bash
npm start
```

## Notes

- This demo uses `--experimental-strip-types`.
- Pure type syntax works (e.g. `type`, type annotations).
- TS features that need transpilation (like `enum`) are not supported.
- In `index.ts` there is a commented-out enum block that would trigger an error if enabled.

# 10-ts

TypeScript demo with full TS syntax support via `tsx`.

## What this demonstrates

- Running `.ts` directly with `tsx`.
- TS syntax that requires transpilation and therefore does not work with pure Node type stripping.
- A direct comparison command against `node --experimental-strip-types`.

## Run

```bash
npm install
npm start
```

## Compare with Node type stripping

```bash
npm run strip
```

Expected result: `npm start` works, while `npm run strip` fails because this demo contains features that need transpilation.

## Restricted in type stripping (used in this demo)

- `enum`
- constructor parameter properties (`constructor(public id: number, ...)`)
- `namespace` with runtime exports
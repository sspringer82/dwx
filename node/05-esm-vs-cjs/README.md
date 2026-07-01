# 05-esm-vs-cjs

Small Node.js example showing a migration in progress where ESM and CJS coexist.

## What this demonstrates

- Project defaults to ESM via `"type": "module"`.
- Legacy modules stay as `.cjs` and continue to run.
- ESM loading CJS via `createRequire()`.
- CJS loading ESM via async `import()`.
- Two entry points: one modern (`src/app.mjs`) and one legacy (`cjs-entry.cjs`).

## Run

```bash
npm start
npm run start:cjs
```

Both commands should work in the same codebase, which is typical in the middle of a migration.

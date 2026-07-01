# 07-watch

Small Node.js example for native watch mode using `--watch`.

## What this demonstrates

- Running a script with Node's built-in file watcher.
- Automatic restarts when `index.js` changes.

## Run

```bash
npm run watch
```

Then edit `index.js` and save it. Node restarts the process automatically.

For a normal one-shot run without watch mode:

```bash
npm start
```
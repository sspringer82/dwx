# 06-env

Small Node.js example for native `.env` support using `--env-file`.

## What this demonstrates

- Loading environment variables without `dotenv`.
- Reading values from `process.env`.
- Layering multiple env files (base + production override).

## Run

```bash
npm start
npm run start:prod
```

`start` loads only `.env`.

`start:prod` loads `.env` and then `.env.production`, so later values override earlier ones.
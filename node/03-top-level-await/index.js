import https from 'node:https';
import { readFile } from 'node:fs/promises';

const [key, cert] = await Promise.all([
  readFile(new URL('./certs/key.pem', import.meta.url)),
  readFile(new URL('./certs/cert.pem', import.meta.url)),
]);

https.createServer({ key, cert }, (req, res) => res.end('hello from top-level await')).listen(8443, () => console.log('https://localhost:8443'));

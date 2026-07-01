import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const logLegacy = require('./legacy-logger.cjs');

export function getModernMessage(name) {
  logLegacy('modern-service', 'Loaded a CJS module from ESM using createRequire()');
  return `Hello ${name}, this part is already ESM.`;
}

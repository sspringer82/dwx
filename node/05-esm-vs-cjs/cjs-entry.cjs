const logLegacy = require('./src/legacy-logger.cjs');

async function main() {
  logLegacy('cjs-entry', 'Legacy CJS entry still active during migration');

  // Legacy entry imports modern ESM modules on demand.
  const { getModernMessage } = await import('./src/modern-service.mjs');
  console.log(getModernMessage('legacy-runtime'));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

function logLegacy(scope, message) {
  const timestamp = new Date().toISOString();
  console.log(`[CJS][${scope}] ${timestamp} ${message}`);
}

module.exports = logLegacy;

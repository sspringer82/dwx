const logLegacy = require('./legacy-logger.cjs');

async function getLegacyPipelineResult(name) {
  logLegacy('legacy-service', 'Calling ESM utility with dynamic import()');

  // CJS can consume ESM only asynchronously via import().
  const modernMath = await import('./modern-math.mjs');
  const value = modernMath.multiply(6, 7);

  return modernMath.formatResult(name, value);
}

module.exports = {
  getLegacyPipelineResult
};

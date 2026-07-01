import { getModernMessage } from './modern-service.mjs';
import legacyService from './legacy-service.cjs';

console.log('--- ESM entry point ---');
console.log(getModernMessage('team'));
console.log(await legacyService.getLegacyPipelineResult('team'));

import add, { APP, inc } from './math.js';

console.log(APP, import.meta.dirname);
console.log('add:', add(2, 3), 'inc:', inc(4));

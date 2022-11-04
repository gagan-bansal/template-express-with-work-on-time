const lg = require('munia')(__filename);
const cwd = process.cwd();
const workers = [
  // cwd + '/worker/file.js',
].map(file => {
  return require(file);
})
lg.info('Number of workers: ', workers.length);

module.exports = workers;

const {WorkOnTime, Worker, MongoStore} = require('work-on-time');
const config = require(process.cwd() + '/config');
const lg = require('munia')(__filename);
const workersList = require('./all-workers.js');

module.exports = async function (app) {
  lg.info('Starting scheduler...');
  const wot = new WorkOnTime({
    mongoUri: config.mongoDb.mongoUri + '/' + config.mongoDb.dbName,
  });
  await wot.init();
  wot.on('error', (error) => lg.error({error}));

  workersList.forEach(workerOptions => {
    const worker = new Worker(workerOptions);
    wot.addWorker(worker);
    worker.on('start', () => lg.verbose('job started for: ', worker.name));
    worker.on('complete', () => lg.verbose('job completed for: ', worker.name));
  });

  // IMPORTANT! should be started after workers are added
  await wot.start();

  lg.info('Scheduler started');
  return wot;
}

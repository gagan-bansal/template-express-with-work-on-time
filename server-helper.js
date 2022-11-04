const config = require('./config');
const lg = require('munia')(__filename);
const report = require('./utils/report.js');

if (config.log.logMemoryStatus) {
  setInterval(() => {
    lg.info('Memory status', {memory: process.memoryUsage()})
  }, config.log.logMemoryInterval)
}

let exitingProcess = false
process.on('uncaughtException', function (error) {
  if (exitingProcess) return
  exitingProcess = true
  lg.error('UncaughtException:' + error.message, {error})
  shutdown(1, 'UES is shutting down because of some error')
});

// ref https://blog.heroku.com/best-practices-nodejs-errors
process.on('unhandledRejection', (error, promise) => {
  if (exitingProcess) return
  exitingProcess = true
  lg.error('Unhandled Rejection: ', error.message, {error})
  shutdown(1, 'UES is shutting down because of some error')
});

process.on('SIGTERM', signal => {
  if (exitingProcess) return
  exitingProcess = true
  lg.error(`Process ${process.pid} received a SIGTERM signal`)
  shutdown(0, 'UES is shutting down for system maintenance')
})

process.on('SIGINT', signal => {
  if (exitingProcess) return
  exitingProcess = true
  lg.error(`Process ${process.pid} has been interrupted`)
  shutdown(0, 'UES is shutting down for system maintenance')
})

function shutdown(exitCode, msg) {
  lg.error('Closing down the server, exit code: ' + exitCode);
  lg.error('Will exit the process in 2 sec if server not closed.');
  try {
  report(`${msg}, exitCode: ${exitCode}`)
    .then(() => {
      lg.info('Reported the shutdown')
      process.exit(exitCode)
    })
    .catch(error => {
      lg.error('shutdown: report error: ', error.message, {error});
    })
  } catch (error) {
    console.log(error);
  }
  setTimeout(() => {
    lg.error('Exiting the process now as it seems server not closed.')
    process.exit(exitCode)
  }, 2000).unref() // Prevents the timeout from registering on event loop
}


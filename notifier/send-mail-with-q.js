const {default: PQueue} = require('p-queue');
const sendMail = require('./send-mail.js');
const config = require(process.cwd() + '/config');
const insertNotif = require('./insert-notification.js');
const lg = require('munia')(__filename);

const mailQueue = new PQueue({
  concurrency: config.smtp.concurrency,
  intervalCap: config.smtp.intervalCap,
  interval: config.smtp.interval
})

mailQueue.addToQ = function (opts) {
  return mailQueue.add(() => {
    return sendMail(opts.email)
      .then(resp => {
        if (opts.notification) {
          return insertNotif(opts.notification)
          .catch(err => {
            lg.error('Error on notification insert: ', err.message, {error: err, input: opts});
            return Promise.resolve(false);
          })
        } else {
          return Promise.resolve(true);
        }
      })
      .catch(err => {
        lg.error('Error on send mail with q: ', err.message, {error: err, input: opts});
        return Promise.resolve(false);
      })
  });
}

module.exports = mailQueue

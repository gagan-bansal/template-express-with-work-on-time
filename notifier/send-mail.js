const nodemailer = require('nodemailer');
const Promise = require('bluebird');
//const ical = require('ical-generator');
const config = require(process.cwd() + '/config');
const lg = require('munia')(__filename);
const extend = require('extend');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.secure,
  auth: config.smtp.auth,
  tls: config.smtp.tls
});

var sendMail = function(data) {
  return new Promise(function(resolve, reject) {
    lg.silly('smtp config host: ', config.smtp.host)
    let missing;
    const validate = ['from', 'to', 'subject', 'html'].every(key => {
      if (!data[key]) {
        missing = key;
        return false;
      } else {
        return true;
      }
    });
    if (missing) {
      lg.error('sendMail: Parameters missing: ' + missing );
      return reject(new Error('Parameter missing: ' + missing))
    }
    lg.silly('sending email...')
    // send mail with defined transport object
    transporter.sendMail(data, (err, info) => {
      if (err) {
        lg.error(err.message, extend({stack: err.stack}, data))
        reject(err)
      } else {
        lg.silly('email sent')
        resolve(true)
      }
      // TODO check if closing is required
      transporter.close()
    })
  })
}

module.exports = sendMail


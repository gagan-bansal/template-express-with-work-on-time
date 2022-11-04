
const config = require('../config');
const sendMail = require('../notifier/send-mail.js');
const lg = require('munia')(__filename);

module.exports = async function (message) {
  lg.debug("stakeholders: ", config.app.stakeHolders.join(', '));
  if (config.app.stakeHolders.length > 0) {
    return sendMail({
      from: config.app.fromEmail,
      to: config.app.stakeHolders.join(', '),
      subject: message,
      html:
    `<pre>
      ${message}
     </pre>
    `
    })
    .catch(err => {
      lg.error('Report to stake holders: Could not sent mail: ' + err.message,
        {error: err})
      return Promise.resolve(true)
    })
  } else {
    return Promise.resolve(false)
  }
}

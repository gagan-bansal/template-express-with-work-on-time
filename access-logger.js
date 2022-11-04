// from https://gist.github.com/cgmartin/913bb12097ff07132597

const morgan = require('morgan');
const ip = require('ip')
const os = require('os')
const dayjs = require('./utils/day.js')
const op = require('object-path')
const serverIp = ip.address()
const lg = require('munia')(__filename);

morgan.token('hostname', function getHostname() {
  return os.hostname();
});
morgan.token('pid', function getPid() {
  return process.pid;
});

morgan.token('remote-addr', function (req, res) {
  return req.clientIp
})

function jsonFormat(tokens, req, res) {
  return JSON.stringify({
    'remote-address': tokens['remote-addr'](req, res),
    'time': Date.now(),
    'method': tokens['method'](req, res),
    'url': tokens['url'](req, res),
    'http-version': tokens['http-version'](req, res),
    'status-code': tokens['status'](req, res),
    'content-length': tokens['res'](req, res, 'content-length'),
    'referrer': tokens['referrer'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    'hostname': tokens['hostname'](req, res),
    'pid': tokens['pid'](req, res),
    'body': req.body,
    'serverIp': serverIp,
    'module': 'morgan',
    'level': 'http',
    'cookies': op.get(req, 'cookies'),
    'message': tokens['method'](req, res)
      + ' '+ tokens['url'](req, res)
      + ' ' + tokens['status'](req, res),
    'response-time': tokens['response-time'](req, res),
    'content-length': tokens.res(req, res, 'content-length')
  });
}

module.exports = function loggingMiddleware() {
  return morgan(jsonFormat)
    // skip: function (req, res) {
    //   return req.method === 'GET' && /\/dash\/api/i.test(req.originalUrl)
    // }
};


require('longjohn');
require('dotenv-safe').config();
require('./server-helper.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const auth = require('http-auth');
const requestIp = require('request-ip');
const path = require('path');

const mongodb = require('./mongodb.js');
const accessLogger = require('./access-logger.js');
const config = require('./config');
const appRoutes = require('./routes.js');
const scheduler = require('./scheduler');
const report = require('./utils/report.js');
const lg = require('munia')(__filename);

const app = express();
if (process.env.NODE_ENV === 'development') {
  // from https://bytearcher.com/articles/refresh-changes-browser-express-livereload-nodemon/
  const livereload = require('livereload');
  const connectLivereload = require("connect-livereload");
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, 'dashboard'));

  app.use(connectLivereload({
  }));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
}

if (process.env.NODE_ENV === 'production')
  app.use(compression({}));

app.use(requestIp.mw())
app.set('trust proxy', 1)

//let basic = auth.basic({
//  realm: 'Admin Area.',
//  file: __dirname + '/.rpa.htpasswd'
//})
//app.use(auth.connect(basic))

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// log request with morgan
app.use(accessLogger())

// require('./schedular.js')().then(schedular => {
//   app.schedular = schedular
// })


app.use(errorHandler)
// initiating the app
// connecting mongo
mongodb.connectToServer()
.then(async client => {
  // creating mongo indexes
  //await createDbIndexes().catch(err => {throw err});
  app.db = mongodb.getDb();
  lg.info('Mongo db connection established.');

  // start scheduler that returns an instance of work-on-time
  app.workOnTime = await scheduler(app);

  // mount appliction routes
  appRoutes(app);

  // start app
  app.listen(config.app.port, () => {
    lg.info('Express server listening on port ', config.app.port)
    report('URS system is ready now');
  })
}).catch(err => {throw err;})

function errorHandler (err, req, res, next) {
  lg.error(err.message, {url: req.originalUrl, stack: err.stack})
  res.status(500).json({message: 'Something broke!'})
}

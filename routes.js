const express = require('express');
const basicAuth = require('express-basic-auth')
const lg = require('munia')(__filename);
const mongodb = require('./mongodb.js');
const {ExpressAdapter} = require('work-on-time');

module.exports = function (app) {
  if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      const body = JSON.stringify(req.body);
      if (body !== '{}') lg.debug('body: ', JSON.stringify(body));
      next();
    });
  }
  app.use(function (req, res, next) {
    res.send500 = function () {
      res.status(500).json({message: 'Internal Server Error'});
    };
    res.send404 = function (msg) {
      res.status(404).json({message: msg || 'Not found'});
    };
    next();
  });

  // health check
  app.get('/health', (req, res) => res.status(200).json({msg: 'OK'}));
  app.get('/dbExists/:dbName', (req, res) => {
    mongodb.dbExists(req.params.dbName)
    .then(resp => {
      if (resp) {
        res.status(200).json({msg: 'true'});
      } else {
        res.status(404).json({msg: 'false'});
      }
    }).catch( err => {
      lg.error('error: ', err.message, {error: err});
      res.status(500).json({msg: 'Internal server error!'});
    });
  });

  // js, css and images
  app.use('/public', express.static('./public'));

  // API to expose

  // further below all api are admin api
  if (process.env.NODE_ENV === 'development') {
    lg.warn('running without basic auth');
  } else {
    app.use(basicAuth({
      users: { 'admin': process.env.ADMIN_PASS },
      challenge: true,
      realm: 'admin'
    }));
  }

  // docs
  app.get('/README.html', (req, res) => {
    res.sendFile('README.html', {
      root: __dirname,
    }, error => {
      if (error) lg.error('README.html send file error: ', {error});
    });
  });
  app.use('/docs', express.static('./docs'))

  // mount work-on-time dashboard routes
  const expAdapter = new ExpressAdapter(app.workOnTime);
  const router = expAdapter.getRouter();
  app.use('/dash/scheduler', router);

  // handle 404
  app.use('*', (req, res, next) => {
    res.status(404).send('Not found');
  });
}

const { MongoClient } = require("mongodb");

const config = require(process.cwd() + '/config');
const lg = require('munia')(__filename);

const uri = config.mongoDb.mongoUri;
const client = new MongoClient(uri);

let _db;

module.exports = {
  connectToServer: function () {
    lg.info('mongo uri: ', uri);
    return client.connect().then(() => {
      lg.info('connected to mongo: ' + uri);
      _db = client.db(config.mongoDb.dbName);
      return Promise.resolve(_db);
    }).catch(err => {
      lg.error('MongoDb conn error: ' + err.message, {
        stack: err.stack, uri: uri, dbName: config.mongoDb.dbName
      });
      return Promise.reject(err);
    })
  },

  getDb: function () {
    return _db;
  },

  // from http://mongodb.github.io/node-mongodb-native/2.2/api/
  listDbs: function () {
    const adminDb = _db.admin();

    // List all the available databases
    return adminDb.listDatabases()
  },

  close: async function () {
    return _client.close();
  },

  dbExists: function (dbName) {
    return this.listDbs().then(result => {
      const dbs = result.databases.map(doc => doc.name);
      const is = dbs.indexOf(dbName) > -1 ? true : false;
      return Promise.resolve(is);
    })
  }
}

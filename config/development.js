require('dotenv').config();
module.exports = {
  app: {
    port: 3030,
    stakeHolders: ['gaganbansal123@rediffmail.com'],
    fromEmail: 'gaganbansal123@rediffmail.com'
  },
  log: {
    logMemoryStatus: false,
    logMemoryInterval: 60000
  },
  mongoDb: {
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017',
    dbName: 'projectTemplate',
    collections: {
    }
  },
  smtp: {
    host: '0.0.0.0',
    port: 1025,
    secure: false,
    auth: false,
    tls: {
      rejectUnauthorized: false
    },
    concurrency: 5,
    intervalCap: 10,
    interval: 1000
  }
}

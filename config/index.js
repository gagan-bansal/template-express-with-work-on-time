const extend = require('extend')
const munia = require('munia')
const lg = munia(__filename)

const base = require('./base.js')

const env = process.env.NODE_ENV || 'development'
lg.info('app running mode: ', env)
const config = require('./' + env + '.js')

module.exports = extend(true,{}, base, config)

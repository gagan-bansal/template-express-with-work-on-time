const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)

const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

const isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrAfter)

module.exports = dayjs

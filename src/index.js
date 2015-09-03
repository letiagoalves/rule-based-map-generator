'use strict';

var api = require('./api');
var builder = require('./builder.js');

module.exports = {
    getStrategyFactory: api.getStrategyFactory,
    createBlockFactory: api.createBlockFactory,
    createConnectorInstance: api.createConnectorInstance,
    createWorldInstance: api.createWorldInstance,
    parse: builder.parse
};

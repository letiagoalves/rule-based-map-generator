'use strict';

var api = require('./api');
var parser = require('./parser');

module.exports = {
    getStrategyFactory: api.getStrategyFactory,
    createBlockFactory: api.createBlockFactory,
    createConnectorInstance: api.createConnectorInstance,
    createWorldInstance: api.createWorldInstance,
    parser: parser
};

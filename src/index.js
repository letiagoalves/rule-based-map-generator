'use strict';

var api = require('./api');
var parser = require('./parser');

module.exports = {
    createStrategy: api.createStrategy,
    createBlockFactory: api.createBlockFactory,
    createConnectorInstance: api.createConnectorInstance,
    createWorldInstance: api.createWorldInstance,
    createWorldConstraints: api.createWorldConstraints,
    parser: parser
};

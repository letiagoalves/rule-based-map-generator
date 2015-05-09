'use strict';

var validator = require('./../validator');
var schema = require('./schema');
var CONSTANTS = require('./../constants.json');

function Connector(id, type, blockIds, blockClasses) {
    id = validator.assert(id, schema.id, 'Connector id');
    type = validator.assert(type, schema.type, 'Connector type');
    blockIds = validator.assert(blockIds, schema.blockIds, 'Connector blocks IDs');
    blockClasses = validator.assert(blockClasses, schema.blockClasses, 'Connector blocks classes');

    this.id = id;
    this.type = type;
    this.blockIds = blockIds;
    this.blockClasses = blockClasses;
}

module.exports = Connector;

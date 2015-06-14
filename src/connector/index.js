'use strict';

// TODO: return copies and only trough getters
var validator = require('./../validator');
var schema = require('./schema');

function Connector(id, type, blockIds, blockClasses) {
    id = validator.assert(id, schema.id, 'Connector id');
    type = validator.assert(type, schema.type, 'Connector type');
    blockIds = validator.assert(blockIds, schema.blockIds, 'Connector blocks IDs');
    blockClasses = validator.assert(blockClasses, schema.blockClasses, 'Connector blocks classes');

    // TODO: documentation
    function getId() {
        return id;
    }

    function getType() {
        return type;
    }

    function getBlockIds() {
        return blockIds;
    }

    function getBlockClasses() {
        return blockClasses;
    }

    // public
    this.getId = getId;
    this.getType = getType;
    this.getBlockIds = getBlockIds;
    this.getBlockClasses = getBlockClasses;
}

module.exports = Connector;

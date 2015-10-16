'use strict';

var validator = require('./../validator');
var schema = require('./schema');
var clone = require('mout/lang/clone');

/**
 * @constructor Connector
 * @description Creates a connector instance that can be attached to block instances
 * @param {String} id           the connector identifier
 * @param {String} type         the connector type (blacklist or whitelist)
 * @param {Array} blockIds      the allowed/denied set of block identifiers
 * @param {Array} blockClasses  the allowed/denied set of block classes
 */
function Connector(id, type, blockIds, blockClasses) {
    id = validator.assert(id, schema.id, 'Connector id');
    type = validator.assert(type, schema.type, 'Connector type');
    blockIds = validator.assert(blockIds, schema.blockIds, 'Connector blocks IDs');
    blockClasses = validator.assert(blockClasses, schema.blockClasses, 'Connector blocks classes');

    /**
     * @function getId
     * @description Returns the connector identifier
     * @return {String}
     */
    function getId() {
        return id;
    }

    /**
     * @function getType
     * @description Returns the connector type (blacklist or whitelist)
     * @return {String}
     */
    function getType() {
        return type;
    }

    /**
     * @function getBlockIds
     * @description Returns the allowed/denied set of block identifiers
     * @return {Array}
     */
    function getBlockIds() {
        return clone(blockIds);
    }

    /**
     * @function getBlockClasses
     * @description Returns the allowed/denied set of block classes
     * @return {Array}
     */
    function getBlockClasses() {
        return clone(blockClasses);
    }

    // public
    this.getId = getId;
    this.getType = getType;
    this.getBlockIds = getBlockIds;
    this.getBlockClasses = getBlockClasses;
}

module.exports = Connector;

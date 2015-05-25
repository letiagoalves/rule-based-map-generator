'use strict';

var Block = require('./block');
var Connector = require('./connector');
var World = require('./world');
var WorldConstraints = require('./world/world-constraints.js');
var forOwn = require('mout/object/forOwn');
var objectMap = require('mout/object/map');

function getStrategy(numberOfSides) {
    switch (numberOfSides) {
    case 4:
        return require('./strategies/four-sides');
    default:
        throw new Error('Unknown strategy');
    }
}

function parseBlock(sidesTemplate) {
    return function (block) {
        return new Block(block.id, sidesTemplate, block.classes, block.constraints);
    };
}

function parseConnector(connector) {
    return new Connector(connector.id, connector.type, connector.blockIds, connector.blockClasses);
}

function createMapUsingProperty(arr, prop) {
    var map = {};
    arr.forEach(function set(value) {
        map[value[prop]] = value;
    });
    return map;
}

function instantiateWorldConstraintsFromConfiguration (config) {
    return new WorldConstraints(config.bounds, config.initialBlock, config.initialMapSize);
}

/**
 * Parses a world configuration and returns a world instance
 * @param  {Object} config  World configuration
 * @return {World}  A world instance
 */
function parse(config) {
    // TODO: validate JSON
    // TODO: rethink strategies
    var strategy = getStrategy(config.numberOfSides);

    var blocks = config.blocks.map(parseBlock(strategy.sides));
    var blocksMap = createMapUsingProperty(blocks, 'id');
    var connectors = config.connectors.map(parseConnector);
    var connectorsMap = createMapUsingProperty(connectors, 'id');

    var worldConstraints = instantiateWorldConstraintsFromConfiguration(config);

    // for each block set side connectors
    config.blocks.forEach(function setConnectors(blockDefinition) {
        var blockInstance = blocksMap[blockDefinition.id];
        var sideConnectors = objectMap(blockDefinition.connectors, function mapToConnector (connectorId) {
            return connectorsMap[connectorId];
        });

        forOwn(sideConnectors, function setSideConnector (connector, side) {
            blockInstance.setSideConnector(side, connector);
        });
    });

    return new World(strategy.createInstance(), worldConstraints, blocks);
}

module.exports = {
    parse: parse
};

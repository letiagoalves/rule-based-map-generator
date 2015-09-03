'use strict';

var forOwn = require('mout/object/forOwn');
var objectMap = require('mout/object/map');
var isString = require('mout/lang/isString');
var randomMatrix = require('random-matrix');

var api = require('./../api');
var utils = require('./../utils/utils.js');

/**
 * Parses a world configuration and returns a world instance
 * @param  {Object} config  World configuration
 * @return {World}  A world instance
 */
function parse(config) {
    var blockFactory;
    var blocks;
    var blocksMap;
    var connectors;
    var connectorsMap;
    var strategyFactory;
    var strategy;
    var randomMatrixGenerator;

    // TODO: validate JSON
    // TODO: assert seed before passing it ro randomMatrix
    if (typeof config !== 'object') {
        throw new Error('temp error: invalid config');
    }

    strategyFactory = api.getStrategyFactory(config.strategy);
    randomMatrixGenerator = randomMatrix(config.seed);
    strategy = strategyFactory.createInstance(randomMatrixGenerator);

    // create block
    blockFactory = api.createBlockFactory(strategyFactory.sidesTemplate);

    blocks = config.blocks.map(function mapToBlockInstance(block) {
        return blockFactory(block.id, block.classes, block.constraints);
    });

    blocksMap = utils.createMapUsingCallback(blocks, function resolveId(b) {
        return b.getId();
    });

    // create connectors
    connectors = config.connectors.map(function mapToConnectorInstance(connector) {
        return api.createConnectorInstance(connector.id, connector.type, connector.blockIds, connector.blockClasses);
    });

    connectorsMap = utils.createMapUsingCallback(connectors, function resolveId(c) {
        return c.getId();
    });

    // for each block set side connectors
    config.blocks.forEach(function setConnectors(blockDefinition) {
        var blockInstance = blocksMap[blockDefinition.id];
        var sideConnectors = objectMap(blockDefinition.connectors, function mapToConnector(connectorId) {
            return isString(connectorId) ? connectorsMap[connectorId] : null;
        });

        forOwn(sideConnectors, function setSideConnector(connector, side) {
            blockInstance.setSideConnector(side, connector);
        });
    });

    return api.createWorldInstance(strategy, config, blocks);
}

module.exports = {
    parse: parse
};

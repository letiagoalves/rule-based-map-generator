'use strict';

var Block = require('./../block');
var Connector = require('./../connector');
var World = require('./../world');
var WorldConstraints = require('./../world-constraints');
var strategies = require('./../strategies');
var Strategy = require('./../strategies/strategy.js');
var utils = require('./../utils/utils.js');

function getStrategyFactory(strategyName) {
    if (strategies.hasOwnProperty(strategyName)) {
        return strategies[strategyName];
    }
    throw new Error('Unknown strategy factory');
}

function createConnectorInstance(id, type, blockIds, blockClasses) {
    return new Connector(id, type, blockIds, blockClasses);
}

function createBlockFactory(strategy) {
    if (!utils.isInstanceOf(strategy, Strategy)) {
        throw new Error('strategy is mandatory and must be a valid strategy');
    }

    return function createBlockInstance (id, classes, constraints) {
        return new Block(strategy, id, classes, constraints);
    };
}

function createWorldConstraintsFromConfiguration (config) {
    var maxMapSize = config.maxMapSize || null;
    var mapCenter = config.mapCenter || null;
    return new WorldConstraints(config.initialMapSize, maxMapSize, mapCenter);
}

function createWorldInstance(strategy, constraints, blocks) {
    // TODO: assert strategy, constraints and blocks

    var worldConstraints = createWorldConstraintsFromConfiguration(constraints);

    return new World(strategy, worldConstraints, blocks);
}

module.exports = {
    getStrategyFactory: getStrategyFactory,
    createBlockFactory: createBlockFactory,
    createConnectorInstance: createConnectorInstance,
    createWorldInstance: createWorldInstance
};

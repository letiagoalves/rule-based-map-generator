'use strict';

var Block = require('./../block');
var Connector = require('./../connector');
var World = require('./../world');
var WorldConstraints = require('./../world-constraints');
var strategies = require('./../strategies');

function getStrategyFactory(strategyName) {
    if (strategies.hasOwnProperty(strategyName)) {
        return strategies[strategyName];
    }
    throw new Error('Unknown strategy factory');
}

function createConnectorInstance(id, type, blockIds, blockClasses) {
    return new Connector(id, type, blockIds, blockClasses);
}

function createBlockFactory(sidesTemplate) {
    return function createBlockInstance (id, classes, constraints) {
        return new Block(id, sidesTemplate, classes, constraints);
    };
}

function createWorldConstraintsFromConfiguration (config) {
    var maxMapSize = config.maxMapSize || null;
    var mapCenter = config.mapCenter || null;
    return new WorldConstraints(config.initialMapSize, maxMapSize, mapCenter);
}

function createWorldInstance(strategy, constraints, blocks) {
    var worldConstraints = createWorldConstraintsFromConfiguration(constraints);

    return new World(strategy, worldConstraints, blocks);
}

module.exports = {
    getStrategyFactory: getStrategyFactory,
    createBlockFactory: createBlockFactory,
    createConnectorInstance: createConnectorInstance,
    createWorldInstance: createWorldInstance
};

'use strict';

var randomMatrix = require('random-matrix');
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

function createWorldInstance(strategy, constraints, blocks) {
    var areAllBlockInstances;

    if (!utils.isInstanceOf(strategy, Strategy)) {
        throw new Error('strategy is mandatory and must be a valid strategy');
    }

    if (!utils.isInstanceOf(constraints, WorldConstraints)) {
        throw new Error('constraints is mandatory and must be a valid WorldConstraints instance');
    }

    // blocks validation
    if (!Array.isArray(blocks) || blocks.length === 0) {
        throw new Error('blocks is mandatory and must be a non-empty array');
    }

    areAllBlockInstances = blocks.every(function isBlockInstance(item) {
        return utils.isInstanceOf(item, Block);
    });

    if (!areAllBlockInstances) {
        throw new Error('blocks must only contain Block instances');
    }

    return new World(strategy, constraints, blocks);
}

function createStrategy(strategyName, seed) {
    // TODO: validate arguments
    var strategyFactory = getStrategyFactory(strategyName);
    var randomMatrixGenerator = randomMatrix(seed);
    var strategyInstance = strategyFactory.createInstance(randomMatrixGenerator);
    return new Strategy(strategyInstance);
}

function createWorldConstraints(initialMapSize, bounds, mapCenter) {
    return new WorldConstraints(initialMapSize, bounds, mapCenter);
}

module.exports = {
    createStrategy: createStrategy,
    createBlockFactory: createBlockFactory,
    createConnectorInstance: createConnectorInstance,
    createWorldInstance: createWorldInstance,
    createWorldConstraints: createWorldConstraints
};

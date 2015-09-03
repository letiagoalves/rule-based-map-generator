'use strict';

var Block = require('./../block');
var Connector = require('./../connector');
var World = require('./../world');
//var WorldConstraints = require('./../world/world-constraints.js');
var strategies = require('./../strategies/index.js');

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

/*
function instantiateWorldConstraintsFromConfiguration (config) {
    return new WorldConstraints(config.initialMapSize, {
        maxMapSize: config.maxMapSize,
        initialBlock: config.initialBlock
    });
}*/

/**
 * @function createWorld
 * @param  {[type]} strategy [description]
 * @return {[type]}          [description]
 */
// TODO: change constraitns to worldConstraints
function createWorldInstance(strategy, constraints, blocks) {
    // TODO:
    //var worldConstraints = instantiateWorldConstraintsFromConfiguration(constraints);

    return new World(strategy, constraints, blocks);
}

module.exports = {
    getStrategyFactory: getStrategyFactory,
    createBlockFactory: createBlockFactory,
    createConnectorInstance: createConnectorInstance,
    createWorldInstance: createWorldInstance
};

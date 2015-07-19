'use strict';

var randomMatrix = require('random-matrix');

var Block = require('./../block');
var Connector = require('./../connector');
var World = require('./../world');
//var WorldConstraints = require('./../world/world-constraints.js');


function getStrategyFactory(numberOfSides) {
    switch (numberOfSides) {
        case 4:
            return require('./../strategies/four-sides');
        default:
            throw new Error('Unknown strategy');
    }
}

function createConnectorInstance(id, type, blockIds, blockClasses) {
    return new Connector(id, type, blockIds, blockClasses);
}

function createBlockFactory(numberOfSides) {
    var strategy = getStrategyFactory(numberOfSides);
    var sidesTemplate = strategy.sides;

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
function createWorldInstance(numberOfSides, constraints, blocks) {
    // TODO: assert seed
    var strategyFactory = getStrategyFactory(numberOfSides);
    var randomMatrixGenerator = randomMatrix(constraints.seed);
    var strategy = strategyFactory.createInstance(randomMatrixGenerator);
    // TODO:
    //var worldConstraints = instantiateWorldConstraintsFromConfiguration(constraints);

    return new World(strategy, constraints, blocks);
}

module.exports = {
    createBlockFactory: createBlockFactory,
    createConnectorInstance: createConnectorInstance,
    createWorldInstance: createWorldInstance
};

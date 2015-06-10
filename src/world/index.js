'use strict';

var validator = require('./../validator');
var schema = require('./schema');

function World(strategy, constraints, blocks) {
    // TODO: assert strategy
    blocks = validator.assert(blocks, schema.blocks, 'World.blocks');

    this.blocks = blocks;
    this.constraints = constraints;
    //this.connectors = {}; // do I really need this? they can be referenced in block sides
    this.strategy = strategy;
}

World.prototype.start = function () {
    this.strategy.init(this.constraints, this.blocks);
};

World.prototype.getPartialMap = function (minX, minY, maxX, maxY) {
    //TODO: assertions
    return this.strategy.getPartialMap(minX, minY, maxX, maxY);
};

World.prototype.getMap = function () {
    return this.strategy.getMap();
};

World.prototype.invalidate = function () {};

module.exports = World;

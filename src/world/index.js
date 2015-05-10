'use strict';

var validator = require('./../validator');
var schema = require('./schema');

function World(strategy, blocks, constraints) {
    // TODO: assert strategy
    blocks = validator.assert(blocks, schema.blocks, 'World.blocks');

    this.blocks = blocks;
    this.constraints = constraints;
    //this.connectors = {}; // do I really need this? they can be referenced in block sides
}

World.prototype.start = function () {};

World.prototype.get = function (x, y, size) {
    this.strategy.get(x, y, size);
};

World.prototype.getAll = function () {};

World.prototype.invalidate = function () {};


module.exports = World;

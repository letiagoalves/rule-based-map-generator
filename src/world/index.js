'use strict';

var validator = require('./../validator');
var schema = require('./schema');

function World(strategy, constraints, blocks) {
    // TODO: assert strategy
    // TODO. assert constraints
    blocks = validator.assert(blocks, schema.blocks, 'World.blocks');

    function start() {
        return strategy.init(constraints, blocks);
    }

    function getPartialMap(minX, minY, maxX, maxY) {
        //TODO: assertions
        return strategy.getPartialMap(minX, minY, maxX, maxY);
    }

    function getMap() {
        return strategy.getMap();
    }

    function invalidate() {}

    // public
    this.start = start;
    this.getPartialMap = getPartialMap;
    this.getMap = getMap;
    this.invalidate = invalidate;
}

module.exports = World;

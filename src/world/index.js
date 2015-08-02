'use strict';

var validator = require('./../validator');
var schema = require('./schema');

function World(strategy, constraints, blocks) {
    var started = false;

    // TODO: assert strategy
    // TODO. assert constraints
    blocks = validator.assert(blocks, schema.blocks, 'World.blocks');

    function start() {
        if (started) {
            // TODO:
            throw new Error('temp, already started');
        }
        started = true;
        return strategy.init(constraints, blocks);
    }

    function getPartialMap(minX, minY, maxX, maxY) {
        if (!started) {
            // TODO:
            throw new Error('temp');
        }
        //TODO: assertions
        return strategy.getPartialMap(minX, minY, maxX, maxY);
    }

    function getMap() {
        if (!started) {
            // TODO:
            throw new Error('temp');
        }
        return strategy.getMap();
    }

    function invalidate() {
        if (!started) {
            // TODO:
            throw new Error('temp');
        }
    }

    function hasStarted() {
        return started;
    }

    // public
    this.start = start;
    this.hasStarted = hasStarted;
    this.getPartialMap = getPartialMap;
    this.getMap = getMap;
    this.invalidate = invalidate;
}

module.exports = World;

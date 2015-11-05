'use strict';

var Joi = require('joi');

var validator = require('./../validator');
var schema = require('./schema');
var CONSTANTS = require('./../constants.json');

function World(strategy, constraints, blocks) {
    var started = false;

    strategy = validator.assert(strategy, schema.strategy, 'World.strategy');
    constraints = validator.assert(constraints, schema.constraints, 'World.constraints');
    blocks = validator.assert(blocks, schema.blocks, 'World.blocks');

    function start() {
        if (started) {
            throw new Error(CONSTANTS.errorMessages.worldAlreadyStarted);
        }
        started = true;
        return strategy.init(constraints, blocks);
    }

    function getPartialMap(minX, minY, maxX, maxY) {
        var coordinateSchema = Joi.number().integer().required();

        validator.assert(minX, coordinateSchema, 'minX');
        validator.assert(minY, coordinateSchema, 'minY');
        validator.assert(maxX, coordinateSchema, 'maxX');
        validator.assert(maxY, coordinateSchema, 'maxY');

        if (!started) {
            throw new Error(CONSTANTS.errorMessages.worldNotStarted);
        }

        return strategy.getPartialMap(minX, minY, maxX, maxY);
    }

    function getMap() {
        if (!started) {
            throw new Error(CONSTANTS.errorMessages.worldNotStarted);
        }
        return strategy.getMap();
    }

    function hasStarted() {
        return started;
    }

    // public
    this.start = start;
    this.hasStarted = hasStarted;
    this.getPartialMap = getPartialMap;
    this.getMap = getMap;
}

module.exports = World;

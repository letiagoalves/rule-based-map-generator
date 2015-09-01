'use strict';

var validator = require('./../validator');
var schema = require('./schema');
var deepClone = require('mout/lang/deepClone');

function WorldConstraints(bounds, initialBlock, initialMapSize) {
    // schema assertions
    bounds = validator.assert(bounds, schema.bounds, 'bounds');

    function getBounds() {
        return deepClone(bounds);
    }

    // public
    this.getBounds = getBounds;
}

module.exports = WorldConstraints;

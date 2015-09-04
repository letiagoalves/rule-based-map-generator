'use strict';

var validator = require('./../validator');
var schema = require('./schema');
var deepClone = require('mout/lang/deepClone');

function WorldConstraints(initialMapSize, bounds, mapCenter) {
    initialMapSize = validator.assert(initialMapSize, schema.initialMapSize, 'WorldConstraints.initialMapSize');
    bounds = validator.assert(bounds, schema.bounds, 'WorldConstraints.bounds');
    mapCenter = validator.assert(mapCenter, schema.mapCenter, 'WorldConstraints.mapCenter');

    function getInitialMapSize() {
        return initialMapSize;
    }

    function getBounds() {
        return deepClone(bounds);
    }

    function getMapCenter() {
        return mapCenter;
    }

    // public
    this.getInitialMapSize = getInitialMapSize;
    this.getBounds = getBounds;
    this.getMapCenter = getMapCenter;
}

module.exports = WorldConstraints;

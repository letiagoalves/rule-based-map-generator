'use strict';

function WorldConstraints(bounds, initialBlock, initialMapSize) {
    // TODO: validate
    this.bounds = bounds;
    this.initialBlock = initialBlock;
    this.initialMapSize = initialMapSize;
}

module.exports = WorldConstraints;

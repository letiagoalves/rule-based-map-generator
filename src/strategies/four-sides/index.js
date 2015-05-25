'use strict';

var Strategy = require('./../strategy.js');
var MapManager = require('./map-manager.js');

var name = 'Four sides block strategy';
var sides = ['UP', 'RIGHT', 'BOTTOM', 'LEFT'];

function init (worldConstraints, blocks) {
    var that = this;
    var initialBlock;

    that.mapManager = new MapManager(worldConstraints.initialMapSize);
    that.blocksMap = {};
    blocks.forEach(function mapBlock (block) {
        that.blocksMap[block.id] = block;
    });

    if(worldConstraints.initialBlock) {
        console.info('initialBlock', worldConstraints.initialBlock);
        initialBlock = that.blocksMap[worldConstraints.initialBlock];
        if(!initialBlock) {
            throw new Error('Initial block is invalid');
        }
        that.mapManager.set(0, 0, initialBlock);
    }

    that.mapManager.log(-1, -1, 1, 1);
}


function createInstance () {
    this.mapManager = null;
    this.blocksMap;

    return {
        init: init
    };
}



module.exports = {
    name: name,
    sides: sides,
    createInstance: createInstance
};

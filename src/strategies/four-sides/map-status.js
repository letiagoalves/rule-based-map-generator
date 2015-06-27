'use strict';

var objectReduce = require('mout/object/reduce');

function sum(a, b) {
    return a + b;
}

function MapStatus() {
    var blocksCount = {};

    function addBlock(blockId) {
        // TODO: assert is string
        if (typeof blockId !== 'string') {
            console.error('blockId', blockId);
            throw new Error('temp error _ not a string');
        }
        blocksCount[blockId] = blocksCount[blockId] || 0;

        blocksCount[blockId]++;
    }

    function removeBlock(blockId) {
        if (!blocksCount[blockId]) {
            throw new Error('trying to remove unexisting block');
        }

        blocksCount[blockId]--;
    }

    function getNumberOfTotalBlocks() {
        return objectReduce(blocksCount, sum);
    }

    function getBlockOccupation(blockId) {
        return blocksCount[blockId] || 0;
    }

    function getBlockOccupationPercentage(blockId) {
        var occupation = getBlockOccupation(blockId);
        // TODO: maybe replace with map size?!
        var total = getNumberOfTotalBlocks();

        return total > 0 ? (occupation / total) * 100 : 0;
    }

    // public
    this.addBlock = addBlock;
    this.removeBlock = removeBlock;
    this.getBlockOccupation = getBlockOccupation;
    this.getBlockOccupationPercentage = getBlockOccupationPercentage;
    this.getNumberOfTotalBlocks = getNumberOfTotalBlocks;
}

module.exports = MapStatus;

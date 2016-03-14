'use strict';

var objectReduce = require('mout/object/reduce');
var isString = require('mout/lang/isString');

function sum(a, b) {
    return a + b;
}

function MapStatus() {
    var blocksCount = {};
    var voidCount = 0;

    function addBlock(blockId) {
        if (!isString(blockId) || blockId.length === 0) {
            throw new Error('blockId is mandatory and must be a non-empty {String}');
        }

        blocksCount[blockId] = blocksCount[blockId] || 0; // initialize counter if not already initialized
        blocksCount[blockId]++;
    }

    function addVoid() {
        voidCount++;
    }

    function removeBlock(blockId) {
        if (!blocksCount.hasOwnProperty(blockId)) {
            throw new Error('Cannot remove unexisting block');
        }

        blocksCount[blockId] = Math.max(0, blocksCount[blockId] - 1);
    }

    function removeVoid() {
        voidCount = Math.max(0, voidCount - 1);
    }

    function getNumberOfTotalBlocks() {
        return objectReduce(blocksCount, sum, 0) + voidCount;
    }

    function getBlockOccupation(blockId) {
        return blocksCount[blockId] || 0;
    }

    function getBlockOccupationPercentage(blockId) {
        var occupation = getBlockOccupation(blockId);
        var total = getNumberOfTotalBlocks();

        return total > 0 ? (occupation / total) * 100 : 0;
    }

    // public
    this.addBlock = addBlock;
    this.removeBlock = removeBlock;
    this.addVoid = addVoid;
    this.removeVoid = removeVoid;
    this.getBlockOccupation = getBlockOccupation;
    this.getBlockOccupationPercentage = getBlockOccupationPercentage;
    this.getNumberOfTotalBlocks = getNumberOfTotalBlocks;
}

module.exports = MapStatus;

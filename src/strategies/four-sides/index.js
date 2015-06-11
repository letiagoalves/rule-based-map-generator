'use strict';

var MapManager = require('./map-manager.js');
var mapGenerator = require('./map-generator.js');
var quadrantsHelper = require('./quadrants-helper.js');
var Block = require('./../../block');

var name = 'Four sides block strategy';
var sides = ['UP', 'RIGHT', 'BOTTOM', 'LEFT'];

function createInstance() {

    var instanceProps = {
        mapManager: null,
        blocksMap: null,
        worldConstraints: null
    };

    function init(worldConstraints, blocks) {
        var initialBlock;

        instanceProps.mapManager = new MapManager(worldConstraints.initialMapSize);
        instanceProps.worldConstraints = worldConstraints;
        instanceProps.blocksMap = {};
        blocks.forEach(function mapBlock(block) {
            instanceProps.blocksMap[block.id] = block;
        });

        if (worldConstraints.initialBlock) {
            initialBlock = instanceProps.blocksMap[worldConstraints.initialBlock];
            if (!initialBlock) {
                throw new Error('Initial block is invalid');
            }
            instanceProps.mapManager.set(0, 0, initialBlock);
        }
    }

    function isAllMatrixFilledWithBlocks(matrix) {
        return matrix.every(function forEachRow(row) {
            return row.every(function isBlockInstance(value) {
                return value instanceof Block;
            });
        });
    }

    function getAtPosition (x, y) {
        return instanceProps.mapManager.get(x, y);
    }

    function isPositionFilled(x, y) {
        return getAtPosition(x, y) instanceof Block;
    }


    function buildNeighbours(x, y) {
        function resolve(posX, posY) {
            var block = instanceProps.mapManager.get(posX, posY);
            return block instanceof Block ? block.id : null;
        }

        return {
            UP: resolve(x, y + 1),
            RIGHT: resolve(x + 1, y),
            BOTTOM: resolve(x, y - 1),
            LEFT: resolve(x - 1, y - 1)
        };
    }

    function generateAtPosition(x, y) {
        var neighbours = buildNeighbours(x, y);
        var blockId = mapGenerator.selectBlock(neighbours, instanceProps.blocksMap);
        var block = blockId && instanceProps.blocksMap[blockId];
        console.log('generateAtPosition', x, y, blockId);
        instanceProps.mapManager.set(x, y, block);
    }

    function generateInQ1(bounds) {
        var x, y;
        var posX, posY;

        console.log('generateInQ1', bounds);

        for (x = bounds.minX; x <= bounds.maxX; x++) {
            posX = x;
            posY = bounds.minY;
            if (!isPositionFilled(posX, posY)) {
                generateAtPosition(posX, posY);
            }
        }

        // plus 1 because first block was filled by horizontal loop
        for (y = bounds.minY + 1; y <= bounds.maxY; y++) {
            posX = bounds.minX;
            posY = y;
            if (!isPositionFilled(posX, posY)) {
                generateAtPosition(posX, posY);
            }
        }

        // end of generation
        if (bounds.minX === bounds.maxX && bounds.minY === bounds.maxY) {
            return;
        }

        // continue generation
        generateInQ1({
            minX: Math.min(bounds.minX + 1, bounds.maxX),
            minY: Math.min(bounds.minX + 1, bounds.maxX),
            maxX: bounds.maxX,
            maxY: bounds.maxY
        });
    }

    function generate(minX, minY, maxX, maxY) {
        // at Q1
        console.log('generate', minX, minY, maxX, maxY);
        if (quadrantsHelper.isQ1(minX, minY) || quadrantsHelper.isQ1(maxX, maxY)) {
            console.log('isQ1');
            generateInQ1(quadrantsHelper.getQ1PartOfMap(minX, minY, maxX, maxY));
        }
        // TODO: rest of quadrants
    }

    function getPartialMap(minX, minY, maxX, maxY) {
        // TODO: check if inside map boounds
        var partialMap = instanceProps.mapManager.getPartialMap(minX, minY, maxX, maxY);
        var isAllFilled = isAllMatrixFilledWithBlocks(partialMap);

        console.log('isAllFilled', isAllFilled);
        if (!isAllFilled) {
            generate(minX, minY, maxX, maxY);
            partialMap = instanceProps.mapManager.getPartialMap(minX, minY, maxX, maxY);
        }

        return partialMap;
    }

    function getMap() {
        return instanceProps.mapManager.getMap();
    }

    // public
    return {
        init: init,
        getAtPosition: getAtPosition,
        getPartialMap: getPartialMap,
        getMap: getMap
    };
}


module.exports = {
    name: name,
    sides: sides,
    createInstance: createInstance
};

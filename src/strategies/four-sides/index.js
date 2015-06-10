'use strict';

var MapManager = require('./map-manager.js');
var mapGenerator = require('./map-generator.js');
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
                console.info('value', value, value instanceof Block);
                return value instanceof Block;
            });
        });
    }

    function getAtPosition() {

    }

    function buildNeighbours(x, y) {
        function resolve (posX, posY) {
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

    function getPartialMap(minX, minY, maxX, maxY) {
        var partialMap = instanceProps.mapManager.getPartialMap(minX, minY, maxX, maxY);
        var isAllFilled = isAllMatrixFilledWithBlocks(partialMap);
        var neighbours;

        console.log('isAllFilled', isAllFilled);
        if (!isAllFilled) {
            // generate missing map
            //
            neighbours = buildNeighbours(-1, 0);
            mapGenerator.selectBlock(neighbours, instanceProps.blocksMap);
        }

        return partialMap;
    }

    function getMap() {
        return instanceProps.mapManager.getMap();
    }

    /**
    function generate(minX, minY, maxX, maxY) {

    }*/

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

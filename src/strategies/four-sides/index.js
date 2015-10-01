'use strict';

var chalk = require('chalk');
var deepClone = require('mout/lang/deepClone');

var MapManager = require('./map-manager.js');
var MapStatus = require('./map-status.js');
var mapGenerator = require('./map-generator.js');
var quadrantsHelper = require('./quadrants-helper.js');
var Block = require('./../../block');
var utils = require('./../../utils/utils.js');

var sidesTemplate = ['UP', 'RIGHT', 'BOTTOM', 'LEFT'];

function adaptMapMatrix(matrix, minX, maxY) {
    var y = maxY + 1;
    return matrix.map(function mapRow(row) {
        var x = minX - 1;
        y--;
        return row.map(function mapColumn(value) {
            x++;
            return {
                x: x,
                y: y,
                block: value && value.getId()
            };
        });
    });
}

function createInstance(randomMatrixGenerator) {

    // TODO: destruct this
    // TODO: pass blocksMap to mapStatus
    var instanceProps = {
        mapManager: null,
        mapStatus: null,
        blocksMap: null,
        worldConstraints: null
    };

    function isAllMatrixFilledWithBlocks(matrix) {
        return matrix.every(function forEachRow(row) {
            return row.every(function isBlockInstance(value) {
                return value instanceof Block || value === null;
            });
        });
    }

    function getAtPosition(x, y) {
        return instanceProps.mapManager.get(x, y);
    }

    function isPositionFilled(x, y) {
        var elem = getAtPosition(x, y);
        return elem === null || elem instanceof Block;
    }


    function buildNeighbours(x, y) {
        function resolve(posX, posY) {
            var block = instanceProps.mapManager.get(posX, posY);
            return block instanceof Block ? block.getId() : null;
        }

        return {
            UP: resolve(x, y + 1),
            RIGHT: resolve(x + 1, y),
            BOTTOM: resolve(x, y - 1),
            LEFT: resolve(x - 1, y)
        };
    }

    function generateAtPosition(x, y) {
        var neighbours = buildNeighbours(x, y);
        var randomValueForPosition = randomMatrixGenerator.rand(x, y);
        var mapBounds = instanceProps.mapManager.getBounds();
        var blockId = mapGenerator.selectBlock(
            neighbours,
            instanceProps.blocksMap,
            instanceProps.mapStatus,
            { x: x, y: y },
            instanceProps.mapManager.getPartialMap,
            mapBounds,
            randomValueForPosition
        );
        var block = blockId && instanceProps.blocksMap[blockId];
        console.log(chalk.red('generateAtPosition (%s, %s) - %s'), x, y, blockId);

        // TODO: unit test this
        // make sure we expand the map to the position we will set the block
        instanceProps.mapManager.expandToPosition(x, y);
        instanceProps.mapManager.set(x, y, block);

        if (blockId !== null) {
            instanceProps.mapStatus.addBlock(blockId);
        }
    }

    function generateRow(fromX, toX, posY) {
        var i, j, increment;
        var posX;

        // TODO: avoid this
        /*
        if (fromX === toX) {
            throw new Error('fromX === toX');
        }*/

        i = 0;
        j = Math.abs(fromX - toX);
        increment = fromX < toX ? 1 : -1;

        for (i = 0; i <= j; i++) {
            posX = fromX + i * increment;
            if (!isPositionFilled(posX, posY)) {
                // TODO: check if it is not repeating positions unnecessary
                generateAtPosition(posX, posY);
            }
        }
    }

    function generateColumn(fromY, toY, posX) {
        var i, j, increment;
        var posY;

        i = 0;
        j = Math.abs(fromY - toY);
        increment = fromY < toY ? 1 : -1;

        for (i = 0; i <= j; i++) {
            posY = fromY + i * increment;
            if (!isPositionFilled(posX, posY)) {
                generateAtPosition(posX, posY);
            }
        }
    }

    function generateInQ1(bounds) {
        console.log(chalk.green('generateInQ1'), bounds);
        if (bounds.minX <= bounds.maxX) {
            generateRow(bounds.minX, bounds.maxX, bounds.minY);
        }

        // plus 1 because first block was filled by horizontal loop
        if (bounds.minY + 1 <= bounds.maxY) {
            generateColumn(bounds.minY + 1, bounds.maxY, bounds.minX);
        }

        // end of generation
        if (bounds.minX === bounds.maxX && bounds.minY === bounds.maxY) {
            return;
        }

        // continue generation
        generateInQ1({
            minX: Math.min(bounds.minX + 1, bounds.maxX), // because width and heigh are not always the same // TODO: test that particular case
            minY: Math.min(bounds.minY + 1, bounds.maxY), // because width and heigh are not always the same
            maxX: bounds.maxX,
            maxY: bounds.maxY
        });
    }

    // TODO: create bounds assertion
    function generateInQ2(bounds) {
        console.log(chalk.green('generateInQ2'), bounds);
        if (bounds.minX <= bounds.maxX) {
            generateRow(bounds.maxX, bounds.minX, bounds.minY);
        }

        // plus 1 because first block was filled by horizontal loop
        if (bounds.minY + 1 <= bounds.maxY) {
            generateColumn(bounds.minY + 1, bounds.maxY, bounds.maxX);
        }

        // end of generation
        if (bounds.minX === bounds.maxX && bounds.minY === bounds.maxY) {
            return;
        }

        // continue generation
        generateInQ2({
            minX: bounds.minX,
            minY: Math.min(bounds.minY + 1, bounds.maxY),
            maxX: Math.max(bounds.maxX - 1, bounds.minX), // because width and heigh are not always the same
            maxY: bounds.maxY // because width and heigh are not always the same
        });
    }

    // TODO: create bounds assertion
    function generateInQ3(bounds) {
        console.log(chalk.green('generateInQ3'), bounds);
        if (bounds.minX <= bounds.maxX) {
            generateRow(bounds.maxX, bounds.minX, bounds.maxY);
        }

        // minus 1 because first block was filled by horizontal loop
        if (bounds.maxY - 1 >= bounds.minY) {
            generateColumn(bounds.maxY - 1, bounds.minY, bounds.maxX);
        }

        // end of generation
        if (bounds.minX === bounds.maxX && bounds.minY === bounds.maxY) {
            return;
        }

        // TODO: this is repeating positions. check
        // continue generation
        generateInQ3({
            minX: bounds.minX,
            minY: bounds.minY,
            maxX: Math.max(bounds.maxX - 1, bounds.minX),
            maxY: Math.max(bounds.maxY - 1, bounds.minY)
        });
    }

    // TODO: create bounds assertion
    function generateInQ4(bounds) {
        console.log(chalk.green('generateInQ4'), bounds);
        if (bounds.minX <= bounds.maxX) {
            generateRow(bounds.minX, bounds.maxX, bounds.maxY);
        }

        // minus 1 because first block was filled by horizontal loop
        if (bounds.maxY - 1 >= bounds.minY) {
            generateColumn(bounds.maxY - 1, bounds.minY, bounds.minX);
        }

        // end of generation
        if (bounds.minX === bounds.maxX && bounds.minY === bounds.maxY) {
            return;
        }

        // TODO: this is repeating positions. check
        // continue generation
        generateInQ4({
            minX: Math.min(bounds.minX + 1, bounds.maxX),
            minY: bounds.minY,
            maxX: bounds.maxX,
            maxY: Math.max(bounds.maxY - 1, bounds.minY)
        });
    }

    function generate(minX, minY, maxX, maxY) {
        console.log('generate', minX, minY, maxX, maxY);
        // generate by quadrants

        if (quadrantsHelper.isQ1(maxX, maxY)) {
            generateInQ1(quadrantsHelper.getQ1PartOfMap(minX, minY, maxX, maxY));
        }

        if (quadrantsHelper.isQ2(minX, maxY)) {
            generateInQ2(quadrantsHelper.getQ2PartOfMap(minX, minY, maxX, maxY));
        }

        if (quadrantsHelper.isQ3(minX, minY)) {
            generateInQ3(quadrantsHelper.getQ3PartOfMap(minX, minY, maxX, maxY));
        }

        if (quadrantsHelper.isQ4(maxX, minY)) {
            generateInQ4(quadrantsHelper.getQ4PartOfMap(minX, minY, maxX, maxY));
        }
    }

    function getPartialMap(minX, minY, maxX, maxY) {
        var partialMap;
        var isAllFilled;

        if (!instanceProps.mapManager.isInsideMapBounds(minX, minY, maxX, maxY)) {
            throw new Error('Request map is outside map bounds');
        }

        partialMap = instanceProps.mapManager.getPartialMap(minX, minY, maxX, maxY);
        isAllFilled = isAllMatrixFilledWithBlocks(partialMap);

        if (!isAllFilled) {
            generate(minX, minY, maxX, maxY);
            partialMap = instanceProps.mapManager.getPartialMap(minX, minY, maxX, maxY);
        }

        return adaptMapMatrix(partialMap, minX, maxY);
    }

    // do not use getPartialMap neither getMapBounds
    function getMap() {
        var map = instanceProps.mapManager.getMap();
        var mapBounds = instanceProps.mapManager.getWrappedBounds();
        return adaptMapMatrix(map, mapBounds.minX, mapBounds.maxY);
    }

    function init(worldConstraints, blocks) {
        var initialMapSize = worldConstraints.getInitialMapSize();
        var bounds = worldConstraints.getBounds();
        var mapCenter = worldConstraints.getMapCenter();
        var mapCenterBlock;
        var initialBounds;

        instanceProps.mapManager = new MapManager(initialMapSize, bounds);
        instanceProps.mapStatus = new MapStatus();
        instanceProps.worldConstraints = worldConstraints;
        instanceProps.blocksMap = utils.createMapUsingCallback(blocks, function resolveId(b) {
            return b.getId();
        });

        if (mapCenter) {
            mapCenterBlock = instanceProps.blocksMap[mapCenter];
            if (!mapCenterBlock) {
                throw new Error('Invalid mapCenter');
            }
            instanceProps.mapManager.set(0, 0, mapCenterBlock);
            instanceProps.mapStatus.addBlock(mapCenterBlock.getId());
        }

        // generate initial map
        initialBounds = instanceProps.mapManager.getWrappedBounds();
        generate(initialBounds.minX, initialBounds.minY, initialBounds.maxX, initialBounds.maxY);
    }

    function getSidesTemplate() {
        return deepClone(sidesTemplate);
    }

    // public
    return {
        getSidesTemplate: getSidesTemplate,
        init: init,
        getAtPosition: getAtPosition,
        getPartialMap: getPartialMap,
        getMap: getMap
    };
}

module.exports = {
    createInstance: createInstance
};

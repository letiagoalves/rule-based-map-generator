'use strict';

var objectEvery = require('mout/object/every');
var objectForOwn = require('mout/object/forOwn');
var deepClone = require('mout/lang/deepClone');

function mergeDistances(distances) {
    var merged = deepClone(distances);

    objectForOwn(distances, function (minimumDistances, topLevelBlockId) {
        objectForOwn(minimumDistances, function (minimumDistance, bottomLevelBlockId) {
            var currentDistance;

            // initialize if it does not exist
            merged[bottomLevelBlockId] = merged[bottomLevelBlockId] || {};

            // fallback to -1 if does not exist in order to use Math.max
            currentDistance = merged[bottomLevelBlockId][topLevelBlockId] || -1;

            merged[bottomLevelBlockId][topLevelBlockId] = Math.max(currentDistance, minimumDistance);
        });
    });

    return merged;
}

function getMapAroundPosition(position, getPartialMapFn, distance) {
    var minX = position.x - distance;
    var minY = position.y - distance;
    var maxX = position.x + distance;
    var maxY = position.y + distance;

    return getPartialMapFn(minX, minY, maxX, maxY);
}

function mapContainsBlockId(map, blockId) {
    return map.some(function forEachRow(row) {
        return row.some(function isGivenBlock(item) {
            if (item) {
                return item.getId() === blockId;
            }
            return false;
        });
    });
}

function passEveryDistance(blockDistances, position, getPartialMapFn) {
    return objectEvery(blockDistances, function passDistance(otherBlockDistance, otherBlockId) {
        var map = getMapAroundPosition(position, getPartialMapFn, otherBlockDistance);
        return !mapContainsBlockId(map, otherBlockId);
    });
}

function applyMinimumDistance(candidates, distances, position, getPartialMapFn) {
    distances = mergeDistances(distances);

    return candidates.filter(function respectsMinimumDistances(blockId) {
        var blockDistances;

        if (!distances.hasOwnProperty(blockId)) {
            return true;
        }

        blockDistances = distances[blockId];
        return passEveryDistance(blockDistances, position, getPartialMapFn);
    });
}

module.exports = applyMinimumDistance;

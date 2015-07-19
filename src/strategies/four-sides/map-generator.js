'use strict';

var objectMap = require('mout/object/map');
var objectFilter = require('mout/object/filter');
var isString = require('mout/lang/isString');

// rules
var applyBlackAndWhiteLists = require('./rules/blacklist.js');
var applyMaxOccupation = require('./rules/max-occupation.js');
var applyMaxOccupationPercentage = require('./rules/max-occupation-percentage.js');
var applyMinimumDistance = require('./rules/minimum-distance.js');

var sidesRelation = {
    UP: 'BOTTOM',
    BOTTOM: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT'
};

function isGreaterThanZero(value) {
    return value > 0;
}

function isNotNull(value) {
    return value !== null;
}

function useBlackAndWhiteListsRule(candidates, neighbours, blocksMap) {
    var neighbourConnectors = objectMap(neighbours, function mapNeighbour(neighbourId, side) {
        var connectorLookUpSide;
        var neighbourBlockSides;

        if (!isString(neighbourId)) {
            return null;
        }

        connectorLookUpSide = sidesRelation[side];
        neighbourBlockSides = blocksMap[neighbourId].getSides();
        return neighbourBlockSides[connectorLookUpSide];
    });

    return applyBlackAndWhiteLists(candidates, neighbourConnectors);
}

function useMaxOccupationRule(candidates, blocksMap, mapStatus) {
    var blocksMaxOccupation = objectMap(blocksMap, function extractMaxOccupation(block) {
        return block.getMaxOccupation();
    });

    // remove blocks that does not have maxOccupation
    blocksMaxOccupation = objectFilter(blocksMaxOccupation, isGreaterThanZero);

    return applyMaxOccupation(candidates, blocksMaxOccupation, mapStatus);
}

function useMaxOccupationPercentageRule(candidates, blocksMap, mapStatus) {
    var blocksMaxOccupationPercentage = objectMap(blocksMap, function extractMaxOccupationPercentage(block) {
        return block.getMaxOccupationPercentage();
    });

    // remove blocks that does not have maxOccupation
    blocksMaxOccupationPercentage = objectFilter(blocksMaxOccupationPercentage, isGreaterThanZero);

    return applyMaxOccupationPercentage(candidates, blocksMaxOccupationPercentage, mapStatus);
}

function useMinimumDistanceRule(candidates, blocksMap, position, getPartialMapFn) {
    var minimumDistancesByBlockId = objectMap(blocksMap, function extractContraint(block) {
        return block.getMinimumDistancesToOtherBlocks();
    });

    // remove null values
    minimumDistancesByBlockId = objectFilter(minimumDistancesByBlockId, isNotNull);

    console.log('minimunDistance', minimumDistancesByBlockId);

    return applyMinimumDistance(candidates, minimumDistancesByBlockId, position, getPartialMapFn);
}

function selectBlock(neighbours, blocksMap, mapStatus, position, getPartialMapFn, randomValue) {
    // TODO: assert arguments
    // randomValue between 0 and 1
    var randomItemPosition;
    var candidates = Object.keys(blocksMap);

    console.log('candidates before', candidates);
    // TODO: create a method to transverse all rules and stop when no candidates are left
    candidates = useBlackAndWhiteListsRule(candidates, neighbours, blocksMap);
    //console.log('candidates after blacklist', candidates);
    candidates = useMaxOccupationRule(candidates, blocksMap, mapStatus);
    //console.log('candidates after max occupation', candidates);
    candidates = useMaxOccupationPercentageRule(candidates, blocksMap, mapStatus);
    //console.log('candidates after minimun distance', candidates);
    candidates = useMinimumDistanceRule(candidates, blocksMap, position, getPartialMapFn);
    console.log('candidates after max occupation percentage', candidates);

    if (candidates.length === 1) {
        return candidates[0];
    }

    if (candidates.length > 1) {
        randomItemPosition = Math.floor(randomValue * candidates.length);
        // because if randomValue === 1, array position will be outside bounds
        randomItemPosition = Math.min(randomItemPosition, candidates.length - 1);

        return candidates[randomItemPosition];
    }

    return null;
}

module.exports = {
    selectBlock: selectBlock
};

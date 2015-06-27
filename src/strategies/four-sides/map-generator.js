'use strict';

var objectMap = require('mout/object/map');
var objectFilter = require('mout/object/filter');
var isString = require('mout/lang/isString');

// rules
var applyBlackAndWhiteLists = require('./rules/blacklist.js');
var applyMaxOccupation = require('./rules/max-occupation.js');
var applyMaxOccupationPercentage = require('./rules/max-occupation-percentage.js');

var sidesRelation = {
    UP: 'BOTTOM',
    BOTTOM: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT'
};

function isGreaterThanZero(value) {
    return value > 0;
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

function selectBlock(neighbours, blocksMap, mapStatus) {
    var chosenOne;
    var candidates = Object.keys(blocksMap);

    console.log('candidates before', candidates);
    // TODO: create a method to transverse all rules and stop when no candidates are left
    candidates = useBlackAndWhiteListsRule(candidates, neighbours, blocksMap);
    console.log('candidates after blacklist', candidates);
    candidates = useMaxOccupationRule(candidates, blocksMap, mapStatus);
    console.log('candidates after max occupation', candidates);
    candidates = useMaxOccupationPercentageRule(candidates, blocksMap, mapStatus);
    console.log('candidates after max occupation percentage', candidates);

    // TODO: TEMP - improve final selection
    chosenOne = candidates.length > 0 ? candidates[0] : null;

    return chosenOne;
}

module.exports = {
    selectBlock: selectBlock
};

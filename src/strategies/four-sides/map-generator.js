'use strict';

var objectMap = require('mout/object/map');
var isString = require('mout/lang/isString');

// rules
var applyBlackAndWhiteLists = require('./rules/blacklist.js');


var sidesRelation = {
    UP: 'BOTTOM',
    BOTTOM: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT'
};


function selectBlock (neighbours, blocksMap) {
    var candidates = Object.keys(blocksMap);

    var neighbourConnectors = objectMap(neighbours, function mapNeighbour (neighbourId, side) {
        var connectorLookUpSide;
        var neighbourBlockSides;

        if(!isString(neighbourId)) {
            return null;
        }

        connectorLookUpSide = sidesRelation[side];
        neighbourBlockSides = blocksMap[neighbourId].getSides();
        return neighbourBlockSides[connectorLookUpSide];
    });

    //console.log('candidates before', candidates);
    candidates = applyBlackAndWhiteLists(candidates, neighbourConnectors);
    //console.log('candidates after', candidates);

    // TEMP
    return candidates.length > 0 ? candidates[0] : null;
}

module.exports = {
    selectBlock: selectBlock
};

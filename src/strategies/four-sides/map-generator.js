'use strict';

var objectMap = require('mout/object/map');
var objectForOwn = require('mout/object/forOwn');
var isString = require('mout/lang/isString');
var clone = require('mout/lang/clone');
var myUtils = require('./../../utils/utils.js');
var CONSTANTS = require('./../../constants.json');

var sidesRelation = {
    UP: 'BOTTOM',
    BOTTOM: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT'
};


function applyBlackAndWhiteLists(candidates, neighbourConnectors) {
    var newCandidates = clone(candidates);

    objectForOwn(neighbourConnectors, function (connector) {
        if (connector) {
            switch (connector.type) {
                case CONSTANTS.connector.type.blacklist:
                    newCandidates = myUtils.applyBlackList(newCandidates, connector.blockIds);
                    break;
                case CONSTANTS.connector.type.whitelist:
                    newCandidates = myUtils.applyWhitelist(newCandidates, connector.blockIds);
                    break;
                default:
                    throw new Error('connector.type unknown');
            }
        }
    });

    return newCandidates;
}

function selectBlock (neighbours, blocksMap) {
    var candidates = Object.keys(blocksMap);

    var neighbourConnectors = objectMap(neighbours, function mapNeighbour (neighbourId, side) {
        var connectorLookUpSide;
        var neighbourBlock;

        if(!isString(neighbourId)) {
            return null;
        }

        connectorLookUpSide = sidesRelation[side];
        neighbourBlock = blocksMap[neighbourId];
        return neighbourBlock.sides[connectorLookUpSide];
    });

    console.log('candidates before', candidates);
    candidates = applyBlackAndWhiteLists(candidates, neighbourConnectors);
    console.log('candidates after', candidates);

    // TEMP
    return candidates.length > 0 ? candidates[0] : null;
}

module.exports = {
    selectBlock: selectBlock
};

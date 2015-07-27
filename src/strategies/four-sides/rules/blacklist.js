'use strict';

var objectMap = require('mout/object/map');
var objectForOwn = require('mout/object/forOwn');
var objectEvery = require('mout/object/every');
var objectSome = require('mout/object/some');
var isString = require('mout/lang/isString');
var isNull = require('mout/lang/isNull');
var clone = require('mout/lang/clone');
var myUtils = require('./../../../utils/utils.js');
var CONSTANTS = require('./../../../constants.json');

var SIDES_RELATION = {
    UP: 'BOTTOM',
    BOTTOM: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT'
};

function connectorIsCompatibleWithBlockId(connector, blockId) {
    //console.log('connector', connector.getType(), connector.getBlockIds(), ' ->', blockId);
    var blockIds = connector.getBlockIds();
    switch (connector.getType()) {
        case CONSTANTS.connector.type.blacklist:
            return blockIds.indexOf(blockId) === -1;
        case CONSTANTS.connector.type.whitelist:
            return blockIds.indexOf(blockId) !== -1;
        default:
            throw new Error('connector.type unknown');
    }
}

function filterCandidatesByItsConnectors(candidates, neighbours, blocksMap) {
    return candidates.filter(function allConnectorsAreCompatibleWithNeighbours(id) {
        var blockConnectors = blocksMap[id].getSides();
        return objectEvery(blockConnectors, function isCompatibleWithNeighbour(connector, side) {
            //console.log(id, side, 'hasNeighbour', isString(neighbours[side]));

            // when there is no neighbour, it is compatible
            if (!isString(neighbours[side])) {
                return true;
            }
            //console.log(id, side, 'hasConnector', !!connector);
            // if a side does not have a connector, the block is invalid if the neighbour already exists
            if (!connector) {
                return false;
            }
            //console.log(id, side, 'isCompatible with', neighbours[side], connectorIsCompatibleWithBlockId(connector, neighbours[side]));
            return connectorIsCompatibleWithBlockId(connector, neighbours[side]);
        });
    });
}

function filterCandidatesByItsNeighbourConnectors(candidates, neighbours, blocksMap) {
    var neighbourConnectors = objectMap(neighbours, function mapNeighbour(neighbourId, side) {
        var connectorLookUpSide;
        var neighbourBlockSides;

        if (!isString(neighbourId)) {
            return undefined;
        }

        connectorLookUpSide = SIDES_RELATION[side];
        neighbourBlockSides = blocksMap[neighbourId].getSides();
        return neighbourBlockSides[connectorLookUpSide];
    });

    // when one of the neighbours does not have connector, no candidate is valid
    if (objectSome(neighbourConnectors, isNull)) {
        return [];
    }

    objectForOwn(neighbourConnectors, function (connector) {
        if (connector) {
            switch (connector.getType()) {
                case CONSTANTS.connector.type.blacklist:
                    candidates = myUtils.applyBlackList(candidates, connector.getBlockIds());
                    break;
                case CONSTANTS.connector.type.whitelist:
                    candidates = myUtils.applyWhitelist(candidates, connector.getBlockIds());
                    break;
                default:
                    throw new Error('connector.type unknown');
            }
        }
    });

    return candidates;
}

// TODO: assert neighbours have all SIDE PROPERTIES
function applyBlackAndWhiteLists(candidates, neighbours, blocksMap) {
    candidates = clone(candidates);
    //console.log('candidates 1', candidates);
    candidates = filterCandidatesByItsConnectors(candidates, neighbours, blocksMap);
    //console.log('candidates 2', candidates);
    candidates = filterCandidatesByItsNeighbourConnectors(candidates, neighbours, blocksMap);

    return candidates;
}

module.exports = applyBlackAndWhiteLists;

'use strict';

var objectMap = require('mout/object/map');
var objectForOwn = require('mout/object/forOwn');
var objectEvery = require('mout/object/every');
var objectSome = require('mout/object/some');
var isString = require('mout/lang/isString');
var isArray = require('mout/lang/isArray');
var isObject = require('mout/lang/isObject');
var isNull = require('mout/lang/isNull');
var isEmpty = require('mout/lang/isEmpty');
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
            // when there is no neighbour, it is compatible
            if (!isString(neighbours[side])) {
                return true;
            }

            // if a side does not have a connector, the block is invalid if the neighbour already exists
            if (!connector) {
                return false;
            }

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

function applyBlackAndWhiteLists(candidates, neighbours, blocksMap) {
    if (!isArray(candidates) || isEmpty(candidates)) {
        throw new Error('candidates is mandatory and must be a non-empty {Array}');
    }

    if (!isObject(neighbours) || isEmpty(neighbours)) {
        throw new Error('neighbours is mandatory and must be a object {Array} with enumerable properties');
    }

    if (!isObject(blocksMap) || isEmpty(blocksMap)) {
        throw new Error('blocksMap is mandatory and must be a object {Array} with enumerable properties');
    }

    candidates = clone(candidates);
    candidates = filterCandidatesByItsConnectors(candidates, neighbours, blocksMap);
    candidates = filterCandidatesByItsNeighbourConnectors(candidates, neighbours, blocksMap);

    return candidates;
}

module.exports = applyBlackAndWhiteLists;

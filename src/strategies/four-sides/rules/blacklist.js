'use strict';

var clone = require('mout/lang/clone');
var objectForOwn = require('mout/object/forOwn');
var myUtils = require('./../../../utils/utils.js');
var CONSTANTS = require('./../../../constants.json');

function applyBlackAndWhiteLists(candidates, neighbourConnectors) {
    var newCandidates = clone(candidates);

    objectForOwn(neighbourConnectors, function (connector) {
        if (connector) {
            switch (connector.getType()) {
                case CONSTANTS.connector.type.blacklist:
                    newCandidates = myUtils.applyBlackList(newCandidates, connector.getBlockIds());
                    break;
                case CONSTANTS.connector.type.whitelist:
                    newCandidates = myUtils.applyWhitelist(newCandidates, connector.getBlockIds());
                    break;
                default:
                    throw new Error('connector.type unknown');
            }
        }
    });

    return newCandidates;
}

module.exports = applyBlackAndWhiteLists;

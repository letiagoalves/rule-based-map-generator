'use strict';

var clone = require('mout/lang/clone');
var objectForOwn = require('mout/object/forOwn');
var myUtils = require('./../../../utils/utils.js');
var CONSTANTS = require('./../../../constants.json');

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

module.exports = applyBlackAndWhiteLists;

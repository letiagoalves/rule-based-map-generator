'use strict';

var Block = require('./block');
var Connector = require('./connector');
var forOwn = require('mout/object/forOwn');
var util = require('util');

function getStrategy(numberOfSides) {
    // TODO:
    return require('./strategies/four-sides');
}

function parseBlock(sidesTemplate) {
    return function (block) {
        return new Block(block.id, sidesTemplate, block.classes, block.constraints);
    };
}

function parseConnector(connector) {
    return new Connector(connector.id, connector.type, connector.blockIds, connector.blockClasses);
}

function createMapUsingProperty(arr, prop) {
    var map = {};
    arr.forEach(function (value) {
        map[value[prop]] = value;
    });
    return map;
}

function parse(config) {
    // TODO: rethink strategies
    var strategy = getStrategy(config.numberOfSides);
    var blocks = config.blocks.map(parseBlock(strategy.sides));
    var blocksMap = createMapUsingProperty(blocks, 'id');
    var connectors = config.connectors.map(parseConnector);
    var connectorsMap = createMapUsingProperty(connectors, 'id');
    var blockDefinition;

    // for each block set side connectors
    for(blockDefinition of config.blocks) {
        forOwn(blockDefinition.connectors, function (connectorId, side) {
            blocksMap[blockDefinition.id].setSideConnector(side, connectorsMap[connectorId]);
        });
    }

    console.info('blocks', util.inspect(blocks, { depth: 5}));
    //console.info('connectors', connectors);
}

module.exports = {
    parse: parse
};

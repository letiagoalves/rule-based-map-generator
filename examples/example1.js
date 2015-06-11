'use strict';

var world1Config = require('./configurations/world1.json');
var builder = require('./../src/builder.js');
var myUtils = require('./../src/utils/utils.js');

var worldInstance = builder.parse(world1Config);
console.log('start world');
worldInstance.start();
console.log('get 0,0');
myUtils.logTable(worldInstance.getPartialMap(-2, -2, 2, 2));

//myUtils.logTable(worldInstance.getMap());

/**
// 1 - Create blocks
var b1 = Builder.createBlock('b1', blockConstraints);
var b2 = Builder.createBlock('b2', blockConstraints);
var b3 = Builder.createBlock('b3', blockConstraints);

// 2
var c1 = Builder.createConnector('c1', 'whitelist', [], []);
var c2 = Builder.createConnector('c2', 'whitelist', [], []);
var c3 = Builder.createConnector('c3', 'whitelist', [], []);
var c4 = Builder.createConnector('c4', 'whitelist', [], []);

// 3 - Add connectors to each block
b1.setConnector(SIDE.LEFT, c1);
b1.setConnector(SIDE.RIGHT, c1);
b1.setConnector(SIDE.TOP, c1);
b1.setConnector(SIDE.BOTTOM, c1);

// 4 - Create map with blocks + connectors
var mapConstraints = {
    bounds: {
        horizontal: 10,
        vertical: 10
    },
    initialBlock: c1,
    initialMapSize: 3 // this means 3x3
};
var map = Builder.createMap(numberOfSides, [b1, b2, b3], mapConstraints);

// get 3x3 map area around coordinates (0, 0)
var mapArea = map.get(0, 0, 3);
console.info('mapArea', mapArea);

var allMap = map.getAll();
console.info('allMap', allMap);
**/

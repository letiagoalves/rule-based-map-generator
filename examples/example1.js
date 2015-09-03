'use strict';

var chalk = require('chalk');
var world1Config = require('./configurations/world1.json');
var parser = require('./../src/parser');
var myUtils = require('./../src/utils/utils.js');

var worldInstance;
var map;

console.log(chalk.bgBlue('Running Example 1'));

worldInstance = parser.parse(world1Config);
worldInstance.start();

function getAndLog(minX, minY, maxX, maxY) {
    var partialMap = worldInstance.getPartialMap(minX, minY, maxX, maxY);
    myUtils.logTable(partialMap);
}

myUtils.logTable(worldInstance.getMap());
getAndLog(-4, 1, -2, 3);
//getAndLog(-2, 1, 0, 3);

// TMP
map = worldInstance.getMap();
myUtils.logTable(map);
myUtils.saveMap(map);

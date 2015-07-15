'use strict';

var chalk = require('chalk');
var world1Config = require('./configurations/world4.json');
var builder = require('./../src/builder.js');
var myUtils = require('./../src/utils/utils.js');

var worldInstance;
var map;

console.log(chalk.bgBlue('Running Example 4'));

worldInstance = builder.parse(world1Config);
worldInstance.start();

function getAndLog(minX, minY, maxX, maxY) {
    var partialMap = worldInstance.getPartialMap(minX, minY, maxX, maxY);
    myUtils.logTable(partialMap);
}

myUtils.logTable(worldInstance.getMap());
getAndLog(0, 0, 1, 1);

// TMP
map = worldInstance.getMap();
myUtils.logTable(map);
myUtils.saveMap(map);

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
getAndLog(0, 0, 2, 2);
getAndLog(0, 0, 3, 4);
getAndLog(0, 0, 4, 4);
getAndLog(0, 0, 5, 5);

getAndLog(0, 0, 0, 0);
getAndLog(-1, -1, 0, 0);
getAndLog(-3, -3, 0, 0);
getAndLog(-4, -4, 0, 0);
getAndLog(-5, -5, 0, 0);
getAndLog(-6, -6, 0, 0);

// TMP
map = worldInstance.getMap();
myUtils.logTable(map);
myUtils.saveMap(map);

'use strict';

var chalk = require('chalk');
var world1Config = require('./configurations/world3.json');
var parser = require('./../src/parser');
var myUtils = require('./../src/utils/utils.js');

var worldInstance;
var map;

console.log(chalk.bgBlue('Running Example 3'));

worldInstance = parser.parse(world1Config);
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

//getAndLog(-1, -1, 0, 0);
//getAndLog(-2, -2, 0, 0);
//getAndLog(-3, -3, 0, 0);


// TMP
map = worldInstance.getMap();
myUtils.logTable(map);
myUtils.saveMap(map);

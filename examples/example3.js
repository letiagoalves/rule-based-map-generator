'use strict';

var chalk = require('chalk');
var world1Config = require('./configurations/world3.json');
var builder = require('./../src/builder.js');
var myUtils = require('./../src/utils/utils.js');

var worldInstance;
var map;

console.log(chalk.bgBlue('Running Example 2'));

worldInstance = builder.parse(world1Config);
worldInstance.start();

myUtils.logTable(worldInstance.getMap());
map = worldInstance.getPartialMap(-1, -1, 0, 0);
myUtils.logTable(worldInstance.getMap());
map = worldInstance.getPartialMap(-2, -2, 0, 0);
myUtils.logTable(worldInstance.getMap());
map = worldInstance.getPartialMap(-3, -3, 0, 0);
myUtils.logTable(worldInstance.getMap());
map = worldInstance.getPartialMap(-4, -4, 0, 0);
myUtils.logTable(worldInstance.getMap());


// TMP
myUtils.saveMap(map);

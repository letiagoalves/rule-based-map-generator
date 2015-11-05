'use strict';

var chalk = require('chalk');
var world1Config = require('./configurations/world2.json');
var parser = require('./../src/parser');
var myUtils = require('./../src/utils/utils.js');

var worldInstance;
var map;

console.log(chalk.bgBlue('Running Example 2'));

worldInstance = parser.parse(world1Config);
worldInstance.start();
map = worldInstance.getPartialMap(-2, -2, 2, 2);
myUtils.logTable(map);
map = worldInstance.getPartialMap(-3, -3, 1, 1);
map = worldInstance.getMap();
myUtils.logTable(map);

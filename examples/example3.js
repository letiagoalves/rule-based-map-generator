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
map = worldInstance.getPartialMap(-2, -2, 2, 2);
myUtils.logTable(map);


// TMP
myUtils.saveMap(map);

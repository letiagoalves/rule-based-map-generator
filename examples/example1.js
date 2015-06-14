'use strict';

var chalk = require('chalk');
var world1Config = require('./configurations/world1.json');
var builder = require('./../src/builder.js');
var myUtils = require('./../src/utils/utils.js');

var worldInstance;

console.log(chalk.bgBlue('Running Example 1'));

worldInstance = builder.parse(world1Config);
console.log('start world');
worldInstance.start();
console.log('get 0,0');
myUtils.logTable(worldInstance.getPartialMap(-2, -2, 2, 2));

'use strict';

var chalk = require('chalk');
var world1Config = require('./configurations/case-study.json');
var parser = require('./../src/parser');
var myUtils = require('./../src/utils/utils.js');

var worldInstance;

console.log(chalk.bgBlue('Running case stydy'));

worldInstance = parser.parse(world1Config);
worldInstance.start();

function getAndLog(posX, posY) {
    var size = 1;
    var partialMap = worldInstance.getPartialMap(posX - size, posY - size, posX + size, posY + size);
    myUtils.logTable(partialMap);
}

myUtils.logTable(worldInstance.getMap());
getAndLog(-1, 0);
getAndLog(-2, 0);
getAndLog(-3, 0);
getAndLog(-4, 0);

getAndLog(-4, 1);
getAndLog(-4, 2);
getAndLog(-4, 3);
getAndLog(-4, 4);
getAndLog(-4, 5);
getAndLog(-4, 6);
getAndLog(-4, 7);

getAndLog(-3, 7);
getAndLog(-2, 7);

myUtils.logTable(worldInstance.getMap());

getAndLog(-1, 7);

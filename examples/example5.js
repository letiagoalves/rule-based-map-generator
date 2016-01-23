'use strict';

var chalk = require('chalk');
var api = require('./../src');
var myUtils = require('./../src/utils/utils.js');

var strategy;
var blockFactory;
var block1, block2, block3;
var connector1;
var worldConstraints, world;

console.log(chalk.bgBlue('Running Example 5'));

// create strategy
strategy = api.createStrategy('squareGrid', 1337);

// Create blocks
blockFactory = api.createBlockFactory(strategy);
block1 = blockFactory('B1');
block2 = blockFactory('B2');
block3 = blockFactory('B3');

// Create connectors
connector1 = api.createConnectorInstance('C1', 'whitelist', ['B1', 'B2', 'B3']);

// Set block connectors
[block1, block2, block3].forEach(function setBlockConnectors(block) {
    strategy.getSidesTemplate().forEach(function (side) {
        block.setSideConnector(side, connector1);
    });
});

// create world
worldConstraints = api.createWorldConstraints(4);
world = api.createWorldInstance(strategy, worldConstraints, [block1, block2, block3]);

console.log(chalk.bgBlue('World start'));
world.start();
console.log(chalk.bgBlue('World.getMap()'));
myUtils.logTable(world.getMap());
console.log(chalk.bgBlue('World.getPartialMap(-4, -4, 0, 0)'));
myUtils.logTable(world.getPartialMap(-4, -4, 0, 0));
console.log(chalk.bgBlue('World.getMap()'));
myUtils.logTable(world.getMap());

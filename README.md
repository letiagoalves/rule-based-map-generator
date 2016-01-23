# rule-based-map-generator
##### [node](http://nodejs.org) framework for real time generation of grid/tiled maps based on a previously defined set of constraints/rules

## Philosophy

This project goal is to provide an open framework to ease the generation of game worlds using predefined rules in a semi-automatic approach joining the benefits of procedural generation with manual art work creation.
By other words, this framework generates structured maps in real time handling expansions when needed respecting game design rules in order to create additive game worlds.

## Installation

```bash
$ npm install rule-based-map-generator
```

## Features

### Rules
You can design your maps using different rules. They are:

#### World based
- Initial map size (mandatory)
- Horizontal and vertical bounds
- Map center
- Evaluation period *(not yet implemented)*

#### Block based
- Blacklist
- Whitelist
- Maximum occupation
- Maximum occupation by percentage
- Minimum distance between other blocks

### Strategies
- square grid
- hexagonal grid *(not yet implemented)*

## Usage

### World creation

Below is a minimal example of how to configure and create a world.

First require rule-based-map-generator module.
```js
var ruleBasedMapGenerator = require('rule-based-map-generator');
```

Here we create a strategy of generation. In these case we will choose a strategy for square grid maps.
```js
var strategyName = 'squareGrid';
var worldSeed = 1337;
var strategy = ruleBasedMapGenerator.createStrategy(strategyName, worldSeed);
```

In order to create blocks, we need to create a block factory for the previously created strategy. Then we create 3 blocks without constraints for the sake of simplicity.
```js
var blockFactory = ruleBasedMapGenerator.createBlockFactory(strategy);
var block1 = blockFactory('B1');
var block2 = blockFactory('B2');
var block3 = blockFactory('B3');
```

To define how blocks connect between each other in the world we need to create connectors.
```js
var connector1 = ruleBasedMapGenerator.createConnectorInstance('C1', 'whitelist', ['B1', 'B2', 'B3']);
var connector2 = ruleBasedMapGenerator.createConnectorInstance('C1', 'blacklist', ['B2']);
```

Now we can attach the connector to the desired blocks sides.
```js
block1.setSideConnector('LEFT', connector1);
block1.setSideConnector('RIGHT', connector1);
block1.setSideConnector('UP', connector2);
block1.setSideConnector('BOTTOM', connector2);

block2.setSideConnector('LEFT', connector1);
block2.setSideConnector('RIGHT', connector1);
// and so on...
```

Before creating the world instance we need to create the world constraints.
```js
var initialMapSize = 4;
var bounds = { horizontal: 10, vertical: 10 };
var mapCenter = 'B2';
var worldConstraints = ruleBasedMapGenerator.createWorldConstraints(initialMapSize, bounds, mapCenter);
```

Now we are ready to create our world.
```js
var world = ruleBasedMapGenerator.createWorldInstance(
    strategy,
    worldConstraints,
    [block1, block2, block3] // set of blocks
);
```

**But wait! There is more.** Instead of setting up the world using all these API methods you can take advantage of the **World Parser** to create a world based on a single configuration.
```js
var worldParser = require('rule-based-map-generator').parser;
var configuration = require('./path/to/world/configuration.json');
var world = worldParser.parse(configuration);
```

You can see examples of world configurations [here](examples/configurations/).

### World generation

We can retrieve map using the following world methods:
```js
var minX = 0, minY = 0, maxX = 4, maxY = 4;
var partialMap = world.getPartialMap(minX, minY, maxX, maxY);
```

```js
var map = world.getMap();
```

Both result in a matrix representing the world. An example can be seen below:

|       | 0   | 1   | 2   |
| ---   | --- | --- | --- |
| **0** | `{ x: 0, y: 2, block: 'B2' }` | `{ x: 1, y: 2, block: 'B1' }` | `{ x: 2, y: 2, block: 'B3' }` |
| **1** | `{ x: 0, y: 1, block: 'B1' }` | `{ x: 1, y: 1, block: 'B3' }` | `{ x: 2, y: 1, block: 'B3' }` |
| **2** | `{ x: 0, y: 0, block: 'B1' }` | `{ x: 1, y: 0, block: 'B1' }` | `{ x: 2, y: 2, block: 'B2' }` |



## API

```javascript
createStrategy
createBlockFactory
createConnectorInstance
createWorldConstraints
createWorldInstance
```

## Examples

You can see examples [here](examples/).

### Contribute
This project is being developed in an academic context so contributions are temporarily not allowed.

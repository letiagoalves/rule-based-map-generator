# rule-based-map-generator
#####[node](http://nodejs.org) framework for real time generation of grid/tiled maps based on a previously defined set of constraints/rules

##Philosophy

This project goal is to provide an open framework to ease the generation of game worlds using predefined rules in a semi-automatic approach joining the benefits of procedural generation with manual art work creation.
By other words, this framework generates structured maps in real time handling expansions when needed respecting game design rules in order to create additive game worlds.

## Installation

```bash
$ npm install rule-based-map-generator
```

##Features

###Rules
You can design your maps using different rules. They are:

####World based
- Initial map size (mandatory)
- Horizontal and vertical bounds
- Map center
- Evaluation period *(not yet implemented)*

####Block based
- Blacklist
- Whitelist
- Maximum occupation
- Maximum occupation by percentage
- Minimum distance between other blocks

###Strategies
- square grid
- hexagonal grid *(not yet implemented)*

##Examples

The easiest way to create a world instance is to use the World configuration parser. This parser receives a literal object with the world definition. For example:

```javascript
var ruleBasedMapGenerator = require('rule-based-map-generator');
var worldParser = ruleBasedMapGenerator.parser;

var world = worldParser.parse({
    seed: 1337,
    strategy: 'squareGrid',
    initialMapSize: 4,
    blocks: [{
        id: 'b1',
        connectors: {
            UP: 'c2', RIGHT: 'c3', BOTTOM: 'c2', LEFT: 'c3'
        },
        constraints: {}
    }, {
        id: 'b2',
        connectors: {
            UP: 'c1', RIGHT: 'c3', BOTTOM: 'c1', LEFT: 'c3'
        },
        constraints: {}
    }, {
        id: 'b3',
        connectors: {
            UP: 'c4', RIGHT: 'c4', BOTTOM: 'c4', LEFT: 'c4'
        },
        constraints: {}
    }],
    connectors: [
        { id: 'c1', type: 'whitelist', blockIds: ['b1']},
        { id: 'c2', type: 'whitelist', blockIds: ['b2']},
        { id: 'c3', type: 'whitelist', blockIds: ['b3']},
        { id: 'c4', type: 'whitelist', blockIds: ['b1', 'b2', 'b3']}]
});
```

Or you can build the world manually:

<!--
```javascript
var ruleBasedMapGenerator = require('rule-based-map-generator');
var api = ruleBasedMapGenerator.api;
var strategyFactory = api.getStrategyFactory('squareGrid');
var seed = 1337;
var randomMatrixGenerator = randomMatrix(seed);
strategyInstance = strategyFactory.createInstance(randomMatrixGenerator);
```
-->

###### //TODO: Create example documentation


###Contribute
This project is being developed in an academic context so contributions are temporarily not allowed.

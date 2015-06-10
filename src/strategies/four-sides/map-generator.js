'use strict';

var objectMap = require('mout/object/map');
var isString = require('mout/lang/isString');

var sidesRelation = {
    UP: 'BOTTOM',
    BOTTOM: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT'
};

function selectBlock (neighbours, blocksMap) {
    var candidates = Object.keys(blocksMap);

    var neighbourConnectors = objectMap(neighbours, function mapNeighbour (neighbourId, side) {
        var connectorLookUpSide;
        var neighbourBlock;

        if(!isString(neighbourId)) {
            return null;
        }

        connectorLookUpSide = sidesRelation[side];
        neighbourBlock = blocksMap[neighbourId];
        console.log('->', connectorLookUpSide, neighbourBlock);
        return neighbourBlock.sides[connectorLookUpSide];
    });

    console.log('neighbours', neighbours);
    console.log('candidates', candidates);
    console.log('neighbourConnectors', neighbourConnectors);

    return null;
}

module.exports = {
    selectBlock: selectBlock
};

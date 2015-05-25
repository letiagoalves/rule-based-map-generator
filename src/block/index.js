'use strict';

// TODO: privatize members
var validator = require('./../validator');
var schema = require('./schema');

function createSidesFromTemplate(template) {
    var sides = {};
    template.forEach(function setSideProperty(side) {
        sides[side] = null;
    });
    return sides;
}

function Block(id, sidesTemplate, classes, constraints) {
    id = validator.assert(id, schema.id, 'Block id');
    sidesTemplate = validator.assert(sidesTemplate, schema.sidesTemplate, 'Sides template');
    classes = validator.assert(classes, schema.classes, 'Block classes');
    //TODO: assert constraints

    this.id = id;
    this.classes = classes;
    this.numberOfSides = sidesTemplate.length;
    this.sides = createSidesFromTemplate(sidesTemplate);
    this.constraints = constraints;
}

/**
 * Sets a connector to a side
 * @param {String}      side      Block side
 * @param {Connector}   connector Connector
 */
Block.prototype.setSideConnector = function (side, connector) {
    if(!this.sides.hasOwnProperty(side)) {
        throw new Error('Invalid side');
    }
    this.sides[side] = connector;
};

Block.prototype.toString = function toString () {
    return '{Block} {id}'.replace('{id}', this.id);
};

module.exports = Block;

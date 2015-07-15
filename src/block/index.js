'use strict';

// TODO: return copies and only trough getters
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
    var sides;

    // schema assertions
    id = validator.assert(id, schema.id, 'Block id');
    sidesTemplate = validator.assert(sidesTemplate, schema.sidesTemplate, 'Sides template');
    classes = validator.assert(classes, schema.classes, 'Block classes');
    constraints = validator.assert(constraints, schema.constraints, 'Block constraints');

    sides = createSidesFromTemplate(sidesTemplate);

    function getId() {
        return id;
    }

    function getNumberOfSides() {
        return sidesTemplate.length;
    }

    function getSides() {
        return sides;
    }

    function getMaxOccupation() {
        return constraints.maxOccupation;
    }

    function getMaxOccupationPercentage() {
        return constraints.maxOccupationPercentage;
    }

    function getMinimumDistancesToOtherBlocks() {
        return constraints.minimumDistance;
    }

    /**
     * Sets a connector to a side
     * @param {String}      side      Block side
     * @param {Connector}   connector Connector
     */
    function setSideConnector(side, connector) {
        if (!sides.hasOwnProperty(side)) {
            throw new Error('Invalid side');
        }
        sides[side] = connector;
    }

    function toString() {
        return '{Block} {id}'.replace('{id}', this.getId());
    }

    // public
    this.getId = getId;
    this.getSides = getSides;
    this.getNumberOfSides = getNumberOfSides;
    this.getMaxOccupation = getMaxOccupation;
    this.getMaxOccupationPercentage = getMaxOccupationPercentage;
    this.getMinimumDistancesToOtherBlocks = getMinimumDistancesToOtherBlocks;
    this.setSideConnector = setSideConnector;
    this.toString = toString;
}


module.exports = Block;

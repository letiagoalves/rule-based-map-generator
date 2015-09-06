'use strict';

// TODO: return copies and only trough getters
var validator = require('./../validator');
var schema = require('./schema');
var Connector = require('./../connector');
var myUtils = require('./../utils/utils.js');

function createSidesFromTemplate(template) {
    var sides = {};
    template.forEach(function setSideProperty(side) {
        sides[side] = null;
    });
    return sides;
}

// TODO: avoid passing strategy to Block through constructor. World should be responsible to pass it when adding blocks to the world.
function Block(strategy, id, classes, constraints) {
    var sidesTemplate;
    var sides;

    // schema assertions
    strategy = validator.assert(strategy, schema.strategy, 'Block.strategy');
    id = validator.assert(id, schema.id, 'Block.id');
    classes = validator.assert(classes, schema.classes, 'Block.classes');
    // TODO: BlockConstraints
    constraints = validator.assert(constraints, schema.constraints, 'Block.constraints');

    sidesTemplate = strategy.getSidesTemplate();
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
        if (connector !== null && !myUtils.isInstanceOf(connector, Connector)) {
            throw new Error('Invalid connector');
        }

        if (!sides.hasOwnProperty(side)) {
            throw new Error('Invalid side');
        }
        sides[side] = connector;
    }

    function toString() {
        return '{Block} {id}'.replace('{id}', id);
    }

    // public
    this.getId = getId;
    // TODO: remove sides visibility, implement getSideConnector
    this.getSides = getSides;
    this.getNumberOfSides = getNumberOfSides;
    this.getMaxOccupation = getMaxOccupation;
    this.getMaxOccupationPercentage = getMaxOccupationPercentage;
    this.getMinimumDistancesToOtherBlocks = getMinimumDistancesToOtherBlocks;
    this.setSideConnector = setSideConnector;
    this.toString = toString;
}


module.exports = Block;

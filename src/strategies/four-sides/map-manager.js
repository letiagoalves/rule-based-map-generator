'use strict';

var Matrix = require('functional-matrix');
var Joi = require('joi');

var quadrantsHelper = require('./quadrants-helper.js');
var validator = require('./../../validator');
var Block = require('./../../block');

function MapManager(initialSize) {
    var quarterOfSize = initialSize / 2;
    // TODO: manage rest
    //var rest = initialSize % 2;
    var sizeForEachQadrant = Math.floor(quarterOfSize);
    var map = {
        q1: new Matrix(sizeForEachQadrant, sizeForEachQadrant),
        q2: new Matrix(sizeForEachQadrant, sizeForEachQadrant),
        q3: new Matrix(sizeForEachQadrant, sizeForEachQadrant),
        q4: new Matrix(sizeForEachQadrant, sizeForEachQadrant)
    };

    function get(x, y) {
        // TODO: assert integers
        if (quadrantsHelper.isQ1(x, y)) {
            return map.q1.get(x, y);
        }

        if (quadrantsHelper.isQ2(x, y)) {
            return map.q2.get(Math.abs(x) - 1, y);
        }

        if (quadrantsHelper.isQ3(x, y)) {
            return map.q3.get(Math.abs(x) - 1, Math.abs(y) - 1);
        }

        if (quadrantsHelper.isQ4(x, y)) {
            return map.q4.get(x, Math.abs(y) - 1);
        }

        throw new Error('cannot get');
    }

    function set(x, y, value) {
        // TODO: assert integers and value
        validator.assert(value, Joi.object().type(Block).required().allow(null), 'value must be a Block');

        if (quadrantsHelper.isQ1(x, y)) {
            return map.q1.set(x, y, value);
        }

        if (quadrantsHelper.isQ2(x, y)) {
            return map.q2.set(Math.abs(x) - 1, y, value);
        }

        if (quadrantsHelper.isQ3(x, y)) {
            return map.q3.set(Math.abs(x) - 1, Math.abs(y) - 1, value);
        }

        if (quadrantsHelper.isQ4(x, y)) {
            return map.q4.set(x, Math.abs(y) - 1, value);
        }

        throw new Error('cannot set');
    }

    // TODO: documentation
    function getPartialMap(minX, minY, maxX, maxY) {
        var xSize = Math.abs(maxX - minX) + 1;
        var ySize = Math.abs(maxY - minY) + 1;
        var subMapMatrix = new Matrix(xSize, ySize, function fillFunction (row, col) {
            return get(row + minY, col + minX);
        });

        return subMapMatrix.rotateCCW().to2dArray();
    }

    // TODO: documentation
    function getMap() {
        var minX = -Math.max(map.q2.cols(), map.q3.cols());
        var maxX = Math.max(map.q1.cols(), map.q4.cols()) - 1;

        var minY = -Math.max(map.q3.rows(), map.q4.rows());
        var maxY = Math.max(map.q1.rows(), map.q2.rows()) - 1;

        return getPartialMap(minX, minY, maxX, maxY);
    }

    // public
    this.getPartialMap = getPartialMap;
    this.getMap = getMap;
    this.get = get;
    this.set = set;
}

module.exports = MapManager;

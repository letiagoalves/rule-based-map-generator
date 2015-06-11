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

    this.map = {
        q1: new Matrix(sizeForEachQadrant, sizeForEachQadrant),
        q2: new Matrix(sizeForEachQadrant, sizeForEachQadrant),
        q3: new Matrix(sizeForEachQadrant, sizeForEachQadrant),
        q4: new Matrix(sizeForEachQadrant, sizeForEachQadrant)
    };
}

MapManager.prototype.getPartialMap = function (minX, minY, maxX, maxY) {
    var that = this;
    var xSize = Math.abs(maxX - minX) + 1;
    var ySize = Math.abs(maxY - minY) + 1;
    var subMapMatrix = new Matrix(xSize, ySize, function fillFunction (row, col) {
        return that.get(row + minY, col + minX);
    });

    return subMapMatrix.rotateCCW().to2dArray();
};

MapManager.prototype.getMap = function () {
    var minX = -Math.max(this.map.q2.cols(), this.map.q3.cols());
    var maxX = Math.max(this.map.q1.cols(), this.map.q4.cols()) - 1;

    var minY = -Math.max(this.map.q3.rows(), this.map.q4.rows());
    var maxY = Math.max(this.map.q1.rows(), this.map.q2.rows()) - 1;

    return this.getPartialMap(minX, minY, maxX, maxY);
};

MapManager.prototype.get = function get(x, y) {
    // TODO: assert integers
    var map = this.map;

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
};

MapManager.prototype.set = function get(x, y, value) {
    var map;

    // TODO: assert integers and value
    validator.assert(value, Joi.object().type(Block).required().allow(null), 'value must be a Block');

    map = this.map;

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
};

module.exports = MapManager;

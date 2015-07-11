'use strict';

var Matrix = require('functional-matrix');
var Joi = require('joi');
var chalk = require('chalk');

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
        var row = y;
        var col = x;

        // TODO: assert integers and inside bounds
        if (quadrantsHelper.isQ1(x, y)) {
            return map.q1.get(row, col);
        }

        if (quadrantsHelper.isQ2(x, y)) {
            return map.q2.get(row, Math.abs(col) - 1);
        }

        if (quadrantsHelper.isQ3(x, y)) {
            return map.q3.get(Math.abs(row) - 1, Math.abs(col) - 1);
        }

        if (quadrantsHelper.isQ4(x, y)) {
            return map.q4.get(Math.abs(row) - 1, col);
        }

        throw new Error('cannot get');
    }

    function set(x, y, value) {
        var row = y;
        var col = x;

        // TODO: assert integers and value
        validator.assert(value, Joi.object().type(Block).required().allow(null), 'value must be a Block');

        if (quadrantsHelper.isQ1(x, y)) {
            return map.q1.set(row, col, value);
        }

        if (quadrantsHelper.isQ2(x, y)) {
            return map.q2.set(row, Math.abs(col) - 1, value);
        }

        if (quadrantsHelper.isQ3(x, y)) {
            return map.q3.set(Math.abs(row) - 1, Math.abs(col) - 1, value);
        }

        if (quadrantsHelper.isQ4(x, y)) {
            return map.q4.set(Math.abs(row) - 1, col, value);
        }

        throw new Error('cannot set');
    }

    function getQ1Limit() {
        return {
            x: map.q1.cols() - 1,
            y: map.q1.rows() - 1
        };
    }

    function getQ2Limit() {
        return {
            x: -map.q2.cols(),
            y: map.q2.rows() - 1
        };
    }

    function getQ3Limit() {
        return {
            x: -map.q3.cols(),
            y: -map.q3.rows()
        };
    }

    function getQ4Limit() {
        return {
            x: map.q4.cols() - 1,
            y: -map.q4.rows()
        };
    }

    // TODO: REMOVE THIS. Bounds cannot be calculated this way. Instead create getQ1Bounds/getQ2Bounds/getQ3Bounds/
    function getWrappedBounds() {
        var q1Limit = getQ1Limit();
        var q2Limit = getQ2Limit();
        var q3Limit = getQ3Limit();
        var q4Limit = getQ4Limit();

        return {
            minX: Math.min(q2Limit.x, q3Limit.x),
            maxX: Math.max(q1Limit.x, q4Limit.x),
            minY: Math.min(q3Limit.y, q4Limit.y),
            maxY: Math.max(q1Limit.y, q2Limit.y)
        };
    }

    // TODO: documentation
    function getPartialMap(minX, minY, maxX, maxY) {
        var xSize = Math.abs(maxX - minX) + 1;
        var ySize = Math.abs(maxY - minY) + 1;
        var subMapMatrix = new Matrix(xSize, ySize, function fillFunction (row, col) {
            return get(row + minX, col + minY);
        });

        return subMapMatrix.rotateCCW().to2dArray();
    }

    // TODO: documentation
    function getMap() {
        var bounds = getWrappedBounds();
        return getPartialMap(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    }

    function isInsideMapBounds(minX, minY, maxX, maxY) {
        var q1Limit = getQ1Limit();
        var q2Limit = getQ2Limit();
        var q3Limit = getQ3Limit();
        var q4Limit = getQ4Limit();

        return minX >= Math.max(q2Limit.x, q3Limit.x) && minY >= Math.max(q3Limit.y, q4Limit.y) &&
               maxX <= Math.min(q1Limit.x, q4Limit.x) && maxY <= Math.min(q1Limit.y, q2Limit.y);
    }

    function expandMapQ1(maxX, maxY) {
        // TODO: assert maxX and maxY are Q1

        var i;
        var q1Limit = getQ1Limit();
        var missingColumns = maxX - q1Limit.x;
        var missingRows = maxY - q1Limit.y;

        for (i = 0; i < missingRows; i++) {
            map.q1.pushRow(Array(map.q1.cols()));
        }

        for (i = 0; i < missingColumns; i++) {
            map.q1.pushCol(Array(map.q1.rows()));
        }
    }

    function expandMapQ2(minX, maxY) {
        // TODO: assert maxX and maxY are Q2

        var i;
        var q2Limit = getQ2Limit();
        var missingColumns = q2Limit.x - minX;
        var missingRows = maxY - q2Limit.y;

        for (i = 0; i < missingRows; i++) {
            map.q2.pushRow(Array(map.q2.cols()));
        }

        for (i = 0; i < missingColumns; i++) {
            map.q2.pushCol(Array(map.q2.rows()));
        }
    }

    function expandMap(minX, minY, maxX, maxY) {
        console.info(chalk.green('Start expansion'));
        // TODO: expand only to map limits defined in map constraints
        expandMapQ1(maxX, maxY);
        expandMapQ2(minX, maxY);
        //expandMapQ3(minX, minY);
        //expandMapQ4(maxX, minY);
        console.info(chalk.green('End expansion'));
    }

    // public
    this.getWrappedBounds = getWrappedBounds;
    this.getPartialMap = getPartialMap;
    this.getMap = getMap;
    this.isInsideMapBounds = isInsideMapBounds;
    this.expandMap = expandMap;
    this.get = get;
    this.set = set;
}

module.exports = MapManager;

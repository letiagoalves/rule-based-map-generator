'use strict';

var Matrix = require('functional-matrix');
var Joi = require('joi');
var chalk = require('chalk');

var quadrantsHelper = require('./quadrants-helper.js');
var validator = require('./../../validator');
var Block = require('./../../block');

function MapManager(initialSize, maxMapSize) {
    // TODO: assert arguments
    var map;
    var bounds;

    function buildMap(mapInitialSize) {
        var adjustValue = mapInitialSize % 2 === 0 ? 0 : 1;
        var q1AndQ2Height = Math.floor(mapInitialSize / 2) + adjustValue;
        var q3AndQ4Height = mapInitialSize - q1AndQ2Height;
        var q1AndQ4Width = Math.floor(mapInitialSize / 2) + adjustValue;
        var q2AndQ3Width = mapInitialSize - q1AndQ4Width;

        return {
            q1: new Matrix(q1AndQ2Height, q1AndQ4Width),
            q2: new Matrix(q1AndQ2Height, q2AndQ3Width),
            q3: new Matrix(q3AndQ4Height, q2AndQ3Width),
            q4: new Matrix(q3AndQ4Height, q1AndQ4Width)
        };
    }

    function buildBounds(horizontal, vertical) {
        var horizontalAdjustValue = horizontal % 2 === 0 ? 0 : 1;
        var verticalAdjustValue = vertical % 2 === 0 ? 0 : 1;

        var q1AndQ2Height = Math.floor(vertical / 2) + verticalAdjustValue;
        var q3AndQ4Height = vertical - q1AndQ2Height;
        var q1AndQ4Width = Math.floor(horizontal / 2) + horizontalAdjustValue;
        var q2AndQ3Width = horizontal - q1AndQ4Width;

        return {
            minX: -q2AndQ3Width,
            minY: -q3AndQ4Height,
            maxX: q1AndQ4Width,
            maxY: q1AndQ2Height
        };
    }

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
        // TODO: assert is inside map bounds
        var xSize = Math.abs(maxX - minX) + 1;
        var ySize = Math.abs(maxY - minY) + 1;
        var subMapMatrix = new Matrix(xSize, ySize, function fillFunction (row, col) {
            return get(row + minX, col + minY);
        });

        return subMapMatrix.rotateCCW().to2dArray();
    }

    // TODO: documentation
    function getMap() {
        // TODO: assert is inside map bounds
        var wrappedBounds = getWrappedBounds();
        return getPartialMap(wrappedBounds.minX, wrappedBounds.minY, wrappedBounds.maxX, wrappedBounds.maxY);
    }

    function isInsideMapBounds(minX, minY, maxX, maxY) {
        if (!bounds) {
            return true;
        }

        return minX >= bounds.minX && minY >= bounds.minY &&
               maxX <= bounds.maxX && maxY <= bounds.maxY;
    }

    function isInsideMapWrappedBounds(minX, minY, maxX, maxY) {
        var wrappedBounds = getWrappedBounds();
        return minX >= wrappedBounds.minX && minY >= wrappedBounds.minY &&
               maxX <= wrappedBounds.maxX && maxY <= wrappedBounds.maxY;
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

    function expandMapQ3(minX, minY) {
        // TODO: assert minX and maxY are Q3

        var i;
        var q3Limit = getQ3Limit();
        var missingColumns = q3Limit.x - minX;
        var missingRows = q3Limit.y - minY;

        for (i = 0; i < missingRows; i++) {
            map.q3.pushRow(Array(map.q3.cols()));
        }

        for (i = 0; i < missingColumns; i++) {
            map.q3.pushCol(Array(map.q3.rows()));
        }
    }

    function expandMapQ4(maxX, minY) {
        // TODO: assert maxX and maxY are Q3

        var i;
        var q4Limit = getQ4Limit();
        var missingColumns = maxX - q4Limit.x;
        var missingRows = q4Limit.y - minY;

        for (i = 0; i < missingRows; i++) {
            map.q4.pushRow(Array(map.q4.cols()));
        }

        for (i = 0; i < missingColumns; i++) {
            map.q4.pushCol(Array(map.q4.rows()));
        }
    }

    function expandMap(minX, minY, maxX, maxY) {
        if (!isInsideMapBounds(minX, minY, maxX, maxY)) {
            throw new Error('Cannot expand outside map bounds');
        }

        console.info(chalk.green('Start expansion'));
        expandMapQ1(maxX, maxY);
        expandMapQ2(minX, maxY);
        expandMapQ3(minX, minY);
        expandMapQ4(maxX, minY);
        console.info(chalk.green('End expansion'));
    }

    // init
    map = buildMap(initialSize);
    bounds = maxMapSize ? buildBounds(maxMapSize.horizontal, maxMapSize.vertical) : null;

    // public
    this.getWrappedBounds = getWrappedBounds;
    this.getPartialMap = getPartialMap;
    this.getMap = getMap;
    this.isInsideMapBounds = isInsideMapBounds;
    this.isInsideMapWrappedBounds = isInsideMapWrappedBounds;
    this.expandMap = expandMap;
    this.get = get;
    this.set = set;
}

module.exports = MapManager;

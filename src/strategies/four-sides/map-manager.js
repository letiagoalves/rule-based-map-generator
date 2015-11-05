'use strict';

var Matrix = require('functional-matrix');
var chalk = require('chalk');
var isInteger = require('mout/lang/isInteger');
var isObject = require('mout/lang/isObject');

var quadrantsHelper = require('./quadrants-helper.js');
var Block = require('./../../block');
var utils = require('./../../utils/utils.js');

function isValidMaxMapSize(maxMapSize) {
    if (!isObject(maxMapSize)) {
        return false;
    }

    if (!isInteger(maxMapSize.horizontal) || maxMapSize.horizontal < 2) {
        return false;
    }

    if (!isInteger(maxMapSize.vertical) || maxMapSize.vertical < 2) {
        return false;
    }

    return true;
}

function MapManager(initialSize, maxMapSize) {
    var map;
    var bounds;

    if (!isInteger(initialSize) || initialSize < 2) {
        throw new Error('initialSize is mandatory and must be a positive integer greater than 1');
    }

    if (maxMapSize && !isValidMaxMapSize(maxMapSize)) {
        throw new Error('maxMapSize must be an object with horizontal and vertical integer values greater than 1');
    }

    function buildMap(mapInitialSize) {
        // TODO: review this adjust value for an odd bound
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

        var horizontalHalf = Math.floor(horizontal / 2);
        var verticalHalf = Math.floor(vertical / 2);

        var minX = -horizontalHalf;
        var maxX = horizontalHalf + horizontalAdjustValue - 1;
        var minY = -verticalHalf;
        var maxY = verticalHalf + verticalAdjustValue - 1;

        return {
            minX: minX,
            minY: minY,
            maxX: maxX,
            maxY: maxY
        };
    }

    function getBounds() {
        return bounds;
    }

    function isPositionInsideMapBounds(x, y) {
        if (!bounds) {
            return true;
        }

        return x >= bounds.minX && x <= bounds.maxX &&
               y >= bounds.minY && y <= bounds.maxY;
    }

    function isInsideMapBounds(minX, minY, maxX, maxY) {
        if (!bounds) {
            return true;
        }

        return minX >= bounds.minX && minY >= bounds.minY &&
               maxX <= bounds.maxX && maxY <= bounds.maxY;
    }

    function get(x, y) {
        var row, col;

        if (!isInteger(x)) {
            throw new Error('x is mandatory and must be an Integer');
        }
        if (!isInteger(y)) {
            throw new Error('y is mandatory and must be an Integer');
        }

        if (!isPositionInsideMapBounds(x, y)) {
            throw new Error('x and y must be inside map bounds');
        }

        // just for readibility purposes
        row = y; col = x;

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

        throw new Error('Cannot get at position ({x}, {y})'.replace('{x}', x).replace('{y}', y));
    }

    function set(x, y, value) {
        var row, col;

        if (!isInteger(x)) {
            throw new Error('x is mandatory and must be an Integer');
        }
        if (!isInteger(y)) {
            throw new Error('y is mandatory and must be an Integer');
        }

        if (!isPositionInsideMapBounds(x, y)) {
            throw new Error('x and y must be inside map bounds');
        }

        // assert value is a Block or null
        if (value !== null && !utils.isInstanceOf(value, Block)) {
            throw new Error('value must be a {Block} instance or {null}');
        }

        // just for readibility purposes
        row = y; col = x;

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

        throw new Error('Cannot set at position ({x}, {y})'.replace('{x}', x).replace('{y}', y));
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

    function getQuadrantLimits() {
        return {
            q1: getQ1Limit(),
            q2: getQ2Limit(),
            q3: getQ3Limit(),
            q4: getQ4Limit()
        };
    }

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

    function getPartialMap(minX, minY, maxX, maxY) {
        var xSize, ySize;
        var subMapMatrix;

        if (minX >= maxX || minY >= maxY) {
            throw new Error('minX and minY must be less than maxX and maxY respectively');
        }

        if (!isInsideMapBounds(minX, minY, maxX, maxY)) {
            throw new Error('Cannot get partial map because is not inside map bounds');
        }

        xSize = Math.abs(maxX - minX) + 1;
        ySize = Math.abs(maxY - minY) + 1;
        subMapMatrix = new Matrix(xSize, ySize, function fillFunction (row, col) {
            return get(row + minX, col + minY);
        });

        return subMapMatrix.rotateCCW().to2dArray();
    }

    function getMap() {
        var wrappedBounds = getWrappedBounds();
        return getPartialMap(wrappedBounds.minX, wrappedBounds.minY, wrappedBounds.maxX, wrappedBounds.maxY);
    }

    function expandMapQ1(maxX, maxY) {
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

    function expandToPosition(x, y) {
        if (!isPositionInsideMapBounds(x, y)) {
            throw new Error('Cannot expand outside map bounds');
        }

        console.info(chalk.green('Start expansion for ', x, y));
        if (quadrantsHelper.isQ1(x, y)) {
            expandMapQ1(x, y);
        }
        if (quadrantsHelper.isQ2(x, y)) {
            expandMapQ2(x, y);
        }
        if (quadrantsHelper.isQ3(x, y)) {
            expandMapQ3(x, y);
        }
        if (quadrantsHelper.isQ4(x, y)) {
            expandMapQ4(x, y);
        }
        console.info(chalk.green('End expansion for ', x, y));
    }

    // init
    map = buildMap(initialSize);
    bounds = maxMapSize ? buildBounds(maxMapSize.horizontal, maxMapSize.vertical) : null;

    // TODO: document all public functions
    // public
    this.getBounds = getBounds;
    this.getWrappedBounds = getWrappedBounds;
    this.getQuadrantLimits = getQuadrantLimits;
    this.getPartialMap = getPartialMap;
    this.getMap = getMap;
    this.isInsideMapBounds = isInsideMapBounds;
    this.expandToPosition = expandToPosition;
    this.get = get;
    this.set = set;
}

module.exports = MapManager;

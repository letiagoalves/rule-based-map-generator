'use strict';

var Matrix = require('functional-matrix');
var betterConsole = require('better-console');

function MapManager(initialSize) {
    var quarterOfSize = initialSize / 2;
    // TODO: manage rest
    //var rest = initialSize % 2;
    var sizeForEachQadrant = Math.floor(quarterOfSize);

    this.map = {
        q1: new Matrix(sizeForEachQadrant, sizeForEachQadrant, 1),
        q2: new Matrix(sizeForEachQadrant, sizeForEachQadrant, 2),
        q3: new Matrix(sizeForEachQadrant, sizeForEachQadrant, 3),
        q4: new Matrix(sizeForEachQadrant, sizeForEachQadrant, 4),
    };
}

MapManager.prototype.getSubMap = function getSubMap (minX, minY, maxX, maxY) {
    var that = this;
    var xSize = Math.abs(maxX - minX) + 1;
    var ySize = Math.abs(maxY - minY) + 1;
    console.info(xSize, ySize);
    var subMapMatrix = new Matrix(xSize, ySize, function fillFunction (row, col) {
        return that.get(row + minY, col + minX);
    });

    return subMapMatrix.to2dArray();

}

MapManager.prototype.get = function get(x, y) {
    // TODO: assert integers
    var map = this.map;

    if (x >= 0) {
        if (y >= 0) { // Q1
            console.log('q1', x, y);
            return map.q1.get(x, y)
        } else {  // Q4
            console.log('q4', x, y);
            return map.q4.get(x, y + 1)
        }
    } else {
        if (y >= 0) { // Q2
            console.log('q2', x, y);
            return map.q2.get(x + 1, y)
        } else { // Q3
            console.log('q3', x, y);
            return map.q3.get(x + 1, y + 1)
        }
    }
};

MapManager.prototype.set = function get(x, y, value) {
    // TODO: assert integers
    var map = this.map;

    if (x >= 0) {
        if (y >= 0) { // Q1
            console.log('set q1', x, y);
            return map.q1.set(x, y, value)
        } else {  // Q4
            console.log('set q1', x, y);
            return map.q4.get(x + 1, y, value)
        }
    } else {
        if (y >= 0) { // Q2
            console.log('set q1', x, y);
            return map.q2.get(x, y + 1, value)
        } else { // Q3
            console.log('set q1', x, y);
            return map.q3.get(x + 1, y + 1, value)
        }
    }
};

MapManager.prototype.log = function log (minX, minY, maxX, maxY) {
    var subMap = this.getSubMap(minX, minY, maxX, maxY);
    subMap= subMap.map(function (arr) {
        return arr.map(function (value) {
            if(value === undefined) return 'undefined';
            if(value === null) return 'null';
            return value;
        });
    });
    betterConsole.table(subMap);
}

module.exports = MapManager;

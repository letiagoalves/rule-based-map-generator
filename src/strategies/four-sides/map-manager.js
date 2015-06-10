'use strict';

var Matrix = require('functional-matrix');

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

function isQ1(x, y) {
    return x >= 0 && y >= 0;
}

function isQ2(x, y) {
    return x < 0 && y >= 0;
}

function isQ3(x, y) {
    return x < 0 && y < 0;
}

function isQ4(x, y) {
    return x >= 0 && y < 0;
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

    if (isQ1(x, y)) {
        return map.q1.get(x, y);
    }

    if (isQ2(x, y)) {
        return map.q2.get(Math.abs(x) - 1, y);
    }

    if (isQ3(x, y)) {
        return map.q3.get(Math.abs(x) - 1, Math.abs(y) - 1);
    }

    if (isQ4(x, y)) {
        return map.q4.get(x, Math.abs(y) - 1);
    }

    throw new Error('cannot get');
};

MapManager.prototype.set = function get(x, y, value) {
    // TODO: assert integers and value
    var map = this.map;

    if (isQ1(x, y)) {
        return map.q1.set(x, y, value);
    }

    if (isQ2(x, y)) {
        return map.q2.set(Math.abs(x) - 1, y, value);
    }

    if (isQ3(x, y)) {
        return map.q3.set(Math.abs(x) - 1, Math.abs(y) - 1, value);
    }

    if (isQ4(x, y)) {
        return map.q4.set(x, Math.abs(y) - 1, value);
    }

    throw new Error('cannot set');
};

module.exports = MapManager;

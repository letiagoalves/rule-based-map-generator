'use strict';

var validator = require('./../../validator');

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

function assertBounds(minX, minY, maxX, maxY) {
    validator.assertBounds({
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY
    });
}

function getQ1PartOfMap(minX, minY, maxX, maxY) {
    assertBounds(minX, minY, maxX, maxY);

    return {
        minX: Math.max(0, minX),
        minY: Math.max(0, minY),
        maxX: Math.max(0, maxX),
        maxY: Math.max(0, maxY)
    };
}

function getQ2PartOfMap(minX, minY, maxX, maxY) {
    assertBounds(minX, minY, maxX, maxY);

    return {
        minX: Math.min(-1, minX),
        minY: Math.max(0, minY),
        maxX: Math.min(-1, maxX),
        maxY: Math.max(0, maxY)
    };
}

function getQ3PartOfMap(minX, minY, maxX, maxY) {
    assertBounds(minX, minY, maxX, maxY);

    return {
        minX: Math.min(-1, minX),
        minY: Math.min(-1, minY),
        maxX: Math.min(-1, maxX),
        maxY: Math.min(-1, maxY)
    };
}

function getQ4PartOfMap(minX, minY, maxX, maxY) {
    assertBounds(minX, minY, maxX, maxY);

    return {
        minX: Math.max(0, minX),
        minY: Math.min(-1, minY),
        maxX: Math.max(0, maxX),
        maxY: Math.min(-1, maxY)
    };
}

module.exports = {
    isQ1: isQ1,
    isQ2: isQ2,
    isQ3: isQ3,
    isQ4: isQ4,
    getQ1PartOfMap: getQ1PartOfMap,
    getQ2PartOfMap: getQ2PartOfMap,
    getQ3PartOfMap: getQ3PartOfMap,
    getQ4PartOfMap: getQ4PartOfMap
};

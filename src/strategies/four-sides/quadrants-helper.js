'use strict';

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

function getQ1PartOfMap(minX, minY, maxX, maxY) {
    return {
        minX: Math.max(0, minX),
        minY: Math.max(0, minY),
        maxX: maxX,
        maxY: maxY
    };
}

module.exports = {
    isQ1: isQ1,
    isQ2: isQ2,
    isQ3: isQ3,
    isQ4: isQ4,
    getQ1PartOfMap: getQ1PartOfMap
};

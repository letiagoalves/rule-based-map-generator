'use strict';

var betterConsole = require('better-console');
var arrayDifference = require('mout/array/difference');
var arrayIntersection = require('mout/array/intersection');

function createMapUsingCallback(arr, callback) {
    var map = {};
    arr.forEach(function set(value) {
        map[callback(value)] = value;
    });
    return map;
}

function createMapUsingProperty(arr, prop) {
    var map = {};
    arr.forEach(function set(value) {
        map[value[prop]] = value;
    });
    return map;
}

function applyWhitelist(victim, whitelist) {
    return arrayIntersection(victim, whitelist);
}

function applyBlackList(victim, blacklist) {
    return arrayDifference(victim, blacklist);
}

// helps in unit testing to pass through instanceof checks
function isInstanceOf(victim, constructor) {
    return victim instanceof constructor;
}

function logTable(table) {
    var blockTemplate = '{block} ({x}, {y})';
    table = table.map(function (arr) {
        return arr.map(function (value) {
            var b;

            switch (value.block) {
                case undefined:
                    b = 'undefined';
                    break;
                case null:
                    b = 'null';
                    break;
                default:
                    b = value.block;
            }
            return blockTemplate.replace('{block}', b)
                .replace('{x}', value.x)
                .replace('{y}', value.y);
        });
    });
    betterConsole.table(table);
}

module.exports = {
    createMapUsingProperty: createMapUsingProperty,
    createMapUsingCallback: createMapUsingCallback,
    applyWhitelist: applyWhitelist,
    applyBlackList: applyBlackList,
    isInstanceOf: isInstanceOf,
    logTable: logTable
};

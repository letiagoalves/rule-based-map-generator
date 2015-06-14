'use strict';

var fs = require('fs');
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


function writeJSONfile(obj, outputFilename) {
    fs.writeFile(outputFilename, JSON.stringify(obj, null, 4), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function logTable(table) {
    table = table.map(function (arr) {
        return arr.map(function (value) {
            if (value === undefined) {
                return 'undefined';
            }
            if (value === null) {
                return 'null';
            }
            return value;
        });
    });
    betterConsole.table(table);
}

module.exports = {
    createMapUsingProperty: createMapUsingProperty,
    createMapUsingCallback: createMapUsingCallback,
    applyWhitelist: applyWhitelist,
    applyBlackList: applyBlackList,
    writeJSONfile: writeJSONfile,
    logTable: logTable
};

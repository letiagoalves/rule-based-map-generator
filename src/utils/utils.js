'use strict';

var fs = require('fs');
var betterConsole = require('better-console');

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
    writeJSONfile: writeJSONfile,
    logTable: logTable
};

/*'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

describe.only('map-manager.js', function () {
    var victim;
    var rules;

    before(function () {
        victim = require('./../../../../src/strategies/four-sides/map-generator.js');
        rules = {
            blackAndWhiteLists: require('./../../../../src/strategies/four-sides/rules/blacklist.js'),
            maxOccupation: require('./../../../../src/strategies/four-sides/rules/max-occupation.js'),
            maxOccupationPercentage: require('./../../../../src/strategies/four-sides/rules/max-occupation-percentage.js'),
            minimumDistance: require('./../../../../src/strategies/four-sides/rules/minimum-distance.js')
        };
        sinon.stub(rules, 'blackAndWhiteLists', function () {
            console.log('hey');
        });
    });

    describe('selectBlock', function () {
        var neighboursMock = { UP: null, LEFT: null, BOTTOM: null, RIGHT: null };
        var blocksMapMock = {
            B1: {}
        };

        it('stuff', function () {
            console.log('rules', rules);
            victim.selectBlock(neighboursMock, blocksMapMock);
        });

    });

});
*/

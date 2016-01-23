'use strict';

var expect = require('chai').expect;

describe.skip('api/index.js', function () {
    var victim;
    var validNumberOfSides = 4;

    before(function () {
        victim = require('./../../../src/api/index.js');
    });

    describe('createBlockFactory', function () {});

    describe('createConnectorInstance', function () {});

    describe('createWorldInstance', function () {

        describe('strategy assertion', function () {
            it('should fail when a invalid strategy is passed', function () {
                expect(true).to.be.equal(false);
            });
        });

        describe('seed validation', function () {

            it('should fail when a seed is not passed', function () {
                expect(function () {
                    victim.createWorldInstance(validNumberOfSides, {});
                }).to.throw(Error, 'seed must be an integer and greater than 0 {Number}');
            });

        });

    });

});

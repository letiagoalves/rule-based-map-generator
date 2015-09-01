'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

describe.only('world-constraints/index.js', function () {
    var victim;

    before(function () {
        victim = require('./../../../src/world-constraints/index.js');
    });

    describe('constructor', function () {
        var validBound = 10;

        describe('bounds', function () {
            it('should pass when bounds are undefined', function () {
                expect(function () {
                    new victim(undefined);
                }).to.not.throw();
            });

            it('should fail when a non object is passed', sinon.test(function () {
                this.stub(console, 'error');
                expect(function () {
                    new victim(null);
                }).to.throw(Error, 'must be an object');
            }));

            it('should fail when a invalid horizontal bound is passed', sinon.test(function () {
                this.stub(console, 'error');
                expect(function () {
                    new victim({
                        vertical: validBound
                    });
                }).to.throw(Error, '"horizontal" is required');
            }));

            it('should fail when a invalid vertical bound is passed', sinon.test(function () {
                this.stub(console, 'error');
                expect(function () {
                    new victim({
                        horizontal: validBound
                    });
                }).to.throw(Error, '"vertical" is required');
            }));
        });

    });

});

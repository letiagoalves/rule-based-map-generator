'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

describe('validator/index.js', function () {
    var victim;

    before(function () {
        victim = require('./../../../src/validator/index.js');
    });

    describe('assertBounds', function () {

        it('should throw a "required" error when nothing is passed', function () {
            expect(function () {
                victim.assertBounds();
            }).to.throw(Error, 'is required');
        });

        it('should throw a "must be an object" error when a non object is passed', function () {
            function expectToThrow(value) {
                expect(function () {
                    victim.assertBounds(value);
                }).to.throw(Error, 'must be an object');
            }
            [[1, 2, 3], 'string', 3, null, true].forEach(expectToThrow);
        });

        it('should throw a "is required" error when a key is missing', function () {
            function expectToThrow(value) {
                expect(function () {
                    victim.assertBounds(value);
                }).to.throw(Error);
            }

            expectToThrow({
                minY: 1,
                maxX: 2,
                maxY: 2
            });

            expectToThrow({
                minX: 1,
                maxX: 2,
                maxY: 2
            });

            expectToThrow({
                minX: 1,
                minY: 1,
                maxY: 2
            });

            expectToThrow({
                minX: 1,
                minY: 1,
                maxX: 1
            });
        });

        it('should throw a "must be less than" Error when maxX is not greater than minX', function () {
            expect(function () {
                victim.assertBounds({
                    minX: 1,
                    minY: 1,
                    maxX: 1,
                    maxY: 2
                });
            }).to.throw(Error, '"minX" must be less than');
        });

        it('should throw a "must be less than" Error when maxX is not greater than minX', function () {
            expect(function () {
                victim.assertBounds({
                    minX: 1,
                    minY: 1,
                    maxX: 2,
                    maxY: 1
                });
            }).to.throw(Error, '"minY" must be less than');
        });

        it('should not throw when valid bounds are passed', function () {
            expect(function () {
                victim.assertBounds({
                    minX: 1,
                    minY: 1,
                    maxX: 2,
                    maxY: 2
                });
            }).to.not.throw();
        });

    });

    describe('assert', function () {
        var Joi;

        before(function () {
            Joi = require('joi');
        });

        it('should throw when passed value fails against schema', sinon.test(function () {
            var spy = this.stub(console, 'error');
            var message = 'some message';

            expect(function () {
                victim.assert([], Joi.object(), message);
            }).to.throw(Error);

            expect(spy.calledOnce).to.be.equal(true);
            expect(spy.calledWith('some message'));
        }));

        it('should return default value defined by passed schema when no value is passed', sinon.test(function () {
            var result;

            expect(function () {
                result = victim.assert(undefined, Joi.number().default(3));
            }).to.not.throw();

            expect(result).to.be.equal(3);
        }));

        it('should return passed value when is valid against passed schema', sinon.test(function () {
            var result;
            var value = 'some value';

            expect(function () {
                result = victim.assert(value, Joi.string().required());
            }).to.not.throw();

            expect(result).to.be.equal('some value');
        }));


    });

});

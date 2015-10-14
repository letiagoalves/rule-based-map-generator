'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

describe.skip('world-constraints/index.js', function () {
    //var Victim;

    before(function () {
        //Victim = require('./../../../src/world-constraints/index.js');
    });

    describe('constructor', function () {
        //var validBound = 10;

        describe('bounds', function () {
            it('should pass when bounds are undefined', function () {
                expect(function () {
                    //new Victim(undefined);
                }).to.not.throw();
            });

            it('should fail when a non object is passed', sinon.test(function () {
                this.stub(console, 'error');
                expect(function () {
                    //new Victim(null);
                }).to.throw(Error, 'must be an object');
            }));

            it('should fail when a invalid horizontal bound is passed', sinon.test(function () {
                this.stub(console, 'error');
                expect(function () {
                    /*
                    new Victim({
                        vertical: validBound
                    });*/
                }).to.throw(Error, '"horizontal" is required');
            }));

            it('should fail when a invalid vertical bound is passed', sinon.test(function () {
                this.stub(console, 'error');
                expect(function () {
                    /*new Victim({
                        horizontal: validBound
                    });*/
                }).to.throw(Error, '"vertical" is required');
            }));
        });

    });

});

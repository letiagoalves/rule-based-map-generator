'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

describe('connector/index.js', function () {
    var Victim;
    var consoleErrorStub;

    var validId = 'someId';
    var validType = 'whitelist';
    var validBlockIds = ['validBlockId'];
    var validBlockClasses = ['validBlockCass1', 'validBlockCass2'];

    before(function () {
        consoleErrorStub = sinon.stub(console, 'error');
        Victim = require('./../../../src/connector/index.js');
    });

    after(function () {
        consoleErrorStub.restore();
    });

    describe('constructor', function () {

        describe('assertions', function () {

            describe('id', function () {
                it('should fail when id is not a string', function () {
                    expect(function () { new Victim(); }).to.throw('is required');
                    expect(function () { new Victim(0); }).to.throw('must be a string');
                });
            });

            describe('type', function () {
                it('should fail when type is not "whitelist" or "blacklist"', function () {
                    expect(function () { new Victim(validId); }).to.throw('is required');
                    expect(function () { new Victim(validId, 0); }).to.throw('must be a string');
                    expect(function () { new Victim(validId, 'invalid'); }).to.throw('[blacklist, whitelist]');
                });
            });

            describe('blockIds', function () {
                it('should fail when blockIds is invalid', function () {
                    expect(function () { new Victim(validId, validType); }).to.throw('is required');
                    expect(function () { new Victim(validId, validType, 0); }).to.throw('must be an array');
                    expect(function () { new Victim(validId, validType, []); }).to.throw('at least 1 items');
                });
            });

            describe('blockClasses', function () {
                it('should fail when blockClasses is not an array', function () {
                    expect(function () { new Victim(validId, validType, validBlockIds, 0); }).to.throw('must be an array');
                });

                it('should default to an empty array when argument is not passed', function () {
                    var connector;
                    expect(function () {
                        connector = new Victim(validId, validType, validBlockIds);
                    }).to.not.throw();
                    expect(connector.getBlockClasses()).to.be.an('array').and.to.be.empty;
                });
            });

        });

        describe('getters', function () {
            var connector;
            before(function () {
                connector = new Victim(validId, validType, validBlockIds, validBlockClasses);
            });

            it('should return the connector ID', function () {
                expect(connector.getId()).to.be.equal('someId');
            });

            it('should return the connector type', function () {
                expect(connector.getType()).to.be.equal('whitelist');
            });

            it('should return a copy of the connector blockIds', function () {
                expect(connector.getBlockIds()).to.be.not.equal(validBlockIds);
                expect(connector.getBlockIds()).to.be.deep.equal(validBlockIds);
            });
        });

    });

});

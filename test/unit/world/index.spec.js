'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var Strategy = require('./../../../src/strategies/strategy.js');
var WorldConstraints = require('./../../../src/world-constraints/');
var Block = require('./../../../src/block/');

chai.use(require('sinon-chai'));

describe('world/index.js', function () {
    var Victim;
    var consoleErrorStub;

    var noop = function () {};
    var validId = 'someId';
    var validStrategy = new Strategy({
        getSidesTemplate: function () {
            return ['UP', 'RIGHT', 'BOTTOM', 'LEFT'];
        },
        init: noop,
        getAtPosition: noop,
        getPartialMap: noop,
        getMap: noop
    });
    var validWorldConstraints = new WorldConstraints(10, null, null);
    var validBlock = new Block(validStrategy, 'some block id');

    before(function () {
        consoleErrorStub = sinon.stub(console, 'error');
        Victim = require('./../../../src/world/index.js');
    });

    after(function () {
        consoleErrorStub.restore();
    });

    describe('constructor', function () {

        describe('assertions', function () {

            describe('strategy', function () {
                it('should fail when strategy is not an instance of Strategy', function () {
                    expect(function () {
                        new Victim();
                    }).to.throw('is required');
                    expect(function () {
                        new Victim({});
                    }).to.throw('must be an instance of "Strategy"');
                });
            });

            describe('constraints', function () {
                it('should fail when constraints is not an instance of WorldConstraints', function () {
                    expect(function () {
                        new Victim(validStrategy);
                    }).to.throw('is required');
                    expect(function () {
                        new Victim(validStrategy, {});
                    }).to.throw('must be an instance of "WorldConstraints"');
                });
            });

            describe('blocks', function () {
                it('should fail when blocks is not an array of Block instances', function () {
                    expect(function () {
                        new Victim(validStrategy, validWorldConstraints);
                    }).to.throw('is required');
                    expect(function () {
                        new Victim(validStrategy, validWorldConstraints, {});
                    }).to.throw('must be an array');
                    expect(function () {
                        new Victim(validStrategy, validWorldConstraints, []);
                    }).to.throw('must contain at least 2 items');
                    expect(function () {
                        new Victim(validStrategy, validWorldConstraints, [{}, {}]);
                    }).to.throw('must be an instance of "Block"');
                });
            });

        });

        describe('methods', function () {
            var world;
            var strategy;
            var setOfBlocks = [validBlock, validBlock];

            beforeEach(function () {
                strategy = new Strategy({
                    getSidesTemplate: sinon.stub(),
                    init: sinon.stub(),
                    getAtPosition: sinon.stub(),
                    getPartialMap: sinon.stub().returns('strategy.getPartialMap response'),
                    getMap: sinon.stub().returns('strategy.getMap response')
                });
                world = new Victim(strategy, validWorldConstraints, setOfBlocks);
            });

            describe('start', function () {
                it('should init strategy', function () {
                    world.start();
                    expect(strategy.init).to.have.been.called.once;
                    expect(strategy.init).to.have.been.calledWithExactly(validWorldConstraints, setOfBlocks);
                });

                it('should set hasStarted flag as true', function () {
                    world.start();
                    expect(world.hasStarted()).to.be.true;
                });

                it('should throw an error when instance has already started', function () {
                    expect(function () {
                        world.start();
                    }).to.not.throw(Error);
                    expect(function () {
                        world.start();
                    }).to.throw('World instance already started');
                });
            });

            describe('hasStarted', function () {
                it('should be false before start()', function () {
                    expect(world.hasStarted()).to.be.false;
                });
            });

            describe('getPartialMap', function () {

                describe('coordinates assertions', function () {
                    it('should throw when invalid minX is passed', function () {
                        expect(function () { world.getPartialMap(); }).to.throw('is required');
                        expect(function () { world.getPartialMap({}); }).to.throw('must be a number');
                    });
                    it('should throw when invalid minY is passed', function () {
                        expect(function () { world.getPartialMap(0); }).to.throw('is required');
                        expect(function () { world.getPartialMap(0, {}); }).to.throw('must be a number');
                    });
                    it('should throw when invalid maxX is passed', function () {
                        expect(function () { world.getPartialMap(0, 0); }).to.throw('is required');
                        expect(function () { world.getPartialMap(0, 0, {}); }).to.throw('must be a number');
                    });
                    it('should throw when invalid maxY is passed', function () {
                        expect(function () { world.getPartialMap(0, 0, 2); }).to.throw('is required');
                        expect(function () { world.getPartialMap(0, 0, 2, {}); }).to.throw('must be a number');
                    });
                });

                it('should throw an error when instance has not started', function () {
                    expect(function () {
                        world.getPartialMap(0, 0, 2, 2);
                    }).to.throw('World instance not started');
                });

                it('should return the strategy.getPartialMap call result', function () {
                    var partialMap;

                    world.start();
                    partialMap = world.getPartialMap(0, 0, 2, 2);
                    expect(strategy.getPartialMap).to.have.been.called.once;
                    expect(partialMap).to.be.equal('strategy.getPartialMap response');
                });

            });

            describe('getMap', function () {
                it('should throw an error when instance has not started', function () {
                    expect(function () {
                        world.getMap();
                    }).to.throw('World instance not started');
                });

                it('should return the strategy.getMap call result', function () {
                    var map;

                    world.start();
                    map = world.getMap();
                    expect(strategy.getMap).to.have.been.called.once;
                    expect(map).to.be.equal('strategy.getMap response');
                });
            });

        });

    });
});

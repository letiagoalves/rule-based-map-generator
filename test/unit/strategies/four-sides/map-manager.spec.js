'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var MapManager = require('./../../../../src/strategies/four-sides/map-manager.js');
var validator = require('./../../../../src/validator/');
var utils = require('./../../../../src/utils/utils.js');

describe('map-manager.js', function () {

    describe('Constructor', function () {

        it('should build map with initial size', function () {
            var mapManager = new MapManager(6);
            var map = mapManager.getMap();
            var mapColumnLengths = map.map(function getLength(row) {
                return row.length;
            });

            // validate map height
            expect(map.length).to.be.equal(6);

            // validate map width
            mapColumnLengths.forEach(function (columnLength) {
                expect(columnLength).to.be.equal(6);
            });
        });

        // TODO: test for event initial size
    });

    describe('set', function () {

        // TODO: assertions tests

        it('should set in correct map positions', sinon.test(function () {
            var mapManager = new MapManager(4);

            this.stub(validator, 'assert');
            this.stub(utils, 'isInstanceOf').returns(true);

            mapManager.set(-2, -2, '-2:-2');
            mapManager.set(-2, 0, '-2:0');
            mapManager.set(-1, -1, '-1:-1');
            mapManager.set(-1, 1, '-1:1');
            mapManager.set(0, -2, '0:-2');
            mapManager.set(0, 0, '0:0');
            mapManager.set(1, -1, '1:-1');
            mapManager.set(1, 1, '1:1');

            expect(mapManager.getMap()).to.be.eql([[
                undefined, '-1:1', undefined, '1:1'
            ], [
                '-2:0', undefined, '0:0', undefined
            ], [
                undefined, '-1:-1', undefined, '1:-1'
            ], [
                '-2:-2', undefined, '0:-2', undefined
            ]]);
        }));

    });

    describe('get', function () {
        it('should get from correct positions', sinon.test(function () {
            var mapManager = new MapManager(4);

            this.stub(validator, 'assert');
            this.stub(utils, 'isInstanceOf').returns(true);

            mapManager.set(-2, -2, '-2:-2');
            mapManager.set(-2, 0, '-2:0');
            mapManager.set(-1, -1, '-1:-1');
            mapManager.set(-1, 1, '-1:1');
            mapManager.set(0, -2, '0:-2');
            mapManager.set(0, 0, '0:0');
            mapManager.set(1, -1, '1:-1');
            mapManager.set(1, 1, '1:1');

            expect(mapManager.get(-2, -2)).to.be.equal('-2:-2');
            expect(mapManager.get(-2, 0)).to.be.equal('-2:0');
            expect(mapManager.get(-1, -1)).to.be.equal( '-1:-1');
            expect(mapManager.get(-1, 1)).to.be.equal('-1:1');
            expect(mapManager.get(0, -2)).to.be.equal('0:-2');
            expect(mapManager.get(0, 0)).to.be.equal('0:0');
            expect(mapManager.get(1, -1)).to.be.equal('1:-1');
            expect(mapManager.get(1, 1)).to.be.equal('1:1');
        }));
    });

    describe('expandToPosition', function () {

        describe('q1', function () {
            var victim;

            beforeEach(function () {
                victim = new MapManager(4);
            });

            it('should expand upwards', function () {
                var quadrantLimits;

                victim.expandToPosition(0, 2);
                quadrantLimits = victim.getQuadrantLimits();

                expect(quadrantLimits.q1).to.be.deep.equal({ x: 1, y: 2 });
                expect(quadrantLimits.q2).to.be.deep.equal({ x: -2, y: 1 });
                expect(quadrantLimits.q3).to.be.deep.equal({ x: -2, y: -2 });
                expect(quadrantLimits.q4).to.be.deep.equal({ x: 1, y: -2 });
            });

            it('should expand to the right side', function () {
                var quadrantLimits;

                victim.expandToPosition(2, 0);
                quadrantLimits = victim.getQuadrantLimits();

                expect(quadrantLimits.q1).to.be.deep.equal({ x: 2, y: 1 });
                expect(quadrantLimits.q2).to.be.deep.equal({ x: -2, y: 1 });
                expect(quadrantLimits.q3).to.be.deep.equal({ x: -2, y: -2 });
                expect(quadrantLimits.q4).to.be.deep.equal({ x: 1, y: -2 });
            });

            it('should expand both right and upwards', function () {
                var quadrantLimits;

                victim.expandToPosition(2, 2);
                quadrantLimits = victim.getQuadrantLimits();

                expect(quadrantLimits.q1).to.be.deep.equal({ x: 2, y: 2 });
                expect(quadrantLimits.q2).to.be.deep.equal({ x: -2, y: 1 });
                expect(quadrantLimits.q3).to.be.deep.equal({ x: -2, y: -2 });
                expect(quadrantLimits.q4).to.be.deep.equal({ x: 1, y: -2 });
            });

        });

        describe('q2', function () {
            var victim;

            beforeEach(function () {
                victim = new MapManager(4);
            });

            it('should expand upwards', function () {
                var quadrantLimits;

                victim.expandToPosition(-1, 2);
                quadrantLimits = victim.getQuadrantLimits();

                expect(quadrantLimits.q1).to.be.deep.equal({ x: 1, y: 1 });
                expect(quadrantLimits.q2).to.be.deep.equal({ x: -2, y: 2 });
                expect(quadrantLimits.q3).to.be.deep.equal({ x: -2, y: -2 });
                expect(quadrantLimits.q4).to.be.deep.equal({ x: 1, y: -2 });
            });

            it('should expand to the left side', function () {
                var quadrantLimits;

                victim.expandToPosition(-5, 1);
                quadrantLimits = victim.getQuadrantLimits();

                expect(quadrantLimits.q1).to.be.deep.equal({ x: 1, y: 1 });
                expect(quadrantLimits.q2).to.be.deep.equal({ x: -5, y: 1 });
                expect(quadrantLimits.q3).to.be.deep.equal({ x: -2, y: -2 });
                expect(quadrantLimits.q4).to.be.deep.equal({ x: 1, y: -2 });
            });

            it('should expand both left and upwards', function () {
                var quadrantLimits;

                victim.expandToPosition(-7, 9);
                quadrantLimits = victim.getQuadrantLimits();

                expect(quadrantLimits.q1).to.be.deep.equal({ x: 1, y: 1 });
                expect(quadrantLimits.q2).to.be.deep.equal({ x: -7, y: 9 });
                expect(quadrantLimits.q3).to.be.deep.equal({ x: -2, y: -2 });
                expect(quadrantLimits.q4).to.be.deep.equal({ x: 1, y: -2 });
            });

        });

        describe('q3', function () {
            var victim;

            beforeEach(function () {
                victim = new MapManager(4);
            });

            it('should expand downwards', function () {
                var quadrantLimits;

                victim.expandToPosition(-1, -3);
                quadrantLimits = victim.getQuadrantLimits();

                expect(quadrantLimits.q1).to.be.deep.equal({ x: 1, y: 1 });
                expect(quadrantLimits.q2).to.be.deep.equal({ x: -2, y: 1 });
                expect(quadrantLimits.q3).to.be.deep.equal({ x: -2, y: -3 });
                expect(quadrantLimits.q4).to.be.deep.equal({ x: 1, y: -2 });
            });

            it('should expand to the left side', function () {
                var quadrantLimits;

                victim.expandToPosition(-3, -1);
                quadrantLimits = victim.getQuadrantLimits();

                expect(quadrantLimits.q1).to.be.deep.equal({ x: 1, y: 1 });
                expect(quadrantLimits.q2).to.be.deep.equal({ x: -2, y: 1 });
                expect(quadrantLimits.q3).to.be.deep.equal({ x: -3, y: -2 });
                expect(quadrantLimits.q4).to.be.deep.equal({ x: 1, y: -2 });
            });

            it('should expand both left and downwards', function () {
                var quadrantLimits;

                victim.expandToPosition(-7, -5);
                quadrantLimits = victim.getQuadrantLimits();

                expect(quadrantLimits.q1).to.be.deep.equal({ x: 1, y: 1 });
                expect(quadrantLimits.q2).to.be.deep.equal({ x: -2, y: 1 });
                expect(quadrantLimits.q3).to.be.deep.equal({ x: -7, y: -5 });
                expect(quadrantLimits.q4).to.be.deep.equal({ x: 1, y: -2 });
            });
        });

        describe('q4', function () {
            var victim;

            beforeEach(function () {
                victim = new MapManager(4);
            });

            it('should expand downwards', function () {
                var quadrantLimits;

                victim.expandToPosition(0, -3);
                quadrantLimits = victim.getQuadrantLimits();

                expect(quadrantLimits.q1).to.be.deep.equal({ x: 1, y: 1 });
                expect(quadrantLimits.q2).to.be.deep.equal({ x: -2, y: 1 });
                expect(quadrantLimits.q3).to.be.deep.equal({ x: -2, y: -2 });
                expect(quadrantLimits.q4).to.be.deep.equal({ x: 1, y: -3 });
            });

            it('should expand to the right side', function () {
                var quadrantLimits;

                victim.expandToPosition(2, -1);
                quadrantLimits = victim.getQuadrantLimits();

                expect(quadrantLimits.q1).to.be.deep.equal({ x: 1, y: 1 });
                expect(quadrantLimits.q2).to.be.deep.equal({ x: -2, y: 1 });
                expect(quadrantLimits.q3).to.be.deep.equal({ x: -2, y: -2 });
                expect(quadrantLimits.q4).to.be.deep.equal({ x: 2, y: -2 });
            });

            it('should expand both right and downwards', function () {
                var quadrantLimits;

                victim.expandToPosition(4, -6);
                quadrantLimits = victim.getQuadrantLimits();

                expect(quadrantLimits.q1).to.be.deep.equal({ x: 1, y: 1 });
                expect(quadrantLimits.q2).to.be.deep.equal({ x: -2, y: 1 });
                expect(quadrantLimits.q3).to.be.deep.equal({ x: -2, y: -2 });
                expect(quadrantLimits.q4).to.be.deep.equal({ x: 4, y: -6 });
            });
        });

    });

    describe('isInsideMapBounds', function () {
        var initialSize = 4;

        describe('with maximum size', function () {
            var victim;
            var maximumSize = { horizontal: 4, vertical: 8 };

            beforeEach(function () {
                victim = new MapManager(initialSize, maximumSize);
            });

            it('should return false when outside boundaries', function () {
                // exceed horizontal
                expect(victim.isInsideMapBounds(-3, -1, 0, 0)).to.be.false;
                expect(victim.isInsideMapBounds(0, 0, 2, 1)).to.be.false;
                // exceed vertical
                expect(victim.isInsideMapBounds(-2, -5, 0, 0)).to.be.false;
                expect(victim.isInsideMapBounds(0, 0, 1, 5)).to.be.false;
            });

            it('should return true when inside boundaries', function () {
                expect(victim.isInsideMapBounds(-1, -1, 1, 1)).to.be.true;
            });
        });

        describe('without maximum size', function () {
            var victim;

            it('should always return true', function () {
                victim = new MapManager(initialSize);

                expect(victim.isInsideMapBounds(-1, -1, 1, 1)).to.be.true;
                expect(victim.isInsideMapBounds(-100, -100, 200, 200)).to.be.true;
            });
        });

    });

});

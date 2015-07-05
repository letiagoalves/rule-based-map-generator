'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var MapManager = require('./../../../../src/strategies/four-sides/map-manager.js');
var validator = require('./../../../../src/validator/');

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

    describe('expandMap', function () {

        describe('q1', function () {
            var victim;

            beforeEach(function () {
                victim = new MapManager(4);
            });

            it('should expand upwards', function () {
                var mapBounds;

                victim.expandMap(0, 0, 1, 2);
                mapBounds = victim.getMapBounds();

                expect(mapBounds.minX).to.be.equal(-2);
                expect(mapBounds.minY).to.be.equal(-2);
                expect(mapBounds.maxX).to.be.equal(1);
                expect(mapBounds.maxY).to.be.equal(2);
            });

            it('should expand to the right side', function () {
                var mapBounds;

                victim.expandMap(0, 0, 2, 1);
                mapBounds = victim.getMapBounds();

                expect(mapBounds.minX).to.be.equal(-2);
                expect(mapBounds.minY).to.be.equal(-2);
                expect(mapBounds.maxX).to.be.equal(2);
                expect(mapBounds.maxY).to.be.equal(1);
            });

            it('should expand both ways', function () {
                var mapBounds;

                victim.expandMap(0, 0, 2, 2);
                mapBounds = victim.getMapBounds();

                expect(mapBounds.minX).to.be.equal(-2);
                expect(mapBounds.minY).to.be.equal(-2);
                expect(mapBounds.maxX).to.be.equal(2);
                expect(mapBounds.maxY).to.be.equal(2);
            });

        });

    });

});

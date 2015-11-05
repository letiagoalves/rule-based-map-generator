'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

describe('utils/index.js', function () {
    var victim;

    before(function () {
        victim = require('./../../../src/utils/utils.js');
    });

    describe('createMapUsingProperty', function () {
        var result;
        var arr = [{
            someProperty: 1
        }, {
            someProperty: 2
        }];
        var property = 'someProperty';

        before(function () {
            result = victim.createMapUsingProperty(arr, property);
        });

        it('should have two key value pairs', function () {
            expect(result).to.have.property('1', arr[0]);
            expect(result).to.have.property('2', arr[1]);
        });
    });

    describe('createMapUsingCallback', function () {
        var result;
        var arr = [{}, {}];
        var callback;

        before(function () {
            callback = sinon.stub();
            callback.onCall(0).returns('key1');
            callback.onCall(1).returns('key2');

            result = victim.createMapUsingCallback(arr, callback);
        });

        it('should have two key value pairs', function () {
            expect(result).to.have.property('key1', arr[0]);
            expect(result).to.have.property('key2', arr[1]);
        });
    });

    describe('applyWhitelist', function () {
        var result;

        beforeEach(function () {
            var list = ['A', 'B', 'C'];
            var whitelist = ['B'];
            result = victim.applyWhitelist(list, whitelist);
        });

        it('should not have element A', function () {
            expect(result).to.not.contain('A');
        });

        it('should not have element C', function () {
            expect(result).to.not.contain('C');
        });

        it('should have element B', function () {
            expect(result).to.contain('B');
        });

        it('should have a size equal or lower than passed whitelist', function () {
            expect(result).to.have.length.at.most(1);
        });

    });

    describe('applyBlackList', function () {
        var result;

        beforeEach(function () {
            var list = ['A', 'B', 'C'];
            var blacklist = ['B'];
            result = victim.applyBlackList(list, blacklist);
        });

        it('should have element A', function () {
            expect(result).to.contain('A');
        });

        it('should have element C', function () {
            expect(result).to.contain('C');
        });

        it('should have element B', function () {
            expect(result).to.not.contain('B');
        });

        it('should have a size equal or lower than passed whitelist', function () {
            expect(result).to.have.length.at.most(2);
        });
    });

    describe('isInstanceOf', function () {
        it('should return true when first argument is instance of second argument', function () {
            var isInstanceOf = victim.isInstanceOf(new Number(3), Number);
            expect(isInstanceOf).to.be.true;
        });

        it('should return false when first argument is instance of second argument', function () {
            var isInstanceOf = victim.isInstanceOf(new String('some string'), Number);
            expect(isInstanceOf).to.be.false;
        });
    });

});

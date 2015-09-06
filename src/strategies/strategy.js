'use strict';

var Joi = require('joi');

var validator = require('./../validator');

var interfaceSchema = Joi.object().keys({
    getSidesTemplate: Joi.func().required(),
    init: Joi.func().required(),
    getAtPosition: Joi.func().required(),
    getPartialMap: Joi.func().required(),
    getMap: Joi.func().required()
}).required();

var interfaceDeclaration = ['getSidesTemplate', 'init', 'getAtPosition', 'getPartialMap', 'getMap'];

function Strategy(interfaceImplementation) {
    var that = this;

    interfaceImplementation = validator.assert(interfaceImplementation, interfaceSchema, 'Strategy.interfaceImplementation');

    // set interface methods
    interfaceDeclaration.forEach(function setMethodImplementation (methodName) {
        that[methodName] = interfaceImplementation[methodName];
    });
}

module.exports = Strategy;

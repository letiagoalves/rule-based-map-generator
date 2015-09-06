'use strict';

var Joi = require('joi');
var Strategy = require('./../strategies/strategy.js');

var idSchema = Joi.string().required();
var classesSchema = Joi.array().items(Joi.string()).default([]);
var strategySchema = Joi.object().type(Strategy).required();
var constraintsSchema = Joi.object().keys({
    maxOccupation: Joi.number().greater(0).default(null),
    maxOccupationPercentage: Joi.number().greater(0).less(100).default(null),
    minimumDistance: Joi.object().default(null)
}).default({});

module.exports = {
    id: idSchema,
    classes: classesSchema,
    strategy: strategySchema,
    constraints: constraintsSchema
};

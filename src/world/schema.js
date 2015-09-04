'use strict';

var Joi = require('joi');
var Block = require('./../block');
var WorldConstraints = require('./../world-constraints');

var strategySchema = Joi.object().keys({
    init: Joi.func().required(),
    getAtPosition: Joi.func().required(),
    getPartialMap: Joi.func().required(),
    getMap: Joi.func().required()
}).required();

var blocksSchema = Joi.array().items(Joi.object().type(Block)).min(2).required();

var constraintsSchema = Joi.object().type(WorldConstraints).required();

module.exports = {
    strategy: strategySchema,
    blocks: blocksSchema,
    constraints: constraintsSchema
};
